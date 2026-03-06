import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { getAlunos, addAluno, editAluno, deleteAluno, importAlunos } from '../api';
import Modal from './Modal';

export default function Alunos() {
  const [alunos,      setAlunos]      = useState([]);
  const [busca,       setBusca]       = useState('');
  const [fSexo,       setFSexo]       = useState('');
  const [fSituacao,   setFSituacao]   = useState('');
  const [fCurso,      setFCurso]      = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [editando,    setEditando]    = useState(null);
  const [loading,     setLoading]     = useState(false);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try {
      setLoading(true);
      const { data } = await getAlunos();
      setAlunos(data);
    } catch (err) {
      alert('Erro ao carregar! Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  }

  async function salvar(dados) {
    try {
      if (editando) await editAluno(editando.id, dados);
      else          await addAluno(dados);
      setModalAberto(false);
      setEditando(null);
      carregar();
    } catch (err) { alert('Erro ao salvar!'); }
  }

  async function deletar(id) {
    if (!window.confirm('Deseja remover este aluno?')) return;
    try {
      await deleteAluno(id);
      carregar();
    } catch (err) { alert('Erro ao deletar!'); }
  }

  function abrirModal(aluno = null) {
    setEditando(aluno);
    setModalAberto(true);
  }

  // ===== EXCEL =====
  function getCol(r, ...keys) {
    for (const k of keys) {
      if (r[k] !== undefined && r[k] !== '') return String(r[k]).trim().replace(/\.0$/, '');
    }
    const rKeys = Object.keys(r);
    for (const k of keys) {
      const kN = k.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
      const found = rKeys.find(rk => rk.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim() === kN);
      if (found && r[found] !== undefined && r[found] !== '') return String(r[found]).trim().replace(/\.0$/, '');
    }
    return '';
  }

  function parseTelefones(telStr) {
    if (!telStr) return ['', ''];
    const partes = String(telStr).split(/[,;\n]+/).map(t => t.trim()).filter(Boolean);
    return [partes[0] || '', partes[1] || ''];
  }

  async function importarExcel(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    const reader = new FileReader();
    reader.onload = async function (e) {
      try {
        const wb   = XLSX.read(e.target.result, { type: 'binary', raw: false });
        const novos = [];
        wb.SheetNames.forEach(nomeAba => {
          const ws = wb.Sheets[nomeAba];
          let rows = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });
          if (!rows.some(r => getCol(r, 'NOME', 'Nome', 'nome'))) {
            const arr  = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
            const hIdx = arr.findIndex(row => row.some(c => String(c).toUpperCase().includes('NOME')));
            if (hIdx >= 0) {
              const headers = arr[hIdx].map(h => String(h).trim());
              rows = arr.slice(hIdx + 1).map(row => {
                const obj = {};
                headers.forEach((h, i) => { obj[h] = row[i] ?? ''; });
                return obj;
              });
            }
          }
          rows.forEach(r => {
            const nome = getCol(r, 'NOME', 'Nome', 'nome');
            if (!nome || nome.toUpperCase() === 'NOME' || nome.toUpperCase().includes('TOTAL')) return;
            const [tel1, tel2] = parseTelefones(
              getCol(r, 'Telefones do aluno', 'TELEFONES DO ALUNO', 'Telefone', 'TELEFONE')
            );
            novos.push({
              matricula : getCol(r, 'Matrícula', 'MATRÍCULA', 'Matricula', 'MATRICULA'),
              nome,
              nascimento: getCol(r, 'Data de nascimento', 'DATA DE NASCIMENTO'),
              classe    : getCol(r, 'Nº de classe', 'N° DE CLASSE', 'Nº de Classe'),
              sexo      : getCol(r, 'Sexo', 'SEXO'),
              situacao  : getCol(r, 'Situação', 'SITUAÇÃO', 'Situacao'),
              raca      : getCol(r, 'Raça/Cor', 'RAÇA/COR', 'Raça'),
              curso     : getCol(r, 'Procedência modalidade/curso', 'PROCEDÊNCIA MODALIDADE/CURSO'),
              tel1, tel2,
            });
          });
        });
        if (!novos.length) return alert('Nenhum aluno encontrado!');
        const acao = window.confirm(`✅ ${novos.length} alunos encontrados!\n\nOK → Adicionar\nCancelar → Substituir tudo`);
        if (!acao && !window.confirm('Tem certeza? Os dados atuais serão apagados!')) return;
        const { data } = await importAlunos(novos);
        alert(`✅ ${data.importados} alunos importados!`);
        carregar();
      } catch (err) { alert('Erro ao importar: ' + err.message); }
      event.target.value = '';
    };
    reader.readAsBinaryString(arquivo);
  }

  function exportarExcel() {
    if (!alunos.length) return alert('Nenhum aluno para exportar!');
    const dados = alunos.map(a => ({
      'Matrícula'                    : a.matricula  || '',
      'Nome'                         : a.nome       || '',
      'Data de nascimento'           : a.nascimento || '',
      'Nº de classe'                 : a.classe     || '',
      'Sexo'                         : a.sexo       || '',
      'Situação'                     : a.situacao   || '',
      'Raça/Cor'                     : a.raca       || '',
      'Procedência modalidade/curso' : a.curso      || '',
      'Telefone 1'                   : a.tel1       || '',
      'Telefone 2'                   : a.tel2       || '',
    }));
    const ws = XLSX.utils.json_to_sheet(dados);
    ws['!cols'] = [{wch:12},{wch:35},{wch:18},{wch:10},{wch:8},{wch:12},{wch:10},{wch:40},{wch:18},{wch:18}];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contatos');
    const data = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    XLSX.writeFile(wb, `contatos-alunos-${data}.xlsx`);
  }

  const cursos    = [...new Set(alunos.map(a => a.curso).filter(Boolean))].sort();
  const filtrados = alunos.filter(a => {
    const bOk  = !busca     || a.nome.toLowerCase().includes(busca.toLowerCase()) || (a.matricula || '').includes(busca);
    const sOk  = !fSexo     || a.sexo     === fSexo;
    const siOk = !fSituacao || a.situacao === fSituacao;
    const cOk  = !fCurso    || a.curso    === fCurso;
    return bOk && sOk && siOk && cOk;
  });

  return (
    <div className="container">

      <div className="toolbar">
        <input className="search" placeholder="🔍 Buscar por nome ou matrícula..." value={busca} onChange={e => setBusca(e.target.value)}/>
        <label className="btn-label">
          📊 Importar Excel
          <input type="file" accept=".xlsx,.xls" onChange={importarExcel} style={{display:'none'}}/>
        </label>
        <button className="btn btn-azul"  onClick={exportarExcel}>📥 Exportar Excel</button>
        <button className="btn btn-verde" onClick={() => abrirModal()}>➕ Adicionar Aluno</button>
      </div>

      <div className="filtros">
        <select className="filtro-select" value={fSexo}     onChange={e => setFSexo(e.target.value)}>
          <option value="">👤 Todos</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
        <select className="filtro-select" value={fSituacao} onChange={e => setFSituacao(e.target.value)}>
          <option value="">📋 Todas Situações</option>
          <option value="Matriculado">Matriculado</option>
          <option value="Transferido">Transferido</option>
        </select>
        <select className="filtro-select" value={fCurso}    onChange={e => setFCurso(e.target.value)}>
          <option value="">📚 Todos os Cursos</option>
          {cursos.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="stats">
        {[
          {label:'Total',     value: alunos.length,                        color:'#2d4db5'},
          {label:'Masculino', value: alunos.filter(a=>a.sexo==='M').length, color:'#2c5282'},
          {label:'Feminino',  value: alunos.filter(a=>a.sexo==='F').length, color:'#8b2252'},
          {label:'Filtrados', value: filtrados.length,                      color:'#1a6b3c'},
        ].map(s => (
          <div className="stat" key={s.label}>
            <div className="stat-num" style={{color:s.color}}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="empty"><div className="empty-icon">⏳</div><h3>Carregando...</h3></div>
      ) : filtrados.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <h3>{busca||fSexo||fSituacao||fCurso ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}</h3>
          <p>{busca||fSexo||fSituacao||fCurso ? 'Tente outros filtros' : 'Importe um Excel ou adicione manualmente'}</p>
        </div>
      ) : (
        <div className="grid">
          {filtrados.map(a => {
            const tels = [a.tel1, a.tel2].filter(Boolean);
            return (
              <div className="card" key={a.id}>
                <div className="card-top">
                  <div>
                    <div className="card-matricula">MAT. {a.matricula || '—'}</div>
                    <div className="card-nome">{a.nome}</div>
                    <div className="card-meta">
                      {a.sexo === 'M' && <span className="badge badge-m">♂ Masculino</span>}
                      {a.sexo === 'F' && <span className="badge badge-f">♀ Feminino</span>}
                      {a.situacao     && <span className="badge badge-sit">{a.situacao}</span>}
                      {a.raca         && <span className="badge badge-raca">{a.raca}</span>}
                    </div>
                  </div>
                  <div className="card-btns">
                    <button className="cbtn cbtn-edit" onClick={() => abrirModal(a)}>✏️</button>
                    <button className="cbtn cbtn-del"  onClick={() => deletar(a.id)}>🗑️</button>
                  </div>
                </div>
                <div className="info-row">
                  {a.nascimento && <div className="info-item">🎂 <span>{a.nascimento}</span></div>}
                  {a.classe     && <div className="info-item">🏫 Classe <span>{a.classe}</span></div>}
                  {a.curso      && <div className="info-item" title={a.curso}>📚 <span>{a.curso.substring(0,30)}{a.curso.length>30?'...':''}</span></div>}
                </div>
                <div className="tel-grid">
                  {tels.length ? tels.map((t, i) => (
                    <div className="tel-item" key={i}>
                      <div className="tel-label">📱 Telefone {i+1}</div>
                      <div className="tel-numero">{t}</div>
                      <a className="btn-wpp" href={`https://wa.me/55${t.replace(/\D/g,'')}`} target="_blank" rel="noreferrer">💬 WhatsApp</a>
                    </div>
                  )) : (
                    <div className="tel-item" style={{gridColumn:'1/-1'}}>
                      <span className="tel-vazio">📵 Sem telefone</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalAberto && (
        <Modal aluno={editando} onSalvar={salvar} onFechar={() => { setModalAberto(false); setEditando(null); }}/>
      )}
    </div>
  );
}
