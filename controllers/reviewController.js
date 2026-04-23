const Review = require("../models/Review");
const Product = require("../models/Product");

// @desc    Create new review
// @route   POST /api/reviews
// @access  Public
exports.createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    console.log(req.body);
    // Update product rating
    const product = await Product.findById(req.body.product);
    if (product) {
      const reviews = await Review.find({ product: req.body.product });
      const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
      product.rate = totalRating / reviews.length;
      await product.save();
    }

    res.status(201).json(review);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
