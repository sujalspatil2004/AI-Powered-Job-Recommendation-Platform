import { useState } from "react";
import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
import styles from './FormStyles.module.css'; // ✅ make sure this file exists

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const response = await axios.post(`${config.apiUrl}/api/auth/forgot-password`, { email });
      setSuccess(response.data.message || "Check your email for the reset link.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form_container} onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>

        {success && <div className={styles.success_msg}>{success}</div>}
        {error && <div className={styles.error_msg}>{error}</div>}

        <input
          type="email"
          className={styles.input}
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" className={styles.submit_btn}>
          Send Reset Link
        </button>

        <Link to="/login" className={styles.link}>Back to login</Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
