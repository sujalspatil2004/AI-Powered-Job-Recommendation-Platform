import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const Admin = () => {
    const [jobData, setJobData] = useState({
        title: "",
        company: "",
        location: "",
        type: "remote",
        skills: [],
        description: ""
    });
    const [jobs, setJobs] = useState([]);
    const [users, setUsers] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("jobs");
    const [editingJob, setEditingJob] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchJobs();
        fetchUsers();
    }, []);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setJobs(data);
        } catch (error) {
            setError("Failed to fetch jobs");
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setUsers(data);
        } catch (error) {
            setError("Failed to fetch users");
        }
    };

    const handleJobChange = ({ currentTarget: input }) => {
        setJobData({ ...jobData, [input.name]: input.value });
    };

    const addSkill = () => {
        if (skillInput && !jobData.skills.includes(skillInput)) {
            setJobData({ ...jobData, skills: [...jobData.skills, skillInput] });
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setJobData({
            ...jobData,
            skills: jobData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { "Authorization": `Bearer ${token}` } };

            if (editingJob) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/api/jobs/${editingJob._id}`,
                    jobData,
                    config
                );
                setSuccess("Job updated successfully");
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/jobs`, jobData, config);
                setSuccess("Job created successfully");
            }

            setJobData({
                title: "",
                company: "",
                location: "",
                type: "remote",
                skills: [],
                description: ""
            });
            setEditingJob(null);
            fetchJobs();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to save job");
        }
    };

    const handleEditJob = (job) => {
        setJobData(job);
        setEditingJob(job);
        setActiveTab("jobs");
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/jobs/${jobId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchJobs();
            setSuccess("Job deleted successfully");
        } catch (error) {
            setError("Failed to delete job");
        }
    };

    const handleUserClick = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setSelectedUser(data);
        } catch (error) {
            setError("Failed to fetch user details");
        }
    };

    const handleMakeAdmin = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${process.env.REACT_APP_API_URL}/api/users/make-admin/${userId}`, {}, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchUsers();
            setSuccess("User promoted to admin successfully");
        } catch (error) {
            setError("Failed to promote user to admin");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchUsers();
            setSelectedUser(null);
            setSuccess("User deleted successfully");
        } catch (error) {
            setError("Failed to delete user");
        }
    };

    return (
        <div className={styles.admin_container}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            
            <div className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${activeTab === 'jobs' ? styles.active : ''}`}
                    onClick={() => setActiveTab('jobs')}
                >
                    Manage Jobs
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Manage Users
                </button>
            </div>

            {error && <div className={styles.error_msg}>{error}</div>}
            {success && <div className={styles.success_msg}>{success}</div>}

            {activeTab === 'jobs' && (
                <div className={styles.jobs_section}>
                    <div className={styles.form_section}>
                        <h2>{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
                        <form onSubmit={handleJobSubmit} className={styles.job_form}>
                            <input
                                type="text"
                                placeholder="Job Title"
                                name="title"
                                value={jobData.title}
                                onChange={handleJobChange}
                                className={styles.input}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Company"
                                name="company"
                                value={jobData.company}
                                onChange={handleJobChange}
                                className={styles.input}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                name="location"
                                value={jobData.location}
                                onChange={handleJobChange}
                                className={styles.input}
                                required
                            />
                            <select
                                name="type"
                                value={jobData.type}
                                onChange={handleJobChange}
                                className={styles.input}
                                required
                            >
                                <option value="remote">Remote</option>
                                <option value="onsite">Onsite</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                            <div className={styles.skills_container}>
                                <input
                                    type="text"
                                    placeholder="Add Required Skill"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
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
                                {jobData.skills.map((skill, index) => (
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
                            <textarea
                                placeholder="Job Description"
                                name="description"
                                value={jobData.description}
                                onChange={handleJobChange}
                                className={styles.textarea}
                                required
                            />
                            <div className={styles.button_group}>
                                <button type="submit" className={styles.green_btn}>
                                    {editingJob ? 'Update Job' : 'Create Job'}
                                </button>
                                {editingJob && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingJob(null);
                                            setJobData({
                                                title: "",
                                                company: "",
                                                location: "",
                                                type: "remote",
                                                skills: [],
                                                description: ""
                                            });
                                        }}
                                        className={styles.white_btn}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className={styles.jobs_list}>
                        <h2>Current Jobs</h2>
                        <div className={styles.jobs_grid}>
                            {jobs.map((job) => (
                                <div key={job._id} className={styles.job_card}>
                                    <h3>{job.title}</h3>
                                    <p><strong>Company:</strong> {job.company}</p>
                                    <p><strong>Location:</strong> {job.location}</p>
                                    <p><strong>Type:</strong> {job.type}</p>
                                    <div className={styles.skills_list}>
                                        {job.skills.map((skill, index) => (
                                            <span key={index} className={styles.skill_item}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <div className={styles.button_group}>
                                        <button
                                            onClick={() => handleEditJob(job)}
                                            className={styles.edit_btn}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job._id)}
                                            className={styles.delete_btn}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className={styles.users_section}>
                    <div className={styles.users_grid}>
                        <div className={styles.users_list}>
                            <h2>Users</h2>
                            <div className={styles.users_table}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr 
                                                key={user._id}
                                                className={selectedUser?._id === user._id ? styles.selected : ''}
                                                onClick={() => handleUserClick(user._id)}
                                            >
                                                <td>{user.firstName} {user.lastName}</td>
                                                <td>{user.email}</td>
                                                <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                                                <td>
                                                    {!user.isAdmin && (
                                                        <button
                                                            onClick={() => handleMakeAdmin(user._id)}
                                                            className={styles.promote_btn}
                                                        >
                                                            Make Admin
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className={styles.delete_btn}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {selectedUser && (
                            <div className={styles.user_details}>
                                <h2>User Profile Details</h2>
                                <div className={styles.profile_card}>
                                    <h3>{selectedUser.firstName} {selectedUser.lastName}</h3>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    <p><strong>Location:</strong> {selectedUser.location || 'Not specified'}</p>
                                    <p><strong>Years of Experience:</strong> {selectedUser.yearsOfExperience || 'Not specified'}</p>
                                    <p><strong>Preferred Job Type:</strong> {selectedUser.preferredJobType || 'Any'}</p>
                                    
                                    <div className={styles.skills_section}>
                                        <h4>Skills</h4>
                                        <div className={styles.skills_list}>
                                            {selectedUser.skills?.map((skill, index) => (
                                                <span key={index} className={styles.skill_item}>
                                                    {skill}
                                                </span>
                                            ))}
                                            {(!selectedUser.skills || selectedUser.skills.length === 0) && (
                                                <p>No skills specified</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;