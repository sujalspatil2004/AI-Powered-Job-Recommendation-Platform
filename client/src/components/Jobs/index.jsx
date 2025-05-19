import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendationsLoading, setRecommendationsLoading] = useState(false);
    const [error, setError] = useState("");
    const [view, setView] = useState("all"); // "all" or "recommendations"
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (user?.skills?.length > 0) {
            fetchJobs();
            fetchRecommendations();
        } else if (user) {
            fetchJobs();
        }
    }, [user]);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { "Authorization": `Bearer ${token}` } };
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, config);
            setUser(data);
        } catch (error) {
            setError("Failed to fetch user profile");
        }
    };

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setJobs(data);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching jobs");
            setLoading(false);
        }
    };

    const fetchRecommendations = async () => {
        setRecommendationsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs/recommendations/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setRecommendations(data);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setRecommendationsLoading(false);
        }
    };

    const JobCard = ({ job, matchPercentage, reason }) => (
        <div className={`${styles.job_card} ${matchPercentage ? styles.recommendation_card : ''}`}>
            {matchPercentage && (
                <div className={styles.match_percentage}>
                    {matchPercentage}% Match
                </div>
            )}
            <h3>{job.title}</h3>
            <p className={styles.company}>{job.company}</p>
            <p className={styles.location}>📍 {job.location}</p>
            <p className={styles.job_type}>💼 {job.type}</p>
            
            <div className={styles.skills_list}>
                {job.skills.map((skill, index) => (
                    <span key={index} className={styles.skill_tag}>
                        {skill}
                    </span>
                ))}
            </div>

            {reason && (
                <div className={styles.match_reason}>
                    <h4>Why this matches you:</h4>
                    <p>{reason}</p>
                </div>
            )}

            <div className={styles.job_description}>
                <h4>Description:</h4>
                <p>{job.description}</p>
            </div>

            <button 
                className={styles.apply_btn}
                onClick={() => window.open(job.applicationUrl, '_blank')}
            >
                Apply Now
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className={styles.loading_container}>
                <div className={styles.loading_spinner}></div>
                <p>Loading jobs...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Available Positions</h1>
                {user?.skills?.length > 0 && (
                    <div className={styles.view_toggle}>
                        <button
                            className={`${styles.toggle_btn} ${view === 'all' ? styles.active : ''}`}
                            onClick={() => setView('all')}
                        >
                            All Jobs
                        </button>
                        <button
                            className={`${styles.toggle_btn} ${view === 'recommendations' ? styles.active : ''}`}
                            onClick={() => setView('recommendations')}
                        >
                            AI Recommendations
                        </button>
                    </div>
                )}
            </div>

            {error && <div className={styles.error_msg}>{error}</div>}

            {!user?.skills?.length && (
                <div className={styles.error_msg}>
                    Update your profile with skills to get AI-powered job recommendations!
                </div>
            )}

            <div className={styles.jobs_grid}>
                {view === 'all' ? (
                    jobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))
                ) : (
                    recommendationsLoading ? (
                        <div className={styles.loading_container}>
                            <div className={styles.loading_spinner}></div>
                            <p>Fetching AI recommendations, please wait...</p>
                        </div>
                    ) : (
                        recommendations.map(({ job, matchPercentage, reason }) => (
                            <JobCard 
                                key={job._id} 
                                job={job} 
                                matchPercentage={matchPercentage}
                                reason={reason}
                            />
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default Jobs;