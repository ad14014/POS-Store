const express=require('express')
const route=express.Router()
const AllVarientcontroller=require('../Controllers/AllvarientContoller.js')
const Auth=require('../Middlewares/AuthMiddleware.js')
route.get('/getAll',Auth,AllVarientcontroller.getAllVarient)
module.exports=route