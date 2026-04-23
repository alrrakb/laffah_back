const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://api.allffh.com";

// Helper function to delete file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      mainImage: req.files["mainImage"]
        ? `${BASE_URL}/uploads/${req.files["mainImage"][0].filename}`
        : null,

      images: req.files["images"]
        ? req.files["images"].map(
            (file) => `${BASE_URL}/uploads/${file.filename}`
          )
        : [],
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    if (req.files) {
      Object.values(req.files)
        .flat()
        .forEach((file) => {
          deleteFile(file.path);
        });
    }

    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = { ...req.body };

    if (req.files["mainImage"]) {
      if (product.mainImage) {
        deleteFile(
          path.join(__dirname, "..", product.mainImage.replace(BASE_URL, ""))
        );
      }
      updateData.mainImage = `${BASE_URL}/uploads/${req.files["mainImage"][0].filename}`;
    }

    let updatedImages = [...product.images];

    let deletedIndexes = req.body.deletedImageIndexes;
    if (typeof deletedIndexes === "string") {
      deletedIndexes = JSON.parse(deletedIndexes);
    }

    if (Array.isArray(deletedIndexes)) {
      deletedIndexes
        .sort((a, b) => b - a)
        .forEach((index) => {
          const imagePath = updatedImages[index];
          if (imagePath) {
            deleteFile(path.join(__dirname, "..", imagePath));
            updatedImages.splice(index, 1);
          }
        });
    }

    if (req.files["images"]) {
      const newImages = req.files["images"].map(
        (file) => `${BASE_URL}/uploads/${file.filename}`
      );
      updatedImages.push(...newImages);
    }

    updateData.images = updatedImages;

    Object.assign(product, updateData);
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    if (req.files) {
      Object.values(req.files)
        .flat()
        .forEach((file) => {
          deleteFile(file.path);
        });
    }
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete additional images
    product.images.forEach((imageUrl) => {
      const imagePath = imageUrl.replace(BASE_URL, "");
      deleteFile(path.join(__dirname, "..", imagePath));
    });

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
