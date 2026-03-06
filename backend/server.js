const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const { pool, iniciarBanco } = require('./database');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Buscar todos os alunos
app.get('/alunos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM alunos ORDER BY nome ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Adicionar aluno
app.post('/alunos', async (req, res) => {

  const { matricula, nome, nascimento, classe, sexo, situacao, raca, curso, tel1, tel2 } = req.body;

  if (!nome || nome.trim().length < 2) {
    return res.status(400).json({ erro: 'Nome inválido!' })
  }

  if (tel1 && tel1.replace(/\D/g, '').length < 11) {
    return res.status(400).json({ erro: 'Telefone 1 inválido!' })
  }
  if (tel1 && tel1.replace(/\D/g, '').length > 11) {
    return res.status(400).json({ erro: 'Telefone 1 inválido!' })
  }

  if (tel2 && tel2.replace(/\D/g, '').length < 11) {
    return res.status(400).json({ erro: 'Telefone 2 inválido!' })
  }
  if (tel2 && tel2.replace(/\D/g, '').length > 11) {
    return res.status(400).json({ erro: 'Telefone 2 inválido!' })
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO alunos (matricula,nome,nascimento,classe,sexo,situacao,raca,curso,tel1,tel2)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [matricula,nome,nascimento,classe,sexo,situacao,raca,curso,tel1,tel2]
    );

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }

});


// Editar aluno
app.put('/alunos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { matricula, nome, nascimento, classe, sexo, situacao, raca, curso, tel1, tel2 } = req.body;
    const { rows } = await pool.query(
      `UPDATE alunos SET matricula=$1,nome=$2,nascimento=$3,classe=$4,
       sexo=$5,situacao=$6,raca=$7,curso=$8,tel1=$9,tel2=$10
       WHERE id=$11 RETURNING *`,
      [matricula,nome,nascimento,classe,sexo,situacao,raca,curso,tel1,tel2,id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar aluno
app.delete('/alunos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM alunos WHERE id=$1', [req.params.id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Importar vários alunos
app.post('/alunos/importar', async (req, res) => {
  try {
    const { alunos } = req.body;
    let count = 0;
    for (const a of alunos) {
      await pool.query(
        `INSERT INTO alunos (matricula,nome,nascimento,classe,sexo,situacao,raca,curso,tel1,tel2)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [a.matricula,a.nome,a.nascimento,a.classe,a.sexo,a.situacao,a.raca,a.curso,a.tel1,a.tel2]
      );
      count++;
    }
    res.json({ importados: count });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

iniciarBanco().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
});
