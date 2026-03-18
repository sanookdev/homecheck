import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import checklistRoutes from './routes/checklists.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/checklists', checklistRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Homecheck API v1' });
});

// Since Vercel serverless functions handle routing, 
// exporting the app is required.
export default app;
