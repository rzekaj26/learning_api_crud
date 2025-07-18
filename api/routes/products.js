const express = require("express");
const router = express.Router();
const products = require("../../data/productsData");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Products Listed",
    products: products,
  });
});

router.get("/:id", (req, res, next) => {
  const productId = req.params.id;
  const product = products.find(
    (product) => product.id.toString() === productId
  );
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }
  res.status(200).json({
    message: "Product details",
    product: product,
  });
});

router.post("/", (req, res, next) => {
  const newProduct = req.body;
  if (
    typeof newProduct.id !== "number" ||
    typeof newProduct.name !== "string" ||
    typeof newProduct.price !== "number"
  ) {
    return res.status(404).json({
      message: "Wrong data structure, not accepted",
    });
  }

  let existingId = products.find((product) => product.id === newProduct.id);
  if (existingId) {
    return res.status(404).json({
      message:
        "A product already exists with this ID, please select a different one",
    });
  }

  const newProductData = {
    id: newProduct.id,
    name: newProduct.name,
    price: newProduct.price,
  };
  products.push(newProductData);
  res.status(201).json({
    message: "New product created",
    newProductData,
  });
});

router.put("/:id", (req, res) => {
  const productId = req.params.id;
  const product = products.find(
    (product) => product.id.toString() === productId
  );
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }
  const updatedProduct = req.body;

  if (
    typeof updatedProduct.id !== "number" ||
    typeof updatedProduct.name !== "string" ||
    typeof updatedProduct.price !== "number"
  ) {
    return res.status(404).json({
      message: "invalid order format, please try again",
    });
  }
  const newUpdatedProduct = {
    name: updatedProduct.name,
    price: updatedProduct.price,
  };
  Object.assign(product, newUpdatedProduct);

  res.status(200).json({
    message: "Product details updated",
    product,
  });
});

router.delete("/", (req, res) => {
  return res.status(400).json({
    message: "Please select a product ID to delete",
  });
});

router.delete("/:id", (req, res, next) => {
  const productId = req.params.id;
  const product = products.find(
    (product) => product.id.toString() === productId
  );
  if (!product) {
    return res.status(404).json({
      message: "Product is not found",
    });
  }

  products = products.filter((product) => product.id.toString() !== productId);
  return res.status(200).json({
    message: "Product deleted",
  });
});

module.exports = router;
