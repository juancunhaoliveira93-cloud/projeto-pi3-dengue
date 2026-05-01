/* server.js - BACKEND 
   Ajuste: Busca flexível por Estado/Município
*/

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'dengue_db',
  password: process.env.DB_PASSWORD || 'administrador',
  port: process.env.DB_PORT || 5432,
});

// Rota de Casos (KPIs) 
app.get('/api/casos', async (req, res) => {
  const { ano, estado } = req.query;

  try {
    // Busca inteligente: tenta achar a sigla na coluna 'estado' ou 'municipio'
    const query = `
      SELECT SUM(casos) as total_casos 
      FROM casos_dengue 
      WHERE ano = $1 AND (municipio ILIKE $2 OR estado ILIKE $2)
    `;
    const values = [ano, `%${estado || ''}%`];
    
    const result = await pool.query(query, values);
    const total = parseFloat(result.rows[0]?.total_casos) || 0;
    
    res.json({ total_casos: total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota do Gráfico (Série Histórica)
app.get('/api/grafico', async (req, res) => {
  try {
    const query = 'SELECT ano, SUM(casos) as total FROM casos_dengue GROUP BY ano ORDER BY ano ASC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});