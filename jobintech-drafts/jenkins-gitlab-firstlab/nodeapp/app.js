const express = require('express');

const app = express();

const port = 3000;

app.get('/', (req, res) => {
  res.send('la formation jobInTech');
});

app.listen(port, () => {
  console.log(`L'application écoute à l'adresse http://localhost:${port}`);
});
