let Coupons = require('../../models/couponSchema');


const getCoupons = async(req, res) =>{

    try{
        const coupons = await Coupons.find({status: true});
        res.json(coupons);
    }
    catch(error){
        console.log(error);
        res.status(500).json('error occured')
    }
}


const checkApplyCode = async (req, res) => {
  try {
    let { code:couponId, total:totalPrice } = req.body

    // Validate the request
    if (!totalPrice || !couponId) {
      return res.status(400).json({ message: 'Total price and coupon ID are required.' });
    }

    // Find the coupon by ID
    const coupon = await Coupons.findOne({code:couponId});

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    // Check if the coupon is active
    if (!coupon.status) {
      return res.status(400).json({ message: 'Coupon is no longer active.' });
    }

    // Check if the coupon has expired
    const currentDate = new Date();
    if (currentDate < coupon.startDate || currentDate > coupon.endDate) {
      return res.status(400).json({ message: 'Coupon is expired or not yet active.' });
    }

    // Check if the total amount meets the minimum purchase requirement
    if (totalPrice < coupon.minimumOrderValue) {
      return res.status(400).json({
        message: `Minimum purchase amount for this coupon is ${coupon.minimumOrderValue}.`,
      });
    }

    // Calculate the discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (totalPrice * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed total price
    discountAmount = Math.min(discountAmount, totalPrice);

    // Calculate the final price after discount
    const finalPrice = totalPrice - discountAmount;

    res.status(200).json({
      message: 'Coupon applied successfully.',
      discountAmount,
      finalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Try again later.', error: error.message });
  }
};

module.exports = { checkApplyCode };





module.exports = {
    getCoupons,
    checkApplyCode
}