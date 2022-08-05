'use strict';

console.log('');
console.log('//Munzi Backend//');
console.log('');

var res = require('dotenv').config();

//Import Config
const config = require('./lib/config');
// const socket = require("socket.io");

 config.dbConfig((err) => {
  if (err) {
    // logger.error(err, 'exiting the app.');

    console.log({ err });
    return;
  }

  // load external modules
  const express = require('express');

  // init express app
  const app = express();

  // config express
  config.expressConfig(app);
  if (err) return res.json(err);

  // attach the routes to the app
  require('./lib/routes')(app);
const port=2000
  // start server
  const server = app.listen(port, () => {
    console.log(`Express server listening on ${port}`);
    // logger.info(`Express server listening on ${config.cfg.port}, in ${config.cfg.TAG} mode`);
  });

 
});
