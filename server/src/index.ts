import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './routes/auth';
import ipfsRoutes from './routes/ipfs';
import cors from 'cors';
import './config/passport'; 
import { PrismaClient } from '@prisma/client';
dotenv.config();
const app = express();

// ✅ CORS Middleware
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`, // frontend
    credentials: true,
  })
)

// ✅ Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const prisma = new PrismaClient();

app.use(passport.initialize());
app.get('/', (_, res) => res.send('ShareIt Backend Running'));

app.use('/auth', authRoutes);
app.use('/upload', ipfsRoutes)




// DB test route


app.listen(process.env.PORT || 5000, () => console.log('Server ready'));