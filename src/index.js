const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const GitHubStrategy = require('passport-github').Strategy;
const { routes } = require('./routes');
const logger = require('./logger');
// Load environment variables
const result = dotenv.config();

if (result.error) {
  console.error("Error loading .env file:", result.error);
  logger.error(`Error loading issue: ${result.error}`);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Configure GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Store user information in the session
      logger.info('profile',profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
  logger.info('user',user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
logger.info('success');
// Routes
app.use('/api', routes);
 
// GitHub OAuth routes
app.get('/auth/github', passport.authenticate('github'));
console.log('as')
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (_req, res) => {
    logger.info('success',res);
    // Successful authentication, redirect to the home page.
    res.redirect('/');
  }
);
console.log('as2')
// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
