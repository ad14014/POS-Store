const InventorySchema=require('../Models/AllInventory.js')
const Product=require('../Models/Allproduct.js')
const AllVariant=require('../Models/AllProductVarient.js')
exports.GetAllInventoryItems=async(req,res)=>{
    try {
        const InventoryItems=await InventorySchema.find().populate('product','productName').populate('productVariant','variant_name')
        res.status(200).json({Data:InventoryItems})
    } catch (error) {
         res.status(500).json({error:error.message})
    }
}
// Example Express route
 exports.CheckInventory=async (req, res) => {
  try {
    const { productId, variantId} = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.json({ success: false, message: "Product not found" });

    const variant = await AllVariant.findById(variantId);
    if (!variant) return res.json({ success: false, message: "Variant not found" });

   else {
      return res.json({ success: false, message:"Eorror" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, err:err.message });
  }
};
exports.UpdateInventory= async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.json({ success: false, message: "Product not found" });

    const variant = product.variants.id(variantId);
    if (!variant) return res.json({ success: false, message: "Variant not found" });

    if (variant.stock < quantity) {
      return res.json({ success: false, message: "Not enough stock" });
    }

    variant.stock -= quantity;
    await product.save();

    res.json({ success: true, message: "Stock updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}