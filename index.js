const { getAllCustomers } = require("./customer.controller.js");

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  return res.send("App is running!");
});

app.get("/customers", getAllCustomers);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
