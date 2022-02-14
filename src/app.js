//if (process.env.ENV != "production") {
   
      
///  }else{
  //  console.info("Production Env")
 // }
  require('dotenv').config();
  const express = require('express');
  const logger = require('morgan');
  const cookieParser = require('cookie-parser');
  const bodyParser = require('body-parser');
  const helmet = require('helmet');
  
  // Routes imports
 // const index = require('./routes/index');
  const muk = require('./routes/muk');
  const user = require('./routes/users');
  
  const compression = require('compression');
  
  let app = express();
  app.use(compression())
  
  app.set('trust proxy', true);
  app.use(helmet());
  
  
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-access-token,x-access-user, Content-Type, Accept, X-Access-Device, X-Firebase-Token");
    next();
  });
  

  // Routes
 app.use('/users', user);
 app.use('/muk', muk);
  // catch 404 and forward to error handler
   app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.send({
      success: false,
      message: res.locals.message,
      error: res.locals.error
    });
  });
   
 // require('./server');
  
  module.exports = app;