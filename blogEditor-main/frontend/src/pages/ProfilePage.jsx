import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ProfilePage.module.css';
import { FiLogOut } from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa';

const ProfilePage = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');

        if (!token || !userId) {
            navigate('/auth');
        } else if (storedUsername) {
            setUsername(storedUsername);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        navigate('/auth');
    };

    return (
        <>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
                <FaArrowLeft className={styles.backIcon} /></button>
        <div className={styles.profileContainer}>
            <h2 className={styles.welcomeMessage}>Hi, <span className={styles.username}>{username}!</span></h2>
            <button onClick={handleLogout} className={styles.logoutButton}>
                <FiLogOut className={styles.logoutIcon} />
            </button>
        </div>
        </>
        
    );
};

export default ProfilePage;