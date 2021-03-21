const express = require('express');
const connectionDB = require('./config/db');
const cors = require('cors');

//Creating server
const app = express();

//Connect to Database
connectionDB();

//cors
app.use(cors());

// Express.json 
app.use(express.json({extended: true}));

// APP PORT
const PORT = process.env.PORT || 4000;


app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Starting app
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})