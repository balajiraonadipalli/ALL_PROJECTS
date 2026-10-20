import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/BlogEditor.module.css'; // Example
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogEditor = ({ blogId }) => {
  const [status, setStatus] = useState('draft');
  const [autoSaveMsg, setAutoSaveMsg] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [lastSavedData, setLastSavedData] = useState({ title: '', content: '', tags: '' });

  const [currentBlogId, setCurrentBlogId] = useState(blogId || null);

  const hasInteracted = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentBlogId) return;

    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://blogeditor-backend-q4pb.onrender.com/api/blogs/${currentBlogId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const blog = res.data;
        setTitle(blog.title);
        setContent(blog.content);
        setTags(blog.tags.join(','));
        setLastSavedData({
          title: blog.title,
          content: blog.content,
          tags: blog.tags.join(','),
        });
      } catch (err) {
        console.error('Error loading blog:', err);
        toast.error('Failed to load blog');
      }
    };

    fetchBlog();
  }, [currentBlogId]);


  // Debounce Auto-save
  useEffect(() => {
    if (!hasInteracted.current) return;

    const timer = setTimeout(() => {
      const trimmedTags = tags.split(',').map(t => t.trim()).join(',');
      const currentData = { title, content, tags: trimmedTags };

      const noChange =
        currentData.title === lastSavedData.title &&
        currentData.content === lastSavedData.content &&
        currentData.tags === lastSavedData.tags;

      if (!noChange) {
        handleSaveDraft(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [title, content, tags]);

  const handleSaveDraft = async (auto = false) => {
    const trimmedTags = tags.split(',').map(t => t.trim()).join(',');
    const currentData = { title, content, tags: trimmedTags };

    const noChange =
      currentData.title === lastSavedData.title &&
      currentData.content === lastSavedData.content &&
      currentData.tags === lastSavedData.tags;

    if (auto && noChange) return; // skip auto-save if no changes

    // Auth check
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue.', {
        position: 'top-center',
        autoClose: 1500,
        onClose: () => navigate('/auth')
      });
      return;
    }

    try {
      const response = await axios.post('https://blogeditor-backend-q4pb.onrender.com/api/blogs/save-draft', {
        id: currentBlogId,
        title,
        content,
        tags: trimmedTags.split(','),
        status: 'draft'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!currentBlogId && response.data._id) {
        setCurrentBlogId(response.data._id);
      }
      setLastSavedData(currentData);
      if (auto) {
        setAutoSaveMsg('Draft auto-saved');
        setTimeout(() => setAutoSaveMsg(''), 2000);
      } else {
        toast.success('Draft saved!', {
          position: 'top-center',
          autoClose: 1000,
          onClose: () => navigate('/')
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePublish = async () => {
    // Auth check
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue.', {
        position: 'top-center',
        autoClose: 1500,
        onClose: () => navigate('/auth')
      });
      return;
    }
    try {
      await axios.post('https://blogeditor-backend-q4pb.onrender.com/api/blogs/publish', {
        id: currentBlogId,
        title,
        content,
        tags: tags.split(',').map(t => t.trim())
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Blog published!', {
        position: 'top-center',
        autoClose: 1000,
        onClose: () => navigate('/')
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <h2>Your Ideas, Our Platform.</h2>
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          hasInteracted.current = true;
        }}
      />
      <textarea
        placeholder="Enter content..."
        rows={10}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          hasInteracted.current = true;
        }}
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => {
          setTags(e.target.value);
          hasInteracted.current = true;
        }}
      />
      <div>
        <button onClick={() => handleSaveDraft(false)}>
          {currentBlogId ? 'Update Draft' : 'Save as Draft'}
        </button>
        <button onClick={handlePublish}>
          {currentBlogId ? 'Update & Publish' : 'Publish'}
        </button>
      </div>
      <p>{autoSaveMsg}</p>
      <ToastContainer />
    </div>
  );
};

export default BlogEditor;