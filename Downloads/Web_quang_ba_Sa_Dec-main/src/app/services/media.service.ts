import axios from 'axios';

const API_BaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const mediaService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BaseURL}/admin/media/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.data.url; // Assuming backend returns { url: "..." }
  },

  getAll: async (params?: any) => {
    const response = await axios.get(`${API_BaseURL}/admin/media`, {
        params,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
};
