/*eslint no-console:0*/

'use strict';

import server from './app';
import config from 'config';
import {log} from 'util';
import https from 'https';
import http from 'http';
import Future from 'fluture';
import {futurize} from 'futurize';
import fs from 'fs';

const readFile = futurize(Future)(fs.readFile);

if(config.get('server.http.enabled')){
  const connection = http.createServer(server).listen(
    config.get('server.http.port'),
    config.get('server.http.host'),
    () => {
      const addr = connection.address();
      log('HTTP Server listening on %s:%s', addr.address, addr.port);
    }
  )
}

if(config.get('server.https.enabled')){
  Future.of(key => cert => Future.node(done => {
    const connection = https.createServer({key, cert}, server).listen(
      config.get('server.https.port'),
      config.get('server.https.host'),
      err => done(err, connection)
    )
  }))
  .ap(readFile(config.get('server.https.key')))
  .ap(readFile(config.get('server.https.cert')))
  .chain(m => m)
  .fork(err => {
    console.warn(err);
    process.exit(1);
  }, connection => {
    const addr = connection.address();
    log('HTTPS Server listening on %s:%s', addr.address, addr.port);
  })
}
