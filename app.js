const express = require("express");
const app = express();
app.use((req, res, next) => {
  req.body = req.body || {};
  next();
});
app.use(express.json());

const productRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);

module.exports = app;
