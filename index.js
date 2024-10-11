const express = require('express')
const session = require('express-session')
const passport = require('passport')
require('./auth')
require('dotenv').config();

const app = express()

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401)
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
})

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
))

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
)

app.get('/auth/google/failure', (req, res) => {
    res.send('something went wrong...')
})

app.get('/protected', isLoggedIn, (req, res) => {
    res.send(`
      Hello ${req.user.displayName} <br>
      Email: ${req.user.email} <br>
      User ID: ${req.user.id} <br>
      First Name: ${req.user.name.givenName} <br>
      Last Name: ${req.user.name.familyName} <br>
      Profile Picture: <img src="${req.user.photos[0].value}" alt="Profile Picture" /> <br>
      Provider: ${req.user.provider}
    `);
  });
  

app.get('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.send('Goodbye!')
})

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate...')
})

app.listen(5000, () => console.log('listening on port: 5000'))