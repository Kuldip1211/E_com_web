const express = require("express");
const app = express();
require('dotenv').config();
const net = require('net');
const dbconnect = require("./config/dbconnect");
const authRoute = require("./routes/authroute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 4000;
const { notFound, errorHandler} = require("./middleware/errorHandler");
dbconnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRoute);

// Error handler
app.use(notFound);
app.use(errorHandler);

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
