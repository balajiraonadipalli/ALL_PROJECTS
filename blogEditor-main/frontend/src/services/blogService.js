import axios from 'axios';

const BASE_URL = 'https://blogeditor-backend-q4pb.onrender.com/api/blogs';

export const saveDraft = (data) => axios.post(`${BASE_URL}/save-draft`, data);
export const publishBlog = (data) => axios.post(`${BASE_URL}/publish`, data);
export const getAllBlogs = () => axios.get(BASE_URL);
export const getBlogById = (id) => axios.get(`${BASE_URL}/${id}`);