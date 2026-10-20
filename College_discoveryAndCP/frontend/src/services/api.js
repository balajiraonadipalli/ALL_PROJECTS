import axios from 'axios';
import qs from 'qs';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// College APIs
export const fetchColleges = async (params) => {
    const { data } = await api.get('/colleges', {
        params,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    });
    return data;
};

export const fetchCollegeBySlug = async (slug) => {
    const { data } = await api.get(`/colleges/${slug}`);
    return data;
};

export const createCollege = async (collegeData) => {
    const { data } = await api.post('/colleges', collegeData);
    return data;
};

export const updateCollege = async (id, collegeData) => {
    const { data } = await api.put(`/colleges/${id}`, collegeData);
    return data;
};

export const compareCollegesApi = async (ids) => {
    const { data } = await api.post('/colleges/compare', { ids });
    return data;
};

export default api;
