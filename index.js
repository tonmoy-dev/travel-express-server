const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 7000;
// const port = 7000;

// middleware setUp 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.dn7ou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();
        // console.log('database is connected');
        const database = client.db('travelExpress');
        const bookingPlacesCollection = database.collection('bookingPlaces');

        // GET API
        app.get('/booking_places', async (req, res) => {
            const cursor = bookingPlacesCollection.find({});
            const bookingPlaces = await cursor.toArray();
            res.send(bookingPlaces);
        });

        // GET Single BOOKING API
        app.get('/booking_places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const bookingPlace = await bookingPlacesCollection.findOne(query);
            res.json(bookingPlace);
        })

        // POST API
        app.post('/booking_places', async (req, res) => {
            const bookingPlace = req.body;
            const result = await bookingPlacesCollection.insertOne(bookingPlace);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('TravelExpress server is running');
})

app.listen(port, () => {
    console.log('Running the server on', port, 'port');
})




