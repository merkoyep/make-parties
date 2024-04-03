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
          rsvps: true, // Include the RSVPs
        },
      });

      if (event) {
        // Format the createdAt date; assuming it's already a JavaScript Date object
        const createdAtFormatted = format(
          event.createdAt,
          'MMMM do, yyyy h:mm:ss a'
        );

        // Prepare the event data for rendering, including the formatted createdAt date
        const eventDataForRendering = {
          ...event,
          createdAtFormatted, // Add the formatted createdAt string
          rsvps: event.rsvps, // Directly pass the included rsvps
        };

        // Render the template with the prepared event data
        res.render('events-show', { event: eventDataForRendering });
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
    // Assuming the user's ID is stored in req.session.userId
    // You need to replace this with whatever mechanism you use to store the authenticated user's ID
    const userId = res.locals.currentUser.id; // For example purposes

    if (!userId) {
      // Handle the case where the user is not logged in or the user ID is not available
      return res.status(403).send('User must be logged in to create an event.');
    }

    try {
      const result = await prisma.event.create({
        data: {
          title,
          description,
          imgUrl,
          userId, // Include the userId in the event creation
        },
      });
      res.redirect('/events');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
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
