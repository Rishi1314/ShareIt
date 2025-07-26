import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();    

// Start Google OAuth login
router.get('/google', (req, res, next) => {
  console.time('⏱️ /auth/google');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google OAuth callback
router.get(
  '/google/callback',
  (req, res, next) => {
    console.time('⏱️ /auth/google/callback');
    next();
  },
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req: any, res) => {
    try {
      const user = req.user;
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      );

      console.log(`✅ Google login success: ${user.email}`);
      console.timeEnd('⏱️ /auth/google/callback');

      res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
    } catch (err) {
      console.error('❌ Error during Google OAuth callback:', err);
      console.timeEnd('⏱️ /auth/google/callback');
      res.redirect('/');
    }
  }
);

export default router;
