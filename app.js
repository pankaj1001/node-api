const express = require('express');
const morgan = require('morgan');
const bodyParser= require('body-parser');
const mongoose=require('mongoose');

const app=express();
const ordersRoutes=require('./api/orders');
const productsRoutes=require('./api/products');
const userRoutes=require('./api/users');
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };
mongoose.connect('mongodb://user1:user1@pankajsinghmongodb-shard-00-00-ndedm.mongodb.net:27017,pankajsinghmongodb-shard-00-01-ndedm.mongodb.net:27017,pankajsinghmongodb-shard-00-02-ndedm.mongodb.net:27017/test?ssl=true&replicaSet=PankajSinghMongoDB-shard-0&authSource=admin&retryWrites=true',options)
app.use('/uploads',express.static('upload'))


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin,X-Requested-With, Content-Type, Accept,Authorization');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }   
    next();


})

app.use('/products',productsRoutes);
app.use('/orders',ordersRoutes);
app.use('/user',userRoutes);

app.use((req,res,next)=>{
    const error=new Error('Not Found');
    error.status=406;;
    next(error);
})

app.use((req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    })
})

module.exports = app;