import axios from 'axios';

const API = 'https://contatos-2.onrender.com';

export const getAlunos    = ()          => axios.get(`${API}/alunos`);
export const addAluno     = (dados)     => axios.post(`${API}/alunos`, dados);
export const editAluno    = (id, dados) => axios.put(`${API}/alunos/${id}`, dados);
export const deleteAluno  = (id)        => axios.delete(`${API}/alunos/${id}`);
export const importAlunos = (alunos)    => axios.post(`${API}/alunos/importar`, { alunos });