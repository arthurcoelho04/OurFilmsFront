import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 20000 });
export const message = error => error.response?.data?.mensagem || (error.code === 'ECONNABORTED' ? 'A conexão demorou mais que o esperado. Tente novamente.' : 'Não foi possível conectar ao OurMovies. Verifique se o backend está em execução.');
export const getList = () => api.get('/lista').then(r => r.data);
export const getUsers = () => api.get('/usuarios').then(r => r.data);
export const updateUser = (id, nome) => api.patch(`/usuarios/${id}`, { nome }).then(r => r.data);
export const uploadUserPhoto = (id, file) => {
  const body = new FormData();
  body.append('foto', file);
  return api.post(`/usuarios/${id}/foto`, body).then(r => r.data);
};
export const removeUserPhoto = id => api.delete(`/usuarios/${id}/foto`);
export function userPhotoUrl(user) {
  if (!user.fotoUrl) return null;
  const backend = new URL(api.defaults.baseURL, window.location.origin);
  const url = new URL(user.fotoUrl, backend.origin);
  if (user.photoVersion) url.searchParams.set('v', user.photoVersion);
  return url.href;
}
export const searchMovies = (nome, pagina, signal) => api.get('/filmes/pesquisar', { params: { nome, pagina }, signal }).then(r => r.data);
export const getMovie = (id, signal) => api.get(`/filmes/${id}/detalhes`, { signal }).then(r => r.data);
export const getRatings = (id, signal) => api.get(`/avaliacoes/filme/${id}`, { signal }).then(r => r.data);
export const addMovie = (id, status) => api.post(`/lista/${id}`, { status, favorito: false }).then(r => r.data);
export const updateMovie = (id, data) => api.patch(`/lista/${id}`, data).then(r => r.data);
export const deleteMovie = id => api.delete(`/lista/${id}`);
export const saveRating = (id, data) => id ? api.put(`/avaliacoes/${id}`, { nota: data.nota, comentario: data.comentario }) : api.post('/avaliacoes', data);
export const deleteRating = id => api.delete(`/avaliacoes/${id}`);
