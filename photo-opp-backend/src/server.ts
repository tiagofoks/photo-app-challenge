import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente do .env

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do CORS para permitir requisições do frontend
app.use(cors({
  origin: 'http://localhost:3000', // Ou a URL de deploy do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middlewares
app.use(bodyParser.json({ limit: '10mb' })); // Aumenta o limite para body JSON (imagens podem ser grandes)
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Rota de Teste
app.get('/', (req, res) => {
  res.status(200).send('Photo Opp Backend is running!');
});

// TODO: Rotas para upload de imagem, integração com Firebase, etc.

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend is running on http://localhost:${PORT}`);
  console.log(`CORS configured for origin: http://localhost:3000`);
});