import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLogOut } from 'react-icons/fi'; // logout icon

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully', {
      position: 'top-center',
      autoClose: 1500
    });
    navigate('/auth');
  };

  return (
    <button
      onClick={handleLogout}
      title="Logout"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.8rem',
        color: '#f44336'
      }}
    >
      <FiLogOut />
    </button>
  );
};

export default LogoutButton;