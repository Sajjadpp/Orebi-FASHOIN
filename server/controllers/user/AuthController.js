const Product = require('../../models/ProductSchema');
const createEmail = require('../../services/nodemailer');
const { generateOtp } = require('./userController');
const checkStock = (orderProducts, allProducts) => {
    return orderProducts.map((orderedProduct) => {

      const productDetails = allProducts.find(
        (product) => String(product._id) === orderedProduct.productId
      );
  
      if (!productDetails) {
        return {
          productId: orderedProduct.productId,
          outOfStock: true,
          message: 'Product not found.',
        };
      }
  
      const outOfStockSizes = orderedProduct.stocks.filter((orderedStock) => {
        const productStock = productDetails.stock.find(
          (stock) => stock.size === orderedStock.size
        );
        return !productStock || productStock.quantity < orderedStock.quantity;
      });
  
      return {
        productId: orderedProduct.productId,
        outOfStock: outOfStockSizes.length > 0 ,
        outOfStockSizes,
      };
    });
  };
  


const checkProductAvailability = async(req, res) =>{

    try{
        let orderedProduct = req.query;
        let allProducts = await Product.find();
        console.log(orderedProduct)
        let isStock = checkStock(orderedProduct.products, allProducts);
        
        if(isStock.every(item => !item.outOfStock)){
            console.log('working')
            res.json(false)
        }
        else{
            
            res.json(isStock.filter(item => item.outOfStock)[0].outOfStockSizes)
        }
        


    }
    catch(error){
        console.log(error)
        res.status(500).json(error.message)
    }


}

const forgetPasswordOtp = async(req, res) =>{

  try{
    let otp = generateOtp()
    let createemail = await createEmail(req.body.email, otp, true);
    req.session.otp = otp
    res.json(otp)
  }
  catch(error){
    console.log(error)
    res.status(500).json(error)
  }
}

module.exports = {
    checkProductAvailability,
    forgetPasswordOtp

}