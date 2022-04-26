require('dotenv').config();
const con = require('./db-config')
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;

con.connect((err) => {
  if(err) {
    console.error('Error connecting to the database' + err.stack);
  } else {
    console.log('Connected as id ' + con.threadId);
  }
});

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);

app.get('/', (req,res) => {
  res.send('Welcome');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;