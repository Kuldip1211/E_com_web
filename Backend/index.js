const express = require("express");
const app = express();
require('dotenv').config();

const net = require('net');
const dbconnect = require("./config/DBconnect");
const authRoute = require("./routes/authroute");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const PORT = process.env.PORT || 4000;

dbconnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", authRoute);

// error handler
app.use(notFound);
app.use(errorHandler);

// listing on the port
function checkPort(port) {
  return new Promise((resolve, reject) => {
    const tester = net.createServer()
      .once('error', err => {
        if (err.code === 'EADDRINUSE') {
          reject(new Error(`Port ${port} is already in use`));
        } else {
          reject(err);
        }
      })
      .once('listening', () => {
        tester
          .once('close', () => {
            resolve(port);
          })
          .close();
      })
      .listen(port);
  });
}

checkPort(PORT)
  .then(port => {
    app.listen(port, () => {
      console.log(`Listening on ${port}`);
    });
  })
  .catch(err => {
    console.error(err.message);
  });
