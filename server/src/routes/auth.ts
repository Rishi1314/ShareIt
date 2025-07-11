import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();    

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',passport.authenticate('google',{session:false,failureRedirect:'/'}),
    (req: any, res) => {
        const user = req.user;
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });
        res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
    }
)

export default router;
// This code sets up the authentication routes for Google OAuth using Passport.js.
// It includes a route to initiate the Google authentication process and a callback route to handle the response.
// Upon successful authentication, it generates a JWT token and redirects the user to the client application with the
// token included in the URL.
// The JWT token is signed with a secret key and has an expiration time of 1 day.
// The `passport.authenticate` middleware is used to handle the authentication flow, and the user information is
// extracted from the request object in the callback route.
// The `dotenv` package is used to load environment variables, such as the JWT secret and client URL, from a `.env` file.
// The `express` package is used to create the
// router and define the authentication routes.
// The `jsonwebtoken` package is used to create the JWT token.
// The `passport` package is used for handling authentication strategies, specifically the Google OAuth strategy.   