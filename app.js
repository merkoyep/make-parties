// Initialize
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const { PrismaClient } = require('@prisma/client');

// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Method override
app.use(methodOverride('_method'));

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

// Routes

// INDEX
require('./controllers/events')(app, prisma);

// EVENTS

// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening on port 3000!');
});
