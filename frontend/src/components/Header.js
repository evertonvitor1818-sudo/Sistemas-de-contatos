export default function Header({ onLogout, onToggleTema, tema }) {
  return (
    <header className="header">
      <div className="header-row">
        <div>
          <div className="header-sub">ESCOLA MUNICIPAL SANTO CRISTO</div>
          <h1 className="header-titulo">📞 Contatos dos Alunos</h1>
          <p className="header-desc">Gerenciamento de telefones e dados dos alunos</p>
        </div>
        <div className="header-btns">
          <button className="btn-tema" onClick={onToggleTema}>
            {tema === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Noturno'}
          </button>
          <button className="btn-sair" onClick={onLogout}>🚪 Sair</button>
        </div>
      </div>
    </header>
  );
}
