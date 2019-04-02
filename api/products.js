const express=require('express');
const router = express.Router();
const mongoose=require('mongoose');
const Product=require('../models/product');
const multer=require('multer');
const checkAuth=require('../middleware/check-auth');

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./upload');
    },
    filename(req,file,cb){
        cb(null,new Date().getMilliseconds()+'-'+file.originalname);
    }
})
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png'|| file.mimetype==='image/jepg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const upload=multer({
    storage:storage,
    limits:1024*5,
    fileFilter:fileFilter

});


router.get('/',(req,res,next)=>{
    Product.find().exec()
    .then(result=>{
        console.log(result);
        // if(result.length>0){
            res.status(200).json({
                result
            })
        // }else{
        //     res.status(404).json({
        //         message:'No entry found'
        //     })
        // }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })
})


router.post('/',checkAuth,upload.single('productImage'),(req,res,next)=>{
    console.log(req.file)
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    })
    product.save().then(result=>{
        console.log(result);
        if(result){
            res.status(201).json({
                createdProduct:product
            })
        }else{
            res.status(404).json({
                message:'No valid entry'
            })
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
    
})
router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    Product.findById(id).exec()
    .then(doc=>{
        console.log(doc);
        res.status(200).json({
            doc
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })
})

router.patch('/:productId',checkAuth,(req,res,next)=>{
    const id=req.params.productId;
    const updateOps={};
    console.log(req.body)
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.update({_id:id},{$set:updateOps}).exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({result})
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})


router.delete('/:productId',checkAuth,(req,res,next)=>{
    const id=req.params.productId;
    Product.remove({_id:id}).exec()
    .then((result)=>{
        res.status(200).json({
                result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})
module.exports = router;