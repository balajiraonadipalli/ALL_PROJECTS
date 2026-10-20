import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlogCard from '../components/BlogCard';
import axios from 'axios';
import styles from '../styles/AllBlogsPage.module.css';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiEdit, FiTrash2, FiPlus, FiUser } from 'react-icons/fi';


const LoginButton = ({ onClick }) => (
  <button
    onClick={onClick}
    title="Login"
    style={{
      background: 'transparent',
      border: 'none',
      fontSize: '1.8rem',
      color: '#007bff',
      cursor: 'pointer',
      marginLeft: '1rem',
    }}
  >
    <FiLogIn />
  </button>
);

const AllBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please log in to continue.', {
        position: 'top-center',
        autoClose: 2000,
        onClose: () => navigate('/auth'),
      });
      return false;
    }
    return true;
  };

  const handleEdit = (id) => {
    if (!checkAuth()) return;
    navigate(`/editor/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://blogeditor-backend-q4pb.onrender.com/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete blog.', { position: 'top-center', autoClose: 2000 });
    }
  };

  const handlePublish = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://blogeditor-backend-q4pb.onrender.com/api/blogs/publish',
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedBlogs = blogs.map(blog =>
        blog._id === id ? { ...blog, status: 'published' } : blog
      );
      setBlogs(updatedBlogs);
      toast.success('Blog published!', { position: 'top-center', autoClose: 2000 });
    } catch (error) {
      console.error('Failed to publish blog', error);
      toast.error('Failed to publish blog', { position: 'top-center', autoClose: 2000 });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTokenExists(!!token);
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    const fetchBlogs = async () => {
      if (!token) {
        toast.info('Please log in to view blogs.', {
          position: 'top-center',
          autoClose: 2000,
          // onClose: () => navigate('/auth'),
        });
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('https://blogeditor-backend-q4pb.onrender.com/api/blogs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Unauthorized. Redirecting to login.', {
          position: 'top-center',
          autoClose: 2000,
          onClose: () => navigate('/auth')
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [navigate]);

  const drafts = blogs
    .filter(blog => blog.status === 'draft')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const published = blogs
    .filter(blog => blog.status === 'published')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className={styles.pageContainer}>
      <ToastContainer />
      <div className={styles.headerBar}>
        <button
          className={styles.createButton}
          onClick={() => {
            if (tokenExists) {
              navigate('/editor');
            } else {
              toast.info('Please log in to continue.', { position: 'top-center', autoClose: 2000 });
              return;
            }
          }}
        ><FiPlus style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Create New Blog
        </button>

        {tokenExists ? (
          <button
            onClick={() => navigate('/profile')}
            title="Profile"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.8rem',
              color: '#007bff',
              cursor: 'pointer',
              marginLeft: '1rem',
            }}
          >
            <FiUser />
          </button>
        ) : (
          <LoginButton onClick={() => navigate('/auth')} />
        )}
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Fetching blogs...</p>
        </div>
      ) : (
        <>
          <div className={styles.blogSection}>
            <h2 className={styles.sectionTitle}>Drafts</h2>
            {drafts.length > 0 ? (
              drafts.map(blog => (
                <div key={blog._id} className={styles.blogItem}>
                  <div className={styles.cardWrapper}>
                    <BlogCard blog={blog} />
                    <p className={styles.timestamp}>
                      Last updated : {new Date(blog.updatedAt).toLocaleString()}
                    </p>
                    {String(blog.user?._id) === String(userId) && (
                      <div className={styles.buttonGroup}>
                        <button
                          onClick={() => handleEdit(blog._id)}
                          className={styles.editButton}
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className={styles.deleteButton}
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                        <button
                          onClick={() => handlePublish(blog._id)}
                          className={styles.publishButton}
                          title="Publish"
                          disabled={blog.status === 'published'}
                        >
                          Publish
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No draft blogs available.</p>
            )}
          </div>

          <div className={styles.blogSection}>
            <h2 className={styles.sectionTitle}>Published Blogs</h2>
            {published.length > 0 ? (
              published.map(blog => (
                <div key={blog._id} className={styles.blogItem}>
                  <div className={styles.cardWrapper}>
                    <BlogCard blog={blog} />
                    <p className={styles.publisher}>
                      <strong>Publisher :</strong> {blog.user?.username || 'Unknown'}
                    </p>
                    <p className={styles.timestamp}>
                      Published on : {new Date(blog.updatedAt).toLocaleString()}
                    </p>
                    {String(blog.user?._id) === String(userId) && (
                      <div className={styles.buttonGroup}>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className={styles.deleteButton}
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No published blogs yet.</p>
            )}
          </div>


        </>
      )}
    </div>
  );
};

export default AllBlogsPage;