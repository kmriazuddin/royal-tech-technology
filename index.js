const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfroika.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const userCollection = client.db("userDB").collection("users");

        // Post Single Data Endpoint:
        app.post("/users", async(req, res) => {
            const user = req.body;
            console.log('user ok', user);
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.send(result);
        });

        // Find The User Data:
        app.get("/users", async(req, res) => {
            const result = await userCollection.find().toArray();
            console.log(result);
            res.send(result);
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send('Crud Is Running...');
});
app.listen(port, () => {
    console.log(`Server Is Running On Port ${port}`);
})
