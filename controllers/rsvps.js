module.exports = function (app, prisma) {
  app.get('/events/:eventId/rsvps/new', async (req, res) => {
    const eventId = parseInt(req.params.eventId, 10);
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    res.render('rsvps-new', { event: event });
  });

  app.post('/events/:eventId/rsvps', async (req, res) => {
    const { name, email } = req.body;
    const eventId = parseInt(req.params.eventId, 10);
    const result = await prisma.rsvp.create({
      data: {
        name,
        email,
        event: {
          connect: { id: eventId },
        },
      },
    });
    res.redirect(`/events/${eventId}`);
  });

  app.delete('/events/:eventId/rsvps/:id', async (req, res) => {
    const { id, eventId } = req.params;
    try {
      await prisma.rsvp.delete({
        where: { id: parseInt(id, 10) },
      });
      res.redirect(`/events/${eventId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
};
