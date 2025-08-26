
const AllproducttSchema=require('../Models/Allproduct.js')
const Allcategory=require('../Models/Allcategory.js')
const AllInventery=require('../Models/AllInventory.js')

const AllvarientSchema=require('../Models/AllProductVarient.js')

exports.GetAllproduct = async (req, res) => {
  try {
   
    const Allproduct = await AllproducttSchema.find()
      .populate("category","name");
     
      

   
    const allVariants = await AllvarientSchema.find();

    
    const formattedProducts = Allproduct.map(product => {
      const productVariants = allVariants.filter(
        variant => variant.product_id.toString() === product._id.toString()
      );

      return {
        _id: product._id,
        productName: product.productName,
        sku: product.sku,
        description: product.description,
        category:product.category.name,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        price: product.price || 0,
        variants: productVariants.map(v => ({
          _id: v._id,
          variant_name: v.variant_name,
          variant_value: v.variant_value,
          sku: v.sku,
          price: v.price
        }))
      };
    });

    res.status(200).json({
      message: 'All Product',
      Data: formattedProducts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 exports.DeleteProducts=async(req,res)=>{
    try {
        const id=req.params.id;
        const DeleteProducts=await AllproducttSchema.findByIdAndDelete(id)
        res.status(200).json({Data:DeleteProducts})
    } catch (error) {
         res.status(500).json({error:error.message})
    }
 }
 exports.UpdateProduct=async(req,res)=>{
    try {
         const id=req.params.id;
         const UpdateData=req.body;
        const UpdateProduct=await AllproducttSchema.findByIdAndUpdate(id,UpdateData)
        res.status(200).json({Data:UpdateProduct})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
 }
 exports.SingleProduct=async(req,res)=>{
    try {
        const id=req.params.id;
        const SingleProduct=await AllproducttSchema.findById(id)
        res.status(200).json({message:SingleProduct})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
 }

exports.CreateProduct = async (req, res) => {
  try {
    const {
      productName,
      sku,
      description,
      categoryId,
      variant_name,
variant_value,
price,
refundable,
 quantity,
 location,
    } = req.body;

   
    const category = await Allcategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: `Category with ID '${categoryId}' not found` });
    }

    const NewProduct = await AllproducttSchema.create({
      productName,
      sku,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      categoryId 
    });
    const NewVarient=await AllvarientSchema.create({
      product_id:NewProduct._id,
       variant_name,
variant_value,
price,
sku,
refundable
    })
    await AllInventery.create({
       quantity,
 location,
 product:NewProduct._id,
 productVariant:NewVarient._id,
 lastUpdated:Date.now()
 
    })
    res.status(201).json({
      message: "Product created successfully",
      NewProduct,
      NewVarient
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
