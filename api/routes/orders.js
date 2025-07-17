const express = require("express");
const router = express.Router();

let orders = [
  { id: 1, name: "Test 1", price: 250.5 },
  { id: 2, name: "Test 2", price: 124.3 },
  { id: 3, name: "Test 3", price: 342.3 },
  { id: 4, name: "Test 4", price: 8933 },
];

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
  // console.log(req.query);
  res.status(200).json({
    message: "Orders were fetched",
    orders,
    filteredOrders,
  });
});

router.post("/", (req, res, next) => {
  const newOrder = req.body;
  console.log({ newOrder });
  if (
    typeof newOrder.id !== "number" ||
    typeof newOrder.name !== "string" ||
    typeof newOrder.price !== "number"
  ) {
    return res.status(404).json({
      message: "invalid order format, please try again",
    });
  }
  const newOrderData = {
    id: newOrder.id,
    name: newOrder.name,
    price: newOrder.price,
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
