import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Subscription tracker API!");
});

app.listen(3000, () => {
  console.log("Subscription tracker API is running on http://localhost:3000");
});
