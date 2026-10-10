require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./product.model");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Product CRUD API is running!");
});

// create product

app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// get all products
app.get("/api/products", async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json({
      success: true,
      count: product.length,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// 3. UPDATE PRODUCT
app.put("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// 4. DELETE PRODUCT
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDb connected successfully");
    app.listen(PORT, () => {
      console.log(`server is running at ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDb connection failed", error.message);
  });
