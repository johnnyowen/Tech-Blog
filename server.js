// import express
const express = require('express');

// import connection to database
const sequelize = require('./config/connection');

// Import express-handlebars
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });
const path = require('path');

// set up express app
const app = express();
const PORT = process.env.PORT || 3001;

// set up express session
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// import our routes
const routes = require('./controllers');
app.use(express.static(path.join(__dirname, 'public')));

// configure session object
const sess = {
    // secret is used to sign cookies
    secret: process.env.DB_SECRET,
    // cookie options
    cookie: {
      maxAge: 60 * 60 * 1000, // expires after 1 hour
      // only store session cookies when protocol used by client to connect to server is HTTP
      httpOnly: true, 
      secure: false,
    },
    // resave session to store even if session is not modified during request-response cycle
    resave: false,
    // save uninitialized session to store (uninitialized means new but not modified)
    saveUninitialized: false,
    // set-up session store
    store: new SequelizeStore({
      db: sequelize,
    }),
};

// mount session middleware
app.use(session(sess));

// The following two lines of code are setting Handlebars.js as the default template engine.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// set up middleware to parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mount the routes
app.use(routes);

// connect to database before starting express server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
});