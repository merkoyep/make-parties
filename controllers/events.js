const { format } = require('date-fns');

module.exports = function (app, prisma) {
  app.get('/', async (req, res) => {
    const events = await prisma.event.findMany();
    res.render('events-index', { events: events });
  });
  app.get('/events', async (req, res) => {
    const events = await prisma.event.findMany();
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
        include: {
          rsvps: true, // Correctly include the 'rsvps' relation
        },
      });

      if (event) {
        // Assuming 'createdAt' is correctly a Date object
        const createdAtFormatted = format(
          event.createdAt,
          'MMMM do, yyyy h:mm:ss a'
        );

        // Since we cannot directly modify the 'event' object returned by Prisma,
        // create a new object for rendering that includes the formatted date.
        const eventForRendering = {
          ...event,
          createdAtFormatted: createdAtFormatted,
          rsvps: event.rsvps, // Directly pass the included 'rsvps'
        };

        res.render('events-show', { event: eventForRendering });
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

  app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.event.delete({
        where: { id: parseInt(id, 10) },
      });
      res.redirect('/events');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
};
