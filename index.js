const connnectToMongo = require('./db');
const express = require('express');
const cors = require('cors')
const compression = require('compression');
require('dotenv').config()

const app = express()
app.use(compression())



connnectToMongo();

const port = process.env.PORT || 5000
app.use(cors());

app.use(express.json());

//Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});