import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import path from 'path';
import morgan from "morgan"

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(morgan('dev'))
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
}); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
