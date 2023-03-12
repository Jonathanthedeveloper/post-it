// importing dependencies
const app = require('./app');
const { connect } = require('mongoose');

// Importing defined modules
const { PORT } = require('./config');


// Connecting to database using Mongoose ORM
(async function () {
    try {
        await connect(process.env.ONLINE_URI);
        console.log('connected to database')
    } catch (error) {
        console.error(`something went wrong while connecting to database: ${error.message}`);
    }
})()

app.listen(PORT, function () {
    console.log(`server started on http://127.0.0.1:${PORT}`)
});