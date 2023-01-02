const express = require('express');


const cors = require('cors');
// const compression = require('compression');

const Mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
// const debug = require('debug')('backend:server');

const index = require('./src/routers/index');

const app = express();


// compressing api response
// app.use(compression());

// logger
// app.use(morgan('dev'));

// Get port from environment and store in Express.
// const PORT = portUtils.normalizePort(process.env.PORT || '5000');
// app.set('port', PORT);

// cors enable
app.use(cors());


// security config


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: connection with client setup
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));
//
//   app.get('/', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

// all the api routers
app.use('/api', index);

// index setup
// const server = http.createServer(app);


// Database Connection
Mongoose.connect(
  "mongodb+srv://oshan:r4lnHCmIcnIOkTm0@cluster0.w4kso6o.mongodb.net/?retryWrites=true&w=majority",
  {
   
  },
  (error) => {
    if (!error) {
      console.log("Success");
    } else {
      console.log(error);
    }
  }
);

// Listen on provided port, on all network interfaces.
app.listen(3000, ()=> {
  console.log("App is running on PORT 3000");
});
// server.on('error', portUtils.onError);
// server.on('listening', onListening);
