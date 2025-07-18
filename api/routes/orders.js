const express = require("express");
const router = express.Router();
const orders = require("../../data/ordersData");
const products = require("../../data/productsData");

router.get("/", (req, res, next) => {
  let filteredOrders = orders;

  const queryParams = req.query;
  console.log(queryParams);
  if (queryParams["filterBy"] && queryParams["filterBy"] == "name") {
    const filterByProductName = queryParams["productName"];
    console.log(filterByProductName);
    filteredOrders = orders.filter((order) =>
      order.name.includes(filterByProductName)
    );
  }

  res.status(200).json({
    message: "Orders were fetched",
    orders,
    filteredOrders,
  });
});

router.post("/", (req, res, next) => {
  const newOrder = req.body;
  console.log({ newOrder });
  if (typeof newOrder.id !== "number" || !Array.isArray(newOrder.products)) {
    return res.status(404).json({
      message: "invalid order format, please try again",
    });
  }

  let existingOrderId = orders.find((order) => order.id === newOrder.id);
  if (existingOrderId) {
    return res.status(404).json({
      message:
        "An order already exists with this ID, please select a different one",
    });
  }

  const validProductIds = products.map((product) => product.id);

  const allProductsValid = newOrder.products.every((productId) =>
    validProductIds.includes(productId)
  );
  if (!allProductsValid) {
    return res.status(404).json({
      message: "not a valid product ",
    });
  }

  let total_price = 0;
  for (const productId of newOrder.products) {
    const product = products.find((product) => product.id === productId);
    total_price += product.price;
  }

  const newOrderData = {
    id: newOrder.id,
    products: newOrder.products,
    total_price,
    status: "pending",
  };
  orders.push(newOrderData);
  res.status(201).json({
    message: "new order created",
    newOrderData,
  });
});

router.get("/:orderId", (req, res, next) => {
  const order = orders.find(
    (order) => order.id === parseInt(req.params.orderId)
  );
  if (!order) {
    res.status(404).json({
      message: "Order not found",
    });
  }
  res.status(200).json({
    message: "Order details",
    orderId: req.params.orderId,
    order: order,
  });
});

router.put("/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;
  const order = orders.find((order) => order.id.toString() === orderId);
  if (!order) {
    res.status(404).json({
      message: "Order not found!",
    });
  }
  const updatedOrder = req.body;

  if (
    typeof updatedOrder.id !== "number" ||
    typeof updatedOrder.name !== "string" ||
    typeof updatedOrder.price !== "number"
  ) {
    return res.status(404).json({
      message: "invalid order format, please try again",
    });
  }
  const newUpdatedOrder = {
    id: updatedOrder.id,
    name: updatedOrder.name,
    price: updatedOrder.price,
  };
  Object.assign(order, newUpdatedOrder);

  res.status(200).json({
    message: "Order updated",
    order,
  });
});

router.delete("/", (req, res) => {
  return res.status(400).json({
    message: "Please select an order ID to delete",
  });
});

router.delete("/:id", (req, res) => {
  const orderId = req.params.id;
  const order = orders.find((order) => order.id.toString() === orderId);

  if (!order) {
    console.log(orderId);
    return res.status(404).json({
      message: "Order doesnt exist",
    });
  }
  orders = orders.filter((order) => order.id.toString() !== orderId);
  return res.status(200).json({
    message: "Order DELETED",
  });
});

module.exports = router;
