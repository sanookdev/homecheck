import axios from 'axios';

// Detect whether we are running locally or built
const isDev = import.meta.env.DEV;

// Use relative URL so Vite proxy or Vercel routes it appropriately
const baseURL = '/api';

const api = axios.create({
  baseURL,
});

export default {
  getChecklists() {
    return api.get('/checklists');
  },
  createChecklist(formData) {
    return api.post('/checklists', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateChecklist(id, formData) {
    return api.put(`/checklists/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteChecklist(id, pin) {
    return api.delete(`/checklists/${id}`, {
      headers: { 'x-app-pin': pin }
    });
  }
};
