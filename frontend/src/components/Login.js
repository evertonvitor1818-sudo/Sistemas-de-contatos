import { useState } from 'react';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha,   setSenha]   = useState('');
  const [erro,    setErro]    = useState(false);

  function entrar() {
    if (usuario === 'admin' && senha === '123') {
      onLogin();
    } else {
      setErro(true);
      setSenha('');
    }
  }

  return (
    <div className="login-bg">
      <div className="login-box">
        <div className="login-icon">📞</div>
        <h1 className="login-titulo">Contatos dos Alunos</h1>
        <p className="login-sub">Faça login para acessar o sistema</p>
        {erro && <div className="login-erro">❌ Usuário ou senha incorretos!</div>}
        <label className="login-label">Usuário</label>
        <input
          className="login-input"
          placeholder="Digite o usuário"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && entrar()}
        />
        <label className="login-label">Senha</label>
        <input
          className="login-input"
          type="password"
          placeholder="Digite a senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && entrar()}
        />
        <button className="login-btn" onClick={entrar}>🔓 Entrar</button>
      </div>
    </div>
  );
}
