import { useState, useEffect } from 'react';

export default function Modal({ aluno, onSalvar, onFechar }) {
  const [dados, setDados] = useState({
    matricula:'', nome:'', nascimento:'', classe:'',
    sexo:'', situacao:'', raca:'', curso:'', tel1:'', tel2:'',
  });

  useEffect(() => { if (aluno) setDados(aluno); }, [aluno]);

  function set(campo, valor) { setDados(d => ({ ...d, [campo]: valor })); }

  function salvar() {
    if (!dados.nome.trim()) return alert('Digite o nome do aluno!');
    onSalvar(dados);
  }

  return (
    <div className="overlay open" onClick={e => e.target.className === 'overlay open' && onFechar()}>
      <div className="modal">
        <h2>{aluno ? '✏️ Editar Aluno' : '➕ Adicionar Aluno'}</h2>

        <div className="sec-title">📋 Dados do Aluno</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Nome Completo *</label>
            <input value={dados.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome do aluno"/>
          </div>
          <div className="form-group">
            <label>Matrícula</label>
            <input value={dados.matricula} onChange={e => set('matricula', e.target.value)} placeholder="Ex: 58823"/>
          </div>
        </div>

        <div className="form-grid-3">
          <div className="form-group">
            <label>Data de Nascimento</label>
            <input type="date" value={dados.nascimento} onChange={e => set('nascimento', e.target.value)}/>
          </div>
          <div className="form-group">
            <label>Nº de Classe</label>
            <input value={dados.classe} onChange={e => set('classe', e.target.value)} placeholder="Ex: 1"/>
          </div>
          <div className="form-group">
            <label>Sexo</label>
            <select value={dados.sexo} onChange={e => set('sexo', e.target.value)}>
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Situação</label>
            <select value={dados.situacao} onChange={e => set('situacao', e.target.value)}>
              <option value="">Selecione</option>
              <option>Matriculado</option>
              <option>Transferido</option>
              <option>Evadido</option>
            </select>
          </div>
          <div className="form-group">
            <label>Raça/Cor</label>
            <select value={dados.raca} onChange={e => set('raca', e.target.value)}>
              <option value="">Selecione</option>
              <option>Parda</option>
              <option>Branca</option>
              <option>Preta</option>
              <option>Amarela</option>
              <option>Indígena</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{marginBottom:'4px'}}>
          <label>Procedência / Modalidade</label>
          <input value={dados.curso} onChange={e => set('curso', e.target.value)} placeholder="Ex: Ensino Fundamental de 9 Anos"/>
        </div>

        <div className="sec-title">📱 Telefones</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Telefone 1</label>
            <input value={dados.tel1} onChange={e => set('tel1', e.target.value)} placeholder="Ex: (81) 98777-8182"/>
          </div>
          <div className="form-group">
            <label>Telefone 2</label>
            <input value={dados.tel2} onChange={e => set('tel2', e.target.value)} placeholder="Ex: (81) 99216-6855"/>
          </div>
        </div>

        <div className="modal-btns">
          <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
          <button className="btn-save"   onClick={salvar}>💾 Salvar</button>
        </div>
      </div>
    </div>
  );
}
