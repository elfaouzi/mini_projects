const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.get('/api', (req, res) => {
  res.json({ message: "Hello from Dockerized Backend! inchaalah" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
