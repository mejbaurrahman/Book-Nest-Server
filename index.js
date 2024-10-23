const express = require("express");

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

    app.post("/users", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await users.insertOne(data);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const data = req.query.email;
      const query = { email: data };

      const result = await users.findOne(query);

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
