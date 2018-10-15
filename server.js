const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const path = require('path');
const cluster = require('cluster');
const cpus = require('os').cpus();

const port = process.env.PORT || 8080;
const loggingType = process.env.LOGGING_TYPE || 'dev';
const clientPath = path.join(__dirname, 'client/build');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(loggingType));
app.use(cors());
app.use(helmet());
app.use(express.static(clientPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to my API!',
  });
});

app.get('/api/lists', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Groceries',
    },
    {
      id: 2,
      name: 'Todos',
    },
  ]);
});

if (process.env.NODE_ENV === 'production' && cluster.isMaster) {
  cpus.forEach(() => {
    cluster.fork();
  });

  cluster.on('exit', worker => {
    cluster.fork();
  });
} else {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
