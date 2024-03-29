// Initialize
const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client');

// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

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
app.get('/', async (req, res) => {
  const events = await prisma.event.findMany();
  res.render('events-index', { events: events });
});

// EVENTS
app.get('/events/new', (req, res) => {
  res.render('events-new', {});
});

app.get('/events', async (req, res) => {
  const events = await prisma.event.findMany();
  console.log(events);
  res.render('events-index', { events: events });
});

app.post('/events', async (req, res) => {
  console.log(req.body);
  const { title, description, imgUrl } = req.body;
  const result = await prisma.event.create({
    data: {
      title,
      description,
      imgUrl,
    },
  });
  res.json(result);
});

// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening on port 3000!');
});
