import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import photoRoutes from './routes/photoRoutes'; 

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));

app.get('/', (req, res) => {
  res.status(200).send('Photo Opp Backend Express App is running!');
});


app.use('/api', photoRoutes); 

export default app;