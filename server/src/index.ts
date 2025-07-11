import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './routes/auth';
import './config/passport'; 
import { PrismaClient } from '@prisma/client';
dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(passport.initialize());
app.get('/', (_, res) => res.send('ShareIt Backend Running'));

app.use('/auth', authRoutes);


// DB test route
app.get('/test-db', async (_, res) => {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

app.listen(process.env.PORT || 5000, () => console.log('Server ready'));