/* Onde o Victor vai configurar o servidor Node.js/Express.*/
/* PROJETO: Painel Analítico Dengue Brasil
  DESENVOLVEDOR: Victor (Backend)
  REVISÃO: Final de Integração (Juan & Carine)
*/

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// 1. Configurações de Middleware
// O CORS é essencial para que o seu frontend consiga ler os dados deste servidor
app.use(cors());
app.use(express.json());

// 2. Configuração da conexão com o Banco de Dados (PostgreSQL)
// Agora usando variáveis de ambiente do .env para evitar erros de senha
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'dengue_db',
  password: process.env.DB_PASSWORD || 'administrador',
  port: process.env.DB_PORT || 5432,
});

// Teste inicial de conexão com o banco ao ligar o servidor
pool.connect((err) => {
  if (err) {
    console.error('ERRO CRÍTICO: Não foi possível conectar ao PostgreSQL.', err.stack);
  } else {
    console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
  }
});

// 3. Rota para os KPIs (Filtros por Ano e Estado)
app.get('/api/casos', async (req, res) => {
  const { ano, estado } = req.query;

  try {
    const query = `
      SELECT SUM(casos) as total_casos 
      FROM casos_dengue 
      WHERE ano = $1 AND municipio ILIKE $2
    `;
    const values = [ano, `%${estado || ''}%`];
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro na rota /api/casos:", err.message);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// 4. Rota para a Série Histórica (Gráfico de Linha)
app.get('/api/grafico', async (req, res) => {
  try {
    const query = `
      SELECT ano, SUM(casos) as total 
      FROM casos_dengue 
      GROUP BY ano 
      ORDER BY ano ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro na rota /api/grafico:", err.message);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// 5. Inicialização do Servidor
app.listen(port, () => {
  // Uso das CRASES corrigido para exibir o link clicável no VS Code
  console.log(`Servidor rodando em http://localhost:${port}`);
});