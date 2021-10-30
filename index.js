const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
// const port = process.env.PORT || 6000;
const port = 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.dn7ou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();
        // console.log('database is connected');
       /*  const database = client.db('travelExpress');
        const bookingsCollection = database.collection('bookings'); */
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




