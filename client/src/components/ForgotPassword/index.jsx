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
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post(
        `${config.apiUrl}/api/auth/forgot-password`,
        { email }
      );

      // Create reset URL from token
      const resetUrl = `http://localhost:3000/reset-password?token=${data.resetToken}`;
      setSuccess(
        `${data.message}.\n${resetUrl}`
      );
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
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

          {success && (
            <div className={styles.success_msg}>
              {success.split("\n")[0]}
              <br />
              <a
                href={success.split("\n")[1]}
                target="_blank"
                rel="noopener noreferrer"
              >
                Reset Your Password
              </a>
            </div>
          )}

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
