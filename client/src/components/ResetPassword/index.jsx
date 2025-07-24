import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import styles from "./styles.module.css"; // ✅ Make sure this file exists and has your provided CSS

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${config.apiUrl}/api/auth/reset-password`, {
        token,
        password,
      });

      setIsError(false);
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000); // Redirect after success
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Error resetting password");
    }
  };

  if (!token) return <p className={styles.error_msg}>Invalid or missing reset token</p>;

  return (
    <div className={styles.container}>
      <form className={styles.form_container} onSubmit={handleSubmit}>
        <h1>Reset Password</h1>

        {message && (
          <div className={isError ? styles.error_msg : styles.success_msg}>
            {message}
          </div>
        )}

        <input
          type="password"
          placeholder="Enter new password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.submit_btn}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
