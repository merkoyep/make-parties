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
app.get('/', async (req, res) => {
  const events = await prisma.event.findMany();
  res.render('events-index', { events: events });
});

// EVENTS
app.get('/events', async (req, res) => {
  const events = await prisma.event.findMany();
  console.log(events);
  res.render('events-index', { events: events });
});

app.get('/events/new', (req, res) => {
  res.render('events-new', {});
});

app.get('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (event) {
      res.render('events-show', { event });
    } else {
      res.status(404).send('Event not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/events/:id/edit', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (event) {
      res.render('events-edit', { event });
    } else {
      res.status(404).send('Event not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/events', async (req, res) => {
  const { title, description, imgUrl } = req.body;
  const result = await prisma.event.create({
    data: {
      title,
      description,
      imgUrl,
    },
  });
  res.redirect('/events');
});

app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, imgUrl } = req.body;
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        description,
        imgUrl,
      },
    });
    res.redirect(`/events/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening on port 3000!');
});
