const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function iniciarBanco() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS alunos (
      id          SERIAL PRIMARY KEY,
      matricula   VARCHAR(20),
      nome        VARCHAR(200) NOT NULL,
      nascimento  VARCHAR(20),
      classe      VARCHAR(10),
      sexo        VARCHAR(1),
      situacao    VARCHAR(50),
      raca        VARCHAR(50),
      curso       VARCHAR(200),
      tel1        VARCHAR(30),
      tel2        VARCHAR(30),
      criado_em   TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Banco iniciado!');
}

module.exports = { pool, iniciarBanco };
