const mongoose = require("mongoose");
const Product = require("../models/Product");

// Replace with your actual MongoDB URI
const MONGODB_URI =
  "mongodb+srv://root:root@root.imksxck.mongodb.net/hanastore?retryWrites=true&w=majority&appName=root";

const products = [
  {
    name: "Wireless Headphones",
    price: 99.99,
    description: "High-quality wireless headphones with noise cancellation.",
    rate: 4.5,
    stock: 50,
    offer: 10,
    mainImage: "https://example.com/headphones-main.jpg",
    images: [
      "https://example.com/headphones1.jpg",
      "https://example.com/headphones2.jpg",
    ],
  },
  {
    name: "Smart Watch",
    price: 149.99,
    description: "Smart watch with heart rate monitor and GPS tracking.",
    rate: 4.2,
    stock: 30,
    offer: 15,
    mainImage: "https://example.com/smartwatch-main.jpg",
    images: [
      "https://example.com/smartwatch1.jpg",
      "https://example.com/smartwatch2.jpg",
    ],
  },
  {
    name: "Gaming Mouse",
    price: 39.99,
    description: "Ergonomic gaming mouse with customizable RGB lighting.",
    stock: 100,
    mainImage: "https://example.com/mouse-main.jpg",
    images: [
      "https://example.com/mouse1.jpg",
      "https://example.com/mouse2.jpg",
    ],
  },
];

async function addProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Product.insertMany(products);
    console.log("Products added successfully");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error adding products:", error);
    mongoose.disconnect();
  }
}

addProducts();
