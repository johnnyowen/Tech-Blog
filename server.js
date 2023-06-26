// import express
const express = require('express');
// import connection to database
const sequelize = require('./config/connection');

require('./models'); // this line will no longer be needed after we bring in our models via the routes

// set up express app
const app = express();
const PORT = process.env.PORT || 3001;

// connect to database before starting express server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
});