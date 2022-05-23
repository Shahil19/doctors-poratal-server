const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8vkgo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db("doctors_portal").collection("service")
        const bookingCollection = client.db("doctors_portal").collection("booking")

        // GET method
        // get all services
        app.get('/service', async (req, res) => {
            const query = req.query
            const cursor = serviceCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        // POST method
        // Booking
        app.post('/booking', async (req, res) => {
            const booking = req.body
            console.log(booking);

            // find an appointment if it was booked before
            const query = { treatment: booking.treatment, slot: booking.slot }
            const exists = await bookingCollection.findOne(query)
            if (exists) {
                return res.send({ acknowledged: false, result: "You already have an appointment" })
            }
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        })

        console.log("connected");
    } finally {

    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')

})

app.listen(port, () => {
    console.log(`Doctors app listening on port ${port}`)
})