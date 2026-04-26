import axios from 'axios';

const API_BASE = "https://api.tif.uin-suska.ac.id/setoran-dev/v1";
const AUTH_URL = "https://id.tif.uin-suska.ac.id/realms/dev/protocol/openid-connect/token";

const api = axios.create({ baseURL: API_BASE });

// Interceptor untuk memasukkan token otomatis
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: async (username, password) => {
    const params = new URLSearchParams();
    params.append('client_id', 'setoran-mobile-dev');
    params.append('client_secret', 'aqJp3xnXKudgC7RMOshEQP7ZoVKWzoSl');
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);
    params.append('scope', 'openid profile email');
    return axios.post(AUTH_URL, params);
  }
};

export const dosenService = {
  // Endpoint 1: ambil daftar mahasiswa bimbingan
  getPaSaya: () => api.get('/dosen/pa-saya'),

  // Endpoint 2: ambil detail mahasiswa berdasarkan NIM
  getDetailMahasiswa: (nim) => api.get(`/mahasiswa/setoran/${nim}`),
  
  // Endpoint 3: Menambah Setoran Baru untuk Mahasiswa
  simpanSetoran: (nim, dataSetoran) => api.post(`/mahasiswa/setoran/${nim}`, {
    data_setoran: dataSetoran,
    tgl_setoran: new Date().toISOString().split('T')[0] // format YYYY-MM-DD
  }),

  // Endpoint 4: membatalkan/menghapus setoran
  deleteSetoran: (nim, dataBatal) => api.delete(`/mahasiswa/setoran/${nim}`, { data: { data_setoran: dataBatal } }),
};