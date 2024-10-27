const express = require("express");
const { ObjectId } = require("mongodb");

const app = express();

const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();

const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvker.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("book-nest");
    const users = database.collection("users");
    const categories = database.collection("categories");
    const products = database.collection("products");
    const carts = database.collection("carts");
    //category part
    app.post("/categories", async (req, res) => {
      const { category } = req.body;
      try {
        const newCategory = await categories.insertOne({ category: category });
        res.status(201).json({
          message: "Category added successfully",
          category: newCategory,
        });
      } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ message: "Error adding category", error });
      }
    });

    app.get("/categories", async (req, res) => {
      const result = await categories.find({}).toArray();
      res.json(result);
    });
    // products
    app.post("/products", async (req, res) => {
      const data = req.body;

      const result = await products.insertOne(data);
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const result = await products.find({}).toArray();
      res.json(result);
    });
    app.delete("/products/:id", async (req, res) => {
      const { id } = req.params;
      const result = await products.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    });
    app.get("/products/:_id", async (req, res) => {
      // Convert id to ObjectId if you’re using MongoDB’s _id
      const id = req.params._id;

      const result = await products.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.patch("/products/:_id", async (req, res) => {
      const { _id } = req.params;
      const updates = req.body;

      const result = await products.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updates }
      );

      res.json(result);
    });
    // user part
    app.post("/users", async (req, res) => {
      const data = req.body;

      const result = await users.insertOne(data);
      res.send(result);
    });
    app.get("/allUsers", async (req, res) => {
      const result = await users.find({}).toArray();
      res.json(result);
    });
    app.get("/users", async (req, res) => {
      const data = req.query.email;
      const query = { email: data };

      const result = await users.findOne(query);

      res.json(result);
    });
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const result = await users.findOne({ _id: new ObjectId(id) });
      res.json(result);
    });
    app.patch("/users/:email", async (req, res) => {
      const { email } = req.params;
      const updates = req.body;
      console.log(updates);
      const result = await users.updateOne({ email: email }, { $set: updates });

      res.json(result);
    });
    app.patch("/user/:_id", async (req, res) => {
      const { _id } = req.params;
      const updates = req.body;
      console.log(updates);
      const result = await users.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updates }
      );

      res.json(result);
    });
    app.post("/carts", async (req, res) => {
      const data = req.body;

      const result = await carts.insertOne(data);
      res.send(result);
    });
    app.get("/carts/:email", async (req, res) => {
      // Convert id to ObjectId if you’re using MongoDB’s _id
      const email = req.params.email;

      const result = await carts
        .find({
          email: email,
        })
        .toArray();
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Book Nest");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
