const express=require('express')
const route=express.Router()
const Auth=require('../Middlewares/AuthMiddleware.js')
const DiscountContorller=require('../Controllers/DiscountController.js')
route.post('/create',Auth,DiscountContorller.PostDiscount)
route.get('/getAll',Auth,DiscountContorller.GetDiscount)
module.exports=route