const Offer = require('../../models/offerSchema')
const Product = require('../../models/ProductSchema')
const Coupons = require('../../models/couponSchema');
const Category = require('../../models/CategorySchema')

// offer 
const addOffer = async (req, res) => {
  try {
      let data = { ...req.body };
      const discountDecimal = data.discountPercentage / 100;

      if (data.type === 'product') {
          // Handle single product offer
          await Product.findOneAndUpdate(
              { _id: data.applicableId },
              [
                  {
                      $set: {
                          currentPrice: {
                              $round: [
                                  {
                                      $subtract: [
                                          { $toDouble: "$regularPrice" },
                                          {
                                              $multiply: [
                                                  { $toDouble: "$regularPrice" },
                                                  discountDecimal
                                              ]
                                          }
                                      ]
                                  },
                                  0
                              ]
                          }
                      }
                  },
                  {
                      // Ensure currentPrice doesn't exceed regularPrice
                      $set: {
                          currentPrice: {
                              $min: ["$currentPrice", "$regularPrice"]
                          }
                      }
                  }
              ],
              { new: true }
          );
      } else if (data.type === 'category') {
          // Find the target category
          console.log(data.applicableId,'data.applicableId')
          const targetCategory = await Category.findById(data.applicableId);
          
          if (!targetCategory) {
              return res.status(404).json('Category not found');
          }

          let productsToUpdate = [];

          if (targetCategory.type === '0' && !targetCategory.parentCategory) {
              // If it's a parent category, get all child categories
              const childCategories = await Category.find({ 
                  parentCategory: targetCategory._id 
              });
              
              // Get products from both parent and child categories
              productsToUpdate = await Product.find({
                  category: {
                      $in: [targetCategory._id, ...childCategories.map(cat => cat.name)]
                  }
              });
          } else {
              // If it's a child category or regular category
              productsToUpdate = await Product.find({
                  category: targetCategory.name
              });
          }
          console.log(productsToUpdate.length,"length")
          // Update each product's price
          if (productsToUpdate.length > 0) {
            productsToUpdate.map(p =>console.log(p._id,"p id"))
              await Product.updateMany(
                  { _id: { $in: productsToUpdate.map(p => p._id) } },
                  [
                      {
                          $set: {
                              currentPrice: {
                                  $round: [
                                      {
                                          $subtract: [
                                              { $toDouble: "$regularPrice" },
                                              {
                                                  $multiply: [
                                                      { $toDouble: "$regularPrice" },
                                                      discountDecimal
                                                  ]
                                              }
                                          ]
                                      },
                                      0
                                  ]
                              }
                          }
                      },
                      {
                          // Ensure currentPrice doesn't exceed regularPrice
                          $set: {
                              currentPrice: {
                                  $min: ["$currentPrice", "$regularPrice"]
                              }
                          }
                      }
                  ]
              );
          }
      }

      // Save the offer with applicableType
      const newOffer = new Offer({
          title: data.title,
          description: data.description,
          type: data.type,
          applicableType: data.type,
          applicableId: data.applicableId,
          applicableName: data.applicableName,
          discountPercentage: data.discountPercentage,
          validFrom: data.validFrom,
          validUntil: data.validUntil,
          usageLimitPerUser: data.usageLimitPerUser
      });

      await newOffer.save();
      res.json('New offer was added successfully');

  } catch (error) {
      console.error('Error in addOffer:', error);
      res.status(500).json('Server error occurred while adding offer');
  }
};


const getOffer = async(req, res) =>{
    try{
        let allOffers = await Offer.find();
        res.json(allOffers)
    }
    catch(error){
        console.log(error);
        res.status(500).json('server error')
    }
}

const deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findOne({ _id: req.params.id });

        if (!offer) {
            return res.status(404).json('Offer not found');
        }

        const { applicableId, applicableType } = offer;

        if (applicableType === 'product') {
            const product = await Product.findOne({ _id: applicableId });

            if (!product) {
                return res.status(404).json('Product not found');
            }

            const regularPrice = parseFloat(product.regularPrice); // Ensure it's a number
            await Product.findOneAndUpdate(
                { _id: applicableId },
                { $set: { currentPrice: regularPrice.toFixed(2).toString() } } // Set currentPrice as string
            );
        } else if (applicableType === 'category') {
            const products = await Product.find({ category: applicableId });

            for (const product of products) {
                const regularPrice = parseFloat(product.regularPrice);
                await Product.findOneAndUpdate(
                    { _id: product._id },
                    { $set: { currentPrice: regularPrice.toFixed(2).toString() } }
                );
            }
        }

        await Offer.findOneAndDelete({ _id: req.params.id });
        res.json('Offer deleted and product prices reset');
    } catch (error) {
        console.error(error);
        res.status(500).json('Server error');
    }
};


const addCoupon = async (req, res) => {
    const {
      code,
      discountType,
      discountValue,
      minimumOrderValue,
      maximumOrderValue,
      startDate,
      endDate,
      usageLimit,
      status,
    } = req.body;
  
    try {
      // Check if the coupon code already exists
      const existingCoupon = await Coupons.findOne({ code });
      if (existingCoupon) {
        return res.status(400).json({ message: 'Coupon code already exists.' });
      }
  
      // Create a new coupon
      const newCoupon = new Coupons({
        code,
        discountType,
        discountValue,
        minimumOrderValue,
        maximumOrderValue,
        startDate,
        endDate,
        usageLimit,
        status,
      });
  
      // Save the coupon to the database
      await newCoupon.save();
  
      res.status(201).json({
        message: 'Coupon created successfully.',
        coupon: newCoupon,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.', error: error.message });
    }
}

const editCoupon = async (req, res) => {
    const { id } = req.params;
    const {
      code,
      discountType,
      discountValue,
      minimumOrderValue,
      usageLimit,
      status,
    } = req.body;
  
    try {
      // Validate request body if needed
      if (!code || !discountType || !discountValue) {
        return res.status(400).json({ message: 'Required fields are missing.' });
      }
  
      // Find and update the coupon
      const updatedCoupon = await Coupons.findByIdAndUpdate(
        {_id:id},
        {
          code,
          discountType,
          discountValue,
          minimumOrderValue,
          usageLimit,
          status,
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedCoupon) {

        return res.status(404).json({ message: 'Coupon not found.' });
      }
      console.log('working sir')
      res.status(200).json({
        message: 'Coupon updated successfully.',
        coupon: updatedCoupon,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.', error: error.message });
    }
}

const deleteCoupon = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find and delete the coupon
      const deletedCoupon = await Coupons.findByIdAndDelete(id);
  
      if (!deletedCoupon) {
        return res.status(404).json({ message: 'Coupon not found.' });
      }
  
      res.status(200).json({
        message: 'Coupon deleted successfully.',
        coupon: deletedCoupon, // Optionally return the deleted coupon
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

const listCoupon = async(req, res) =>{
    try{
        let coupons = await Coupons.find();
        res.json(coupons);

    }
    catch(error){
        console.log(error)
        res.status(500).json(error.message);
    }
}
  
module.exports = {
    addOffer,
    getOffer,
    deleteOffer,

    addCoupon,
    editCoupon,
    deleteCoupon,
    listCoupon
}