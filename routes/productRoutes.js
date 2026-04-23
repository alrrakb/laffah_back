const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Handle multiple fields: mainImage for single file and images for multiple files
const uploadFields = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 100 }, // Allow up to 5 additional images
]);

router
  .route("/")
  .get(getProducts)
  .post(protect, admin, uploadFields, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, admin, uploadFields, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
