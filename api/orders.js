const express=require('express');
const router = express.Router();
const mongoose= require('mongoose');
const Order=require('../models/order');
const Product=require('../models/product');
const checkAuth = require('../middleware/check-auth');


router.get('/',checkAuth,(req,res,next)=>{
    Order.find()
    .populate('product','name')
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });

})
router.post('/',checkAuth,(req,res,next)=>{
    Product.findById({_id:req.body.productId}).exec().then(product=>{
        if(!product){
            return res.status(404).json({
                message:'No produt fount with this id'
            })
        }
        const order=new Order({
            _id:new mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product:req.body.productId
        });
        return order.save();
    })
    .then(result=>{
        console.log(result);
        res.status(200).json({
            result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
    
    
})

router.get('/:orderId',checkAuth,(req,res,next)=>{
    Order.findById({_id:req.params.orderId})
    .populate('product')
    .exec()
    .then(result=>{
        console.log(result)
        res.status(200).json({
            result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})

router.delete('/:orderId',checkAuth,(req,res,next)=>{
    Order.remove({_id:req.params.orderId}).exec()
    .then(result=>{
        console.log(result)
        res.status(200).json({
            result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})




module.exports = router;