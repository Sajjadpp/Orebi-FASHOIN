const Razorpay = require("razorpay");
const Orders = require('../../models/ordersSchema')
const Product = require('../../models/ProductSchema')
const Wallet = require('../../models/walletSchema')
const mongoose = require('mongoose')
const Cart = require('../../models/CartSchema')

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

const   razorpayToken = async(req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        const order = await instance.orders.create(options);
        res.status(200).json({ orderId: order.id, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        res.status(500).send("Error creating order");
    }
};


const getOrderId = () => {
    const timestamp = Date.now().toString(36).slice(-4); // Convert timestamp to base36 and take the last 4 characters
    const randomString = Math.random().toString(36).substring(2, 6); // Generate a random 4-character string
    return `ORD-${timestamp}-${randomString}`.toUpperCase(); // Combine and convert to uppercase
};

const getOrderFormData = (originalData) =>{
    console.log(originalData,"original data")
    return {
        _id: getOrderId(),
        userId: originalData.products[0].userId,
        items: originalData.products.map((product) => {
            return {
                productId: product.cartItems.productId,
                stocks: product.cartItems.stocks.map((stock) => (
                    
                  {
                    size: stock.size,
                    quantity: stock.quantity,
                  }
                
                )),
                price: product.productDetails.currentPrice,
                total:  product.cartItems.stocks.reduce((acc, stock) => acc+stock.quantity ,0) * product.productDetails.currentPrice,
                status: "Pending", // Default status
            }
        }).flat(),
        shippingCharge: originalData.shippingCharge,
        discountApplied: originalData.discountApplied,
        totalAmount: originalData.totalAmt,
        shippingAddress: originalData.selectedAddress,
        paymentMethod: originalData.selectedPayment, // Example payment method
        paymentStatus: "pending", // Default
        orderStatus: "pending", // Default
    }


    
      
}

const addOrder = async (req, res) => {
    let walletRefundNeeded = false;
    let deductedAmount = 0;

    try {
        let data = getOrderFormData(req.body);
        let order = new Orders(data);

        // Check if the payment method is "wallet"
        if (order.paymentMethod === "wallet") {
            let userId = new mongoose.Types.ObjectId(order.userId);

            // Fetch the user's wallet
            const wallet = await Wallet.findOne({ user: userId });

            if (!wallet) {
                return res.status(404).json({ message: "Wallet not found" });
            }

            // Check if the wallet balance is sufficient
            if (wallet.balance >= order.totalAmount) {
                // Deduct the wallet balance
                deductedAmount = order.totalAmount;
                wallet.balance -= deductedAmount;

                // Log the transaction
                wallet.transactions.unshift({
                    transactionId: new mongoose.Types.ObjectId().toString(),
                    type: "debit",
                    amount: deductedAmount,
                    description: `Order payment for order ID: ${order._id}`,
                });

                await wallet.save();
                walletRefundNeeded = true; // Mark refund needed in case of failure

                // Update the order's payment status to "success"
                order.paymentStatus = "success";
            } else {
                return res.status(400).json({
                    message: "Insufficient wallet balance. Please use another payment method.",
                });
            }
        }

        // Save the order
        await order.save();

        // Clear the user's cart
        let userId = new mongoose.Types.ObjectId(order.userId);
        await Cart.findOneAndUpdate({ userId }, { $set: { cartItems: [] } });

        // Respond with the order
        res.json(order);
    } catch (error) {
        console.log(error);

        // Rollback wallet deduction if it was made
        if (walletRefundNeeded && deductedAmount > 0) {
            try {
                let userId = new mongoose.Types.ObjectId(req.body.userId);
                const wallet = await Wallet.findOne({ user: userId });

                if (wallet) {
                    wallet.balance += deductedAmount; // Refund the deducted amount
                    wallet.transactions.push({
                        transactionId: new mongoose.Types.ObjectId().toString(),
                        type: "credit",
                        amount: deductedAmount,
                        description: `Refund for failed order payment`,
                    });

                    await wallet.save();
                }
            } catch (refundError) {
                console.error("Wallet refund failed:", refundError);
            }
        }

        res.status(500).json({ message: "Something went wrong while placing the order" });
    }
};

  

const editOrder = async(req, res) =>{
    try{
        await Orders.findByIdAndUpdate(req.body._id, {$set: {paymentStatus: req.body.paymentStatus}})
        res.json('working')
    }
    catch(error){
        console.log(error);
        res.status(500).json('try again later');
    }
}

const cancelOrder = async (req, res) => {
    let { userId, productId, orderId, portion } = req.query;
    console.log(productId, userId, "user id and product id");
    console.log(req.query);
  
    try {
      const orders = await Orders.findById(orderId);
      if (!orders) throw new Error("Order not found");
  
      if (!userId) userId = orders.userId;
  
      let wallet = await Wallet.findOne({ user: userId });
  
      if (!wallet) {
        wallet = new Wallet({
          user: userId,
          balance: 0,
        });
      }
  
      let refundAmount = 0;
  
      // Cancel Full Order
      if (portion === "FULL") {
        orders.items.forEach(async (item) => {
          if (item.status !== "Cancelled") {
            refundAmount += item.total;
            item.status = "Cancelled";
  
            // Restock the product quantities
            let { productId, stocks } = item;
            productId = new mongoose.Types.ObjectId(productId);
  
            for (const stockItem of stocks) {
              const { size, quantity } = stockItem;
              await Product.findOneAndUpdate(
                { _id: productId, "stock.size": size },
                { $inc: { "stock.$.quantity": quantity } } // Restock the quantity
              );
            }
          }
        });
  
        orders.orderStatus = "Cancelled";
        orders.paymentStatus = "failed";
  
        if (orders.paymentMethod === "wallet" || orders.paymentMethod === "razorpay") {
          wallet.balance += refundAmount;
          let transaction = {
            transactionId: new mongoose.Types.ObjectId(),
            type: "credit",
            amount: refundAmount,
            description: `Amount credited for order ${orderId}`,
            date: Date.now(),
          };
          wallet.transactions.unshift(transaction);
          await wallet.save();
        }
        await orders.save();
        return res.json({ message: "Order cancelled successfully", refundAmount });
      }
  
      // Cancel Partial Order
      const cancelProduct = orders.items.find((item) =>
        item.productId.equals(productId)
      );
      console.log(cancelProduct);
      if (!cancelProduct || cancelProduct.status === "Cancelled") {
        throw new Error("Product not found or already cancelled");
      }
  
      cancelProduct.status = "Cancelled";
      refundAmount = cancelProduct.total;
  
      orders.totalAmount = orders.items.reduce((sum, item) => {
        return sum + (item.status === "Cancelled" ? 0 : item.total);
      }, 0);
  
      if (orders.items.every((item) => item.status === "Cancelled")) {
        orders.orderStatus = "Cancelled";
        orders.paymentStatus = "failed";
      }
  
      // Restock the canceled product
      let { stocks } = cancelProduct;
      productId = new mongoose.Types.ObjectId(productId);
  
      for (const stockItem of stocks) {
        const { size, quantity } = stockItem;
        await Product.findOneAndUpdate(
          { _id: productId, "stock.size": size },
          { $inc: { "stock.$.quantity": quantity } } // Restock the quantity
        );
      }
  
      if (orders.paymentMethod === "wallet" || orders.paymentMethod === "razorpay") {
        wallet.balance += refundAmount;
        let transaction = {
          transactionId: new mongoose.Types.ObjectId(),
          type: "credit",
          amount: refundAmount,
          description: `Amount credited for order ${orderId}`,
          date: Date.now(),
        };
        wallet.transactions.unshift(transaction);
        await wallet.save();
      }
      await orders.save();
  
      res.json("Product cancelled successfully");
    } catch (error) {
      console.error("Error during cancellation:", error);
      res.status(500).json("Something went wrong");
    }
  };
  
  

const getWallet = async (req, res) =>{
    try{
        let {userId} = req.params
        const userWallet = await Wallet.findOne({user: userId})
        console.log(userWallet,"userWallet")
        res.json(userWallet)
    }
    catch(error){
        console.log(error);
        res.status(500).json(error.message)
    }
}

module.exports ={
    razorpayToken,
    addOrder,
    editOrder,
    cancelOrder,
    getWallet
}