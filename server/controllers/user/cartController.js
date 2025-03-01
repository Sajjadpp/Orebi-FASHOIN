const { default: mongoose } = require("mongoose");
const Cart = require("../../models/CartSchema")
const Product = require('../../models/ProductSchema')
const WishList = require('../../models/WishListSchema')

// service
function totalAmount(cart){
    let totalamt = 0
    for(let i = 0; i < cart.length; i++){
        let stock = cart[i].cartItems.stocks
        let subTotal = 0
        for(let j = 0; j < stock.length; j++){

            subTotal += stock[j].quantity * cart[i].productDetails.currentPrice
        }   
        totalamt += subTotal
        cart[i].subTotal = subTotal
    }
    return {cart, totalAmount: totalamt}
}

const addToCart = async(req, res) =>{

    try{
        let {productId, userId, quantity, selectedSize} = req.body

        productId = new mongoose.Types.ObjectId(productId)
        userId = new mongoose.Types.ObjectId(userId)

        let userCartExist = await Cart.findOne({userId})
        if(userCartExist){

            let productExist = userCartExist.cartItems.find(item => String(item.productId) === String(productId))
            if(productExist){
                // product exist in cart
                let sizeExist = productExist.stocks.filter(stock => stock.size == selectedSize)[0]
                if(sizeExist){
                    // return when same size exist
                    return res.status(500).json('size is already exist');
                }
                
                productExist.stocks.push({
                    size: selectedSize,
                    quantity: quantity,
                })
                // product added successfully

            }
            else{
                userCartExist.cartItems.push({
                    productId,
                    stocks:[{
                        size: selectedSize,
                        quantity: quantity
                    }]
                    
                })

            }
            await userCartExist.save()
            res.json('product added to cart ')
        }
        else{
            // if no user exist in cart
            let userCart = await new Cart({
                userId,
                cartItems:[{
                    productId,
                    stocks:[{
                        size: selectedSize,
                        quantity: quantity,
                    }]
                }]
            })
            await userCart.save()
            res.json('product added to cart')
        }
    }   
    catch(error){
        console.log(error);
        res.status(500).json("server error");
    }
}

const cartCount = async(req, res) =>{

    let {userId} = req.query
    console.log(userId)
    try{

        let cartItems = await Cart.findOne({userId: new mongoose.Types.ObjectId(userId)},{cartItems: 1});
        
        console.log(cartItems.cartItems.length)
        res.json(cartItems.cartItems.length)
    }
    catch(error){
        console.log(error);
        res.status(500).json(error.message || 'server error')
    }
}

const listCart = async(req, res) =>{
    let {userId} = req.query
    userId = new mongoose.Types.ObjectId(userId)
    console.log(userId)
    try{
        let cart = await Cart.aggregate([
            {$match: {userId: userId}},
            {$unwind: "$cartItems"},
            {$lookup: {
              from: 'products',
              localField: 'cartItems.productId',
              foreignField: '_id',
              as: "productDetails"
            }},
            {$unwind:"$productDetails"},
            
          ])
        let newCart = totalAmount(cart)
        res.json({products: newCart.cart, totalAmt: newCart.totalAmount})
    }
    catch(error){
        console.log(error)
        res.status(500).json('try again later')
    }
}

const updateCount = async(req, res) =>{
    console.log("working")
    try{
        let {productId, userId, updateVal, size, quantity:currentQnty} = req.query;
        userId = new mongoose.Types.ObjectId(userId)
        productId = new mongoose.Types.ObjectId(productId)
        console.log(productId)
        let stockExist = await Product.findOne({_id: productId})
        if(!stockExist) return res.status(500).json("product cant find")
            console.log(stockExist)
        stockExist = stockExist.stock.find(item => item.size == size)
        console.log(stockExist.quantity, currentQnty)
        console.log(stockExist.quantity < Number(currentQnty))
        
        if(stockExist.quantity <= Number(currentQnty) && updateVal == 1) return res.status(500).json(`only ${stockExist.quantiy} left on that size`)

        const updated = await Cart.findOne({userId})
        
        let filterProducts = updated.cartItems.find(product => String(product.productId) === String(productId));
        filterProducts = filterProducts.stocks.find(stock => stock.size == size)
        filterProducts.quantity += Number(updateVal);

        updated.save()
        res.json('quantity added')
    }
    catch(error){
        console.log(error)
        res.status(500).json('try again later')
    }
}

const deleteCartProducts = async(req, res) =>{
    let {userId, productId, size, pace} = req.query;
    userId = new mongoose.Types.ObjectId(userId)
    productId = new mongoose.Types.ObjectId(productId)

    try{
        let cart = await Cart.findOne({userId});
        
        if(pace !== "FULL"){
            console.log('half')
            let product = cart.cartItems.find(item =>String(item._id) === String(productId));
            if(product.stocks.length != 1){

                let stocks = product?.stocks.filter(stock => stock.size !== size)
                product.stocks = stocks
                console.log('product aviailable' ,product.stocks, size)
                cart.save();
                return res.json('product removed by size')
            }
            
        }
        console.log('working')
        let product =  cart.cartItems.filter(item =>String(item._id) !== String(productId));
        console.log(product,"new balance")
        cart.cartItems = product;    
        cart.save()
        return res.json('product removed from cart')
        
    }
    catch(error){
        console.log(error)
        res.status(500).json('error ')
    }
}

// wishlist things

const listWishlist = async(req, res) =>{

    try{
        const userId = new mongoose.Types.ObjectId(req.query.userId)
        const wishList = await WishList.findOne({userId}).populate('products');
        res.json(wishList)
    }
    catch(error){
        console.log(error);
        res.status(500).json('server is busy')
    }
}

const addWishList = async(req, res) =>{

    try{    
        const userId = req.body.userId;
        const productId = req.body.productId
        
        if(!userId || !productId) return res.json('product id cant find')
        
        let wishList = await WishList.findOne({userId});

        if(wishList){
            if(wishList.products.some(item => String(item) == String(productId))){
                wishList.products = wishList.products.filter(product => String(productId) != String(product));
                console.log(wishList,"wihslisst")
                wishList.save();
                return res.json('the product remove from wish list')  // product is already there
            }
            wishList.products.push(productId);
            wishList.save()
            return res.json("wishList added")
        }

        let newWishList = new WishList({
            userId: userId,
            products:[productId]
        })

        newWishList.save()
        return res.json('wishList added')

    }   
    catch(error){
        console.log(error)
        res.status(500).json('server not responding')
    }
}

const removeWishList = async (req, res) => {
    try {
        const productId = new mongoose.Types.ObjectId(req.query.productId);
        const userId = new mongoose.Types.ObjectId(req.query.userId);
        
        // Find the user's wishlist document
        const wishList = await WishList.findOne({ userId });

        if (!wishList) {
            return res.status(404).json('Wishlist not found' );
        }

        // Filter out the product to be removed
        wishList.products = wishList.products.filter(
            product => String(product) !== String(productId)
        );

        // If the products array is now empty, delete the wishlist
        if (!wishList.products.length) {
            await WishList.deleteOne({ userId });
            return res.json( 'Product removed and wishlist deleted' );
        }

        // Otherwise, save the updated wishlist
        await wishList.save();
        res.json( 'Product removed from wishlist' );
    } catch (error) {
        console.error(error);
        res.status(500).json('Server not responding');
    }
};


module.exports = {
    addToCart,
    cartCount,
    listCart,
    updateCount,
    deleteCartProducts,

    //wishList
    listWishlist,
    addWishList,
    removeWishList
}