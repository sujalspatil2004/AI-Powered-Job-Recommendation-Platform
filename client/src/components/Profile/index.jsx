import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const Profile = () => {
    const [data, setData] = useState({
        location: "",
        yearsOfExperience: "",
        skills: [],
        preferredJobType: "any"
    });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [skillInput, setSkillInput] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        // Check profile completion
        const complete = Boolean(
            data.location &&
            data.yearsOfExperience &&
            data.skills.length > 0 &&
            data.preferredJobType
        );
        setIsComplete(complete);
    }, [data]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { "Authorization": `Bearer ${token}` } };
            const { data: response } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, config);
            setData({
                location: response.location || "",
                yearsOfExperience: response.yearsOfExperience || "",
                skills: response.skills || [],
                preferredJobType: response.preferredJobType || "any"
            });
        } catch (error) {
            console.error(error);
            setError("Failed to fetch profile data");
        }
    };

    const handleChange = ({ currentTarget: input }) => {
        if (input.name === "yearsOfExperience") {
            // Ensure years of experience is a positive number
            const value = Math.max(0, parseInt(input.value) || 0);
            setData({ ...data, [input.name]: value });
        } else {
            setData({ ...data, [input.name]: input.value });
        }
        setError("");
        setMessage("");
    };

    const addSkill = () => {
        if (!skillInput.trim()) {
            setError("Please enter a skill");
            return;
        }

        if (data.skills.includes(skillInput.trim())) {
            setError("This skill is already added");
            return;
        }

        setData({ ...data, skills: [...data.skills, skillInput.trim()] });
        setSkillInput("");
        setError("");
    };

    const removeSkill = (skillToRemove) => {
        setData({ ...data, skills: data.skills.filter(skill => skill !== skillToRemove) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!data.location) {
            setError("Please enter your location");
            return;
        }

        if (!data.yearsOfExperience && data.yearsOfExperience !== 0) {
            setError("Please enter your years of experience");
            return;
        }

        if (data.skills.length === 0) {
            setError("Please add at least one skill");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const config = { headers: { "Authorization": `Bearer ${token}` } };
            const { data: res } = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/users/profile`,
                data,
                config
            );
            setMessage(res.message);
            setError("");
            // Update localStorage user with new profile data
            if (res.user) {
                localStorage.setItem("user", JSON.stringify(res.user));
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Failed to update profile");
            }
            setMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && skillInput) {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <div className={styles.profile_container}>
            <div className={styles.profile_form_container}>
                <div className={styles.form_container}>
                    <h1>Your Profile</h1>
                    <p className={styles.completion_status}>
                        Profile Status: <span className={isComplete ? styles.complete : styles.incomplete}>
                            {isComplete ? "Complete ✓" : "Incomplete"}
                        </span>
                    </p>
                    {!isComplete && (
                        <p className={styles.completion_message}>
                            Complete your profile to get personalized job recommendations!
                        </p>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className={styles.input_group}>
                            <label>Location</label>
                            <input
                                type="text"
                                placeholder="e.g., New York, NY"
                                name="location"
                                onChange={handleChange}
                                value={data.location}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.input_group}>
                            <label>Years of Experience</label>
                            <input
                                type="number"
                                placeholder="Enter number of years"
                                name="yearsOfExperience"
                                min="0"
                                onChange={handleChange}
                                value={data.yearsOfExperience}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.input_group}>
                            <label>Skills</label>
                            <div className={styles.skills_container}>
                                <input
                                    type="text"
                                    placeholder="e.g., JavaScript"
                                    value={skillInput}
                                    onChange={(e) => {
                                        setSkillInput(e.target.value);
                                        setError("");
                                    }}
                                    onKeyPress={handleKeyPress}
                                    className={styles.input}
                                />
                                <button 
                                    type="button" 
                                    onClick={addSkill} 
                                    className={styles.add_btn}
                                >
                                    Add Skill
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
                                            aria-label={`Remove ${skill}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.input_group}>
                            <label>Preferred Job Type</label>
                            <select
                                name="preferredJobType"
                                onChange={handleChange}
                                value={data.preferredJobType}
                                className={styles.input}
                            >
                                <option value="any">Any</option>
                                <option value="remote">Remote</option>
                                <option value="onsite">Onsite</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>

                        {error && <div className={styles.error_msg}>{error}</div>}
                        {message && <div className={styles.success_msg}>{message}</div>}
                        
                        <button type="submit" className={styles.green_btn}>
                            Save Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;