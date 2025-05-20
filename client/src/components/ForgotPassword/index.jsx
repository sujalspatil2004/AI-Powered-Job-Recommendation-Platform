import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import config from "../../config";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${config.apiUrl}/api/auth/forgot-password`,
                { email }
            );
            setSuccess(data.message);
            setError("");
            // In a real application, you would send the token via email
            // For demo purposes, we'll show it in the success message
            setSuccess(`${data.message}. Use this token to reset your password: ${data.resetToken}`);
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
            setSuccess("");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.form_container}>
                <h1>Forgot Password</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                    {error && <div className={styles.error_msg}>{error}</div>}
                    {success && <div className={styles.success_msg}>{success}</div>}
                    <button type="submit" className={styles.submit_btn}>
                        Send Reset Link
                    </button>
                </form>
                <Link to="/login" className={styles.link}>
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;