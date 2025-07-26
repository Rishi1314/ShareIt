import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

console.log('🔐 Initializing Google OAuth Strategy...');
console.log('🌐 Server URL:', process.env.SERVER_URL);
console.log('🧩 Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Loaded ✅' : 'Missing ❌');
console.log('🔑 Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Loaded ✅' : 'Missing ❌');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(`👤 Google profile received: ${profile.displayName} (${profile.id})`);

        // Check for existing user
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        // Create if not exists
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails?.[0]?.value || '',
              name: profile.displayName,
            },
          });
          console.log('🆕 New user created:', user.email);
        } else {
          console.log('✅ Existing user logged in:', user.email);
        }

        return done(null, user);
      } catch (err) {
        console.error('❌ Error in GoogleStrategy callback:', err);
        return done(err, undefined);
      }
    }
  )
);
