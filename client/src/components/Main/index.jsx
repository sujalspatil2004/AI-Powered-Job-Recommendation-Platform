import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Jobs from "../Jobs";
import Profile from "../Profile";
import Admin from "../Admin";

const Main = () => {
    const [activeTab, setActiveTab] = useState('jobs');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const adminStatus = localStorage.getItem("isAdmin");
        setIsAdmin(adminStatus === "true");
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        window.location.reload();
    };

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>JobMatch AI</h1>
                <div className={styles.nav_buttons}>
                    <button 
                        className={`${styles.nav_btn} ${activeTab === 'jobs' ? styles.active : ''}`}
                        onClick={() => setActiveTab('jobs')}
                    >
                        Jobs
                    </button>
                    <button 
                        className={`${styles.nav_btn} ${activeTab === 'profile' ? styles.active : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    {isAdmin && (
                        <button 
                            className={`${styles.nav_btn} ${activeTab === 'admin' ? styles.active : ''}`}
                            onClick={() => setActiveTab('admin')}
                        >
                            Admin
                        </button>
                    )}
                    <button className={styles.white_btn} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>
            <main className={styles.content}>
                {activeTab === 'jobs' && <Jobs />}
                {activeTab === 'profile' && <Profile />}
                {activeTab === 'admin' && isAdmin && <Admin />}
            </main>
        </div>
    );
};

export default Main;
