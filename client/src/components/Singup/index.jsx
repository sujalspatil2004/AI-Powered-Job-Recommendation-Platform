import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import config from "../../config";

const Signup = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        location: "",
        yearsOfExperience: "",
        skills: [],
        preferredJobType: "any"
    });
    const [error, setError] = useState("");
    const [skillInput, setSkillInput] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        if (input.name === 'yearsOfExperience') {
            const value = Math.max(0, parseInt(input.value) || 0);
            setData({ ...data, [input.name]: value });
        } else {
            setData({ ...data, [input.name]: input.value });
        }
    };

    const addSkill = () => {
        if (!skillInput.trim()) return;
        if (!data.skills.includes(skillInput.trim())) {
            setData({ ...data, skills: [...data.skills, skillInput.trim()] });
        }
        setSkillInput("");
    };

    const removeSkill = (skillToRemove) => {
        setData({
            ...data,
            skills: data.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (currentStep === 1) {
            if (!data.firstName || !data.lastName || !data.email || !data.password) {
                setError("Please fill in all required fields");
                return;
            }
        }
        setCurrentStep(2);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Register user
            await axios.post(`${config.apiUrl}/api/users`, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password
            });

            // Login to get token
            const { data: loginRes } = await axios.post(`${config.apiUrl}/api/auth`, {
                email: data.email,
                password: data.password
            });

            // Set token in localStorage
            localStorage.setItem("token", loginRes.data);
            localStorage.setItem("isAdmin", loginRes.isAdmin);

            // Update profile with additional info
            if (data.location || data.yearsOfExperience || data.skills.length > 0) {
                await axios.post(
                    `${config.apiUrl}/api/users/profile`,
                    {
                        location: data.location,
                        yearsOfExperience: data.yearsOfExperience,
                        skills: data.skills,
                        preferredJobType: data.preferredJobType
                    },
                    {
                        headers: { "Authorization": `Bearer ${loginRes.data}` }
                    }
                );
            }

            navigate("/");
        } catch (error) {
            if (error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && skillInput) {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/login">
                        <button type="button" className={styles.white_btn}>
                            Sign In
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form
                        className={styles.form_container}
                        onSubmit={currentStep === 1 ? handleNextStep : handleSubmit}
                    >
                        <h1>Create Account</h1>
                        {currentStep === 1 ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    name="firstName"
                                    onChange={handleChange}
                                    value={data.firstName}
                                    required
                                    className={styles.input}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    name="lastName"
                                    onChange={handleChange}
                                    value={data.lastName}
                                    required
                                    className={styles.input}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    onChange={handleChange}
                                    value={data.email}
                                    required
                                    className={styles.input}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    onChange={handleChange}
                                    value={data.password}
                                    required
                                    className={styles.input}
                                />
                            </>
                        ) : (
                            <>
                                <p className={styles.step_description}>
                                    Add your professional details to get better job matches
                                    (optional but recommended)
                                </p>
                                <input
                                    type="text"
                                    placeholder="Location (e.g., New York, NY)"
                                    name="location"
                                    onChange={handleChange}
                                    value={data.location}
                                    className={styles.input}
                                />
                                <input
                                    type="number"
                                    placeholder="Years of Experience"
                                    name="yearsOfExperience"
                                    min="0"
                                    onChange={handleChange}
                                    value={data.yearsOfExperience}
                                    className={styles.input}
                                />
                                <div className={styles.skills_container}>
                                    <input
                                        type="text"
                                        placeholder="Add your skills"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className={styles.input}
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className={styles.add_btn}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className={styles.skills_list}>
                                    {data.skills.map((skill, index) => (
                                        <div key={index} className={styles.skill_item}>
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className={styles.remove_btn}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <select
                                    name="preferredJobType"
                                    onChange={handleChange}
                                    value={data.preferredJobType}
                                    className={styles.input}
                                >
                                    <option value="any">Any Job Type</option>
                                    <option value="remote">Remote</option>
                                    <option value="onsite">Onsite</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </>
                        )}
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.green_btn}>
                            {currentStep === 1 ? "Next" : "Sign Up"}
                        </button>
                        {currentStep === 2 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className={styles.white_btn}
                            >
                                Back
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
