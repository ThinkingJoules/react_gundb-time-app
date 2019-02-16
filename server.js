const path = require('path');
const express = require('express');
var bodyParser = require('body-parser');
const Gun = require('gun');
const c = require('./credentials.js');
require('gun/sea');
require("babel-core/register");
require("babel-polyfill");

const port = (process.env.PORT || 8080);

const app = express();

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config.js');
  const compiler = webpack(config);

  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));

  app.post('/createuser', function(req, res) {
      gun.user().get('employees').get('pub').set(req.body.pub);
      console.log('set new user w/ pub key ' + req.body.pub);
      res.end();
  });

  app.post('/serverpub', function(req, res) {
      res.send(gun.user().is.pub);
  });
}else{
  const indexPath = path.join(__dirname, 'dist/index.html');
  app.use(express.static('dist'));
  app.get('*', function (_, res) {
    res.sendFile(indexPath);
  });

  app.post('/createuser', function(req, res) {
      gun.user().get('employees').get('pub').set(req.body.pub, function(ack) {
        if(ack.err) {
          console.log(ack.err);
          res.end();
        }
        else {
          console.log('set new user w/ pub key ' + req.body.pub);
          res.end();
        }
      });
  });

  app.post('/serverpub', function(req, res) {
      res.send(gun.user().is.pub);
  });
}

app.use(Gun.serve);

const server = app.listen(port);

var gun = Gun({web: server });

//One time run for server gun user

// gun.user().create(c.creds.username, c.creds.password, function(ack){
//  if (ack.err){
//      console.log(ack.err);
//  }
//  else{
//   gun.user().auth(c.creds.username, c.creds.password, function(ack){
//        console.log(gun.user().is.pub);
//     })
//   }
// });

gun.user().auth(c.creds.username, c.creds.password, function(ack) {
  if(ack.err) {
    console.log(ack.err);
  }
  else {
    console.log('Server gun user authenticated.');
  }
});