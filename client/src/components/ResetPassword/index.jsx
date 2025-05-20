import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import config from "../../config";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    // Get token from URL query params
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const { data } = await axios.post(
                `${config.apiUrl}/api/auth/reset-password`,
                { token, password }
            );
            setSuccess(data.message);
            setError("");
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
            setSuccess("");
        }
    };

    if (!token) {
        return (
            <div className={styles.container}>
                <div className={styles.form_container}>
                    <h1>Invalid Reset Link</h1>
                    <p>The password reset link is invalid or has expired.</p>
                    <Link to="/forgot-password" className={styles.link}>
                        Request a new password reset
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.form_container}>
                <h1>Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    {error && <div className={styles.error_msg}>{error}</div>}
                    {success && (
                        <div className={styles.success_msg}>
                            {success}
                            <Link to="/login" className={styles.link}>
                                Return to Login
                            </Link>
                        </div>
                    )}
                    <button type="submit" className={styles.submit_btn}>
                        Reset Password
                    </button>
                </form>
                {!success && (
                    <Link to="/login" className={styles.link}>
                        Back to Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;