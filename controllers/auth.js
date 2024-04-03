require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

module.exports = function (app, prisma) {
  app.get('/sign-up', async (req, res) => {
    res.render('auth-sign-up');
  });
  app.get('/login', async (req, res) => {
    res.render('auth-login');
  });
  app.post('/sign-up', async (req, res) => {
    const { username, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    res.redirect('/');
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { username: user.username, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      req.session.sessionFlash = {
        type: 'success',
        message: 'Logged in successfully!',
      };

      // Store the JWT in a cookie instead of sending it in the response body
      res
        .cookie('token', token, {
          httpOnly: true, // The cookie cannot be accessed through client-side script
          secure: true, // Only transfer cookies over HTTPS
          sameSite: 'strict', // Prevents CSRF attacks
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        })
        .redirect('/');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });

  app.get('/logout', (req, res, next) => {
    res.clearCookie('token');
    // req.session.sessionFlash = { type: 'success', message: 'Successfully logged out!' }
    return res.redirect('/');
  });
};
