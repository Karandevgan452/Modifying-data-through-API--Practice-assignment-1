require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { resolve } = require("path");

const app = express();
const port = 3010;

// miidleware functions
app.use(express.static("static"));
app.use(express.json());

//MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection error:", err));

//MenuItem Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
});

const menuItem = mongoose.model("MenuItem", menuItemSchema);

//Routes
//Post request
app.post("/menu", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || price == null)
      return res.status(400).json({ error: "Name and price are required" });

    const newItem = new menuItem({ name, description, price });
    await newItem.save();
    res
      .status(201)
      .json({ message: "Menu item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ error: "Error adding menu item" });
  }
});

// Get Request
app.get("/menu", async (req, res) => {
  try {
    const menuItems = await menuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Error fetching menu items" });
    // res.sendFile(resolve(__dirname, 'pages/index.html'));
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
