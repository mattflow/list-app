const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const path = require('path');
const cluster = require('cluster');
const cpus = require('os').cpus();
const mongoose = require('mongoose');
const apiRouter = require('./apiRouter');

const port = process.env.PORT || 8080;
const loggingType = process.env.LOGGING_TYPE || 'dev';
const clientPath = path.join(__dirname, 'client/build');
const mongodbUri = process.env.MONGODB_URI || 'mongodb://user:password1@ds053459.mlab.com:53459/list-app-dev';

mongoose.connect(mongodbUri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(loggingType));
app.use(cors());
app.use(helmet());
app.use(express.static(clientPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.use('/api', apiRouter);

db.on('open', () => {
  if (process.env.NODE_ENV === 'production' && cluster.isMaster) {
    cpus.forEach(() => {
      cluster.fork();
    });

    cluster.on('exit', () => {
      cluster.fork();
    });
  } else {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});
