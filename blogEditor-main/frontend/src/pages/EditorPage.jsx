import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import BlogEditor from '../components/BlogEditor';
import axios from 'axios';
import styles from '../styles/EditorPage.module.css';

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('token');
      axios.get(`https://blogeditor-backend-q4pb.onrender.com/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => setBlogData(res.data))
      .catch(err => console.error('Failed to fetch blog', err));
    }
  }, [id]);

  return (
    <div className={styles.editorPageContainer}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <FaArrowLeft className={styles.backIcon} />
      </button>
      {blogData && (
        <div className={styles.timestamp}>
          <p><strong>Created:</strong> {new Date(blogData.createdAt).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(blogData.updatedAt).toLocaleString()}</p>
        </div>
      )}
      {/* <h1 className={styles.heading}>{id ? 'Edit Blog' : 'Create Blog'}</h1> */}
      
      <BlogEditor blogId={id} existingData={blogData} isEditing={!!id} />
      
    </div>
  );
};

export default EditorPage;