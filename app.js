// Initialize
const express = require('express');
const app = express();

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
// OUR MOCK ARRAY OF PROJECTS
const events = [
  {
    title: 'I am your first event',
    desc: 'A great event that is super fun to look at and good',
    imgUrl:
      'https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn',
  },
  {
    title: 'I am your second event',
    desc: 'A great event that is super fun to look at and good',
    imgUrl:
      'https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn',
  },
  {
    title: 'I am your third event',
    desc: 'A great event that is super fun to look at and good',
    imgUrl:
      'https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn',
  },
];

// INDEX
app.get('/', (req, res) => {
  res.render('events-index', { events: events });
});

// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening on port 3000!');
});
