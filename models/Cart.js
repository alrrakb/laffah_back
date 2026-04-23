const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total price before saving
cartSchema.pre("save", async function (next) {
  let total = 0;
  for (const item of this.items) {
    const product = await mongoose.model("Product").findById(item.product);
    if (product) {
      const price = product.offer
        ? product.price * (1 - product.offer / 100)
        : product.price;
      total += price * item.quantity;
    }
  }
  this.totalPrice = total;
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
