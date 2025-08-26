const AllVarientSchema=require('../Models/AllProductVarient.js')

exports.getAllVarient = async (req, res) => {
    try {
        const allVarient = await AllVarientSchema.find()
        res.status(200).json({
            message: "success",
            data: allVarient
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}