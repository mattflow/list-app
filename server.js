const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 8080;
const clientPath = path.join(__dirname, 'client/build');

app.use(express.static(clientPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to my API!',
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
