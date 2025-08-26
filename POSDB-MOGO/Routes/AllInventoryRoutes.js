const express=require('express')
const route=express.Router()
const InventoryController=require('../Controllers/AllInventoryController.js')
const Auth=require('../Middlewares/AuthMiddleware.js')
route.get('/GetAll',Auth,InventoryController.GetAllInventoryItems)
route.post("/inventory/check",Auth,InventoryController.CheckInventory)
route.post("/inventory/Update",Auth,InventoryController.UpdateInventory)
module.exports=route