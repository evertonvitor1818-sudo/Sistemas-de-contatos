# 📞 Sistema de Contatos dos Alunos

## ▶️ COMO RODAR

### 1. BACKEND (servidor)

Abra o terminal na pasta `backend`:

```
cd backend
npm install
```

Crie o arquivo `.env` (copie o `.env.example` e renomeie):
```
PORT=3001
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/sistema_escolar
```
⚠️ Troque SUA_SENHA pela senha do seu PostgreSQL!

Crie o banco no PostgreSQL:
```
psql -U postgres
CREATE DATABASE sistema_escolar;
\q
```

Rode o servidor:
```
node server.js
```

Deve aparecer:
```
✅ Banco iniciado!
🚀 Servidor rodando na porta 3001
```

---

### 2. FRONTEND (tela)

Abra outro terminal na pasta `frontend`:

```
cd frontend
npm install
npm start
```

Acesse: http://localhost:3000

---

## 🔐 LOGIN
- Usuário: admin
- Senha: 123

---

## 📁 ESTRUTURA
```
sistema-escolar/
  backend/
    server.js      → servidor Node
    database.js    → conexão com banco
    .env           → configurações (criar manualmente)
    .env.example   → modelo do .env
  frontend/
    src/
      App.js
      api.js
      index.css
      components/
        Login.js
        Header.js
        Alunos.js
        Modal.js
```
