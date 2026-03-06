import { useState, useEffect } from 'react';
import Login  from './components/Login';
import Header from './components/Header';
import Alunos from './components/Alunos';

export default function App() {
  const [logado, setLogado] = useState(false);
  const [tema,   setTema]   = useState(localStorage.getItem('tema') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  function toggleTema() {
    setTema(t => t === 'light' ? 'dark' : 'light');
  }

  if (!logado) return <Login onLogin={() => setLogado(true)} />;

  return (
    <div>
      <Header onLogout={() => setLogado(false)} onToggleTema={toggleTema} tema={tema} />
      <Alunos />
    </div>
  );
}
