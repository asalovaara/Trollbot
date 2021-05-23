const express = require('express');
const cors = require('cors');
const {botAnswer} = require('./bot');
const {inspect} = require('util');

const app = express();


app.use(express.json()); // for parsing JSON
app.use(express.urlencoded({extended: true}));
app.use(cors()); // to enable cross-origin resource sharing



app.post("/trollbot", (req, res) => {

  console.log(`Request headers: ${JSON.stringify(req.headers)}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  var message = botAnswer(req.body.message);
  res.json({ message: message });
});


const port = 3001

app.listen(port);
console.log(`Server running on port ${port}`) 

module.exports = app;