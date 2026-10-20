import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/AuthPage.module.css';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? 'login' : 'register';
    console.log("Sending:", { username, password });
    try {
      const res = await axios.post(`https://blogeditor-backend-q4pb.onrender.com/api/auth/${endpoint}`, {
        username, password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('username', res.data.username);

      toast.success(`${isLogin ? 'Login' : 'Register'} successful`, { autoClose: 1000 });
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Something went wrong', { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" disabled={loading}>
          {loading ? <span className={styles.spinner}></span> : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className={styles.switchButton}>
        {isLogin ? "Don't have an account? Switch to Register" : 'Already have an account? Switch to Login'}
      </button>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AuthPage;