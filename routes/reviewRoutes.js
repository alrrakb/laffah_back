const express = require("express");
const router = express.Router();
const {
  createReview,
  getProductReviews,
} = require("../controllers/reviewController");

router.route("/").post(createReview);

router.route("/product/:productId").get(getProductReviews);

module.exports = router;
