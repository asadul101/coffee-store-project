const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PROT || 5000

//midlewere
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.g9i8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient 
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

async function run() {
   try {
      await client.connect();

      const database = client.db("coffeeDB");
      const coffeeCollection = database.collection("coffee");

      app.get('/coffee', async (req, res) => {
         const result = await coffeeCollection.find().toArray()
         res.send(result)
      })
      app.get('/coffee/:id', async (req, res) => {
         const id = req.params.id;
         const qurey = { _id: new ObjectId(id) }
         const result =await coffeeCollection.findOne(qurey)
         res.send(result)
      })
      app.put('/coffee/:id',async(req,res)=>{
         const id=req.params.id;
         const filter={_id: new ObjectId(id)}
         const updateCoffee=req.body;
         const options = { upsert: true };
         const coffee={
            $set:{
               name:updateCoffee.name,
               quantity:updateCoffee.quantity,
               supplier:updateCoffee.supplier,
               taste:updateCoffee.taste,
               category:updateCoffee.category,
               details:updateCoffee.details,
               photo:updateCoffee.photo
            }
         }
         const result=await coffeeCollection.updateOne(filter,coffee,options)
         res.send(result)
      })
      app.post('/coffee', async (req, res) => {
         const newcoffee = req.body;
         console.log(newcoffee);
         const result = await coffeeCollection.insertOne(newcoffee)
         res.send(result)

      })
      app.delete('/coffee/:id', async (req, res) => {
         const id = req.params.id;
         const qurey = { _id: new ObjectId(id) }
         const result = await coffeeCollection.deleteOne(qurey)
         res.send(result)
      })
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      //  await client.close();
   }
}
run().catch(console.dir);


app.get('/', (req, res) => {
   res.send('Coffee make your market')
   console.log('slkdfjldjfld');
})
app.listen(port, () => {
   console.log(`My cofee Port ${port}`);
})