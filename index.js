const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
const admin = require('firebase-admin');
require('dotenv').config()
const app = express()
app.use(cors())
app.use(bodyParser.json());




var serviceAccount = require("./configs/burj-al-arab-588ee-firebase-adminsdk-bxq38-4e58a89094.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const port = 4000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1msfu.mongodb.net/burjAlArab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Hello World! , its working')
})





client.connect(err => {
  const bookings = client.db("burjAlArab").collection("bookings");

app.post('/addBooking', (req, res) => {
  const newBooking = req.body;
  bookings.insertOne(newBooking)
      .then(result => {
          res.send(result.insertedCount > 0);
      })
  
})

app.get('/bookings' , (req, res) => {
  const bearer = req.headers.authorization;
  if( bearer && bearer.startsWith('Bearer ')){
    const idToken = bearer.split(' ')[1];
    // console.log({idToken});
    admin
.auth()
.verifyIdToken(idToken)
.then((decodedToken) => {
let tokenEmail = decodedToken.email;
  if(tokenEmail == req.query.email){
    bookings.find({email: req.query.email})
    .toArray((err , documents)=>{
      res.status(200).send(documents)
    })
  }
  else{
    res.status(401).send('un-authorizaed access')
  }
})
.catch((error) => {
  res.status(401).send('un-authorizaed access')
});
  }
  else{
    res.status(401).send('un-authorizaed access')
  }
 
})
  console.log('connected');
});

app.listen(port, () => {
  console.log('running')
})