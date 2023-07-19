require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://technetuser:Tm5DUcZ864QPe1xO@cluster0.7apvnd5.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const db = client.db('tech-simple');
    const userCollection = db.collection('users');
    const blogCollection = db.collection('blogs');

    const productCollection = db.collection('product');

    // api to save a new user
    app.post("/save_users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // api to show all users
    app.get("/show_users", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });


    // api to add a user as admin
    app.put("/makeAdminUser/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });


    // api to save a new blog
    app.post("/save_blogs", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });

    // api to show all blogs
    app.get("/show_blogs", async (req, res) => {
      const query = {};
      const cursor = blogCollection.find(query);
      const blogs = await cursor.toArray();
      res.send(blogs);
    });


    // api to approve a blog
    app.put("/makeApproveBlog/:id", async (req, res) => {
      const blogId = req.params.id;
      const filter = { _id: ObjectId(blogId) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          status: "approve",
        },
      };
      const result = await blogCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });


    // show a blog by its id
    app.get('/blogDetails/:id', async (req, res) => {
      const id = req.params.id;

      const result = await blogCollection.findOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.delete('/deleteBlog/:id', async (req, res) => {
      const id = req.params.id;

      const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });










    app.get('/products', async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post('/product', async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.findOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.post('/comment/:id', async (req, res) => {
      const productId = req.params.id;
      const comment = req.body.comment;

      console.log(productId);
      console.log(comment);

      const result = await productCollection.updateOne(
        { _id: ObjectId(productId) },
        { $push: { comments: comment } }
      );

      console.log(result);

      if (result.modifiedCount !== 1) {
        console.error('Product not found or comment not added');
        res.json({ error: 'Product not found or comment not added' });
        return;
      }

      console.log('Comment added successfully');
      res.json({ message: 'Comment added successfully' });
    });








  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Techsimple Blog Server is Running.....');
});

app.listen(port, () => {
  console.log(`Techsimple server app listening on port ${port}`);
});

