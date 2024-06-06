const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const SSLCommerzPayment = require('sslcommerz');
const port = process.env.PORT || 5000;


require('dotenv').config();
// middleware setUp 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.dn7ou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();
        // console.log('database is connected');
        const database = client.db('travelExpress');
        const bookingPlacesCollection = database.collection('bookingPlaces');
        const bookingCollection = database.collection('bookings');

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
        });

        // POST API - Add Booking service
        app.post('/booking_places', async (req, res) => {
            const bookingPlace = req.body;
            const result = await bookingPlacesCollection.insertOne(bookingPlace);
            res.json(result);
        });

        // GET API - All User Bookings
        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        });

        // POST API - All User Bookings
        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            const result = await bookingCollection.insertOne(bookings);
            res.json(result);
        });

        
        // MY Bookings
        app.get("/myBookings/:email", async (req, res) => {
            const result = await bookingCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        // Cancel Bookings
        app.delete("/cancelBookings/:id", async (req, res) => {
            const result = await bookingCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        
        // SSLCOMMERZ payment system initiation API
        app.post('/init', (req, res) => {
            // console.log(req.body);
            const data = {
                total_amount: req.body.total_amount,
                currency: 'BDT',
                tran_id: 'REF123',
                success_url: 'http://localhost:5000/success',
                fail_url: 'http://localhost:5000/fail',
                cancel_url: 'http://localhost:5000/cancel',
                ipn_url: 'http://localhost:5000/ipn',
                shipping_method: 'Courier',
                product_name: req.body.product_name,
                product_image: req.body.product_image,
                product_category: 'Electronic',
                product_profile: req.body.product_profile,
                cus_name: req.body.cus_name,
                cus_email: req.body.cus_email,
                cus_add1: 'Dhaka',
                cus_add2: 'Dhaka',
                cus_city: 'Dhaka',
                cus_state: 'Dhaka',
                cus_postcode: '1000',
                cus_country: 'Bangladesh',
                cus_phone: '01711111111',
                cus_fax: '01711111111',
                ship_name: 'Customer Name',
                ship_add1: 'Dhaka',
                ship_add2: 'Dhaka',
                ship_city: 'Dhaka',
                ship_state: 'Dhaka',
                ship_postcode: 1000,
                ship_country: 'Bangladesh',
                multi_card_name: 'mastercard',
                value_a: 'ref001_A',
                value_b: 'ref002_B',
                value_c: 'ref003_C',
                value_d: 'ref004_D'
            };
            // console.log(data)
            const sslcommer = new SSLCommerzPayment(process.env.STORE_ID,process.env.STORE_PASS,false) //true for live default false for sandbox
            sslcommer.init(data).then(data => {
                // process the response that got from sslcommerz
                // console.log(data);

                if (info.GatewayPageURL) {
                    res.json(info.GatewayPageURL)
                }
                else {
                    return res.status(400).json({
                        message: "SSL session was not successful"
                    })
                }
            });
        });

        app.post('/success', async (req, res) => {
            console.log(req.body);
            res.status(200).json(req.body);
        });
        app.post('/fail', async (req, res) => {
            console.log(req.body);
            res.status(400).json(req.body);
        });
        app.post('/cancel', async (req, res) => {
            console.log(req.body);
            res.status(200).json(req.body);
        });


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




