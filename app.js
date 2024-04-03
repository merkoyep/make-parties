// Initialize
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const app = express();
const session = require('express-session');

// INITIALIZE BODY-PARSER AND ADD IT TO APP
app.use(bodyParser.urlencoded({ extended: true }));

// Method override
app.use(methodOverride('_method'));

// cookie parser
app.use(cookieParser('SECRET'));
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 60); // 60 days

app.use(
  session({
    secret: 'SUPER_SECRET_SECRET',
    cookie: { expires: expiryDate },
    resave: false,
  })
);

// authenticateToken middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (token) {
    try {
      const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verifiedUser; // Attach the user's data to the request object
    } catch (error) {
      console.error(error);
      res.clearCookie('token'); // Clears the invalid token
    }
  }
  next(); // Proceed with the next middleware whether authenticated or not
}

app.use(function (req, res, next) {
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

app.use(authenticateToken);

app.use((req, res, next) => {
  if (req.user) {
    prisma.user
      .findUnique({
        where: {
          id: req.user.id,
        },
      })
      .then((currentUser) => {
        console.log('User found:', currentUser);
        // Make the user object available in all controllers and templates
        res.locals.currentUser = currentUser;
        next();
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  } else {
    next();
  }
});

// Initialize prisma client
const prisma = new PrismaClient();

// require handlebars
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set('view engine', 'handlebars');

// EVENTS
require('./controllers/events')(app, prisma);
require('./controllers/rsvps')(app, prisma);
require('./controllers/auth')(app, prisma);

// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening on port 3000!');
});
