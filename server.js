// server.js
//console.log('May Node be with you')

const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const router = express.Router();
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://trong46:04062003Bo@cluster0.hsuipkk.mongodb.net/'

/*
MongoClient.connect(connectionString, (err, MongoClient) => {
    // ... do something here
    if (err) return console.error(err)
        console.log('Connected to Database')
})
*/

/*
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
    })
    .catch(error => console.error(error))
*/

// (0) CONNECT: server -> connect -> MongoDB Atlas 
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        
        // (1a) CREATE: client -> create -> database -> 'star-wars-quotes'
        // -> create -> collection -> 'quotes'
        const db = client.db('ATNStore')
        const quotesCollection = db.collection('quotes')
        
        // To tell Express to EJS as the template engine
        app.set('view engine', 'ejs') 
        
        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))

        // To make the 'public' folder accessible to the public
        app.use(express.static('public'))

        // To teach the server to read JSON data 
        app.use(bodyParser.json())

        router.get("/", function(req, res, next) {
            dbConnect.query
        })

        // (2) READ: client -> browser -> url 
        // -> server -> '/' -> collection -> 'quotes' -> find() 
        // -> results -> index.ejs -> client
        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)
                    
                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('index.ejs', { quotes: results })
                })
                .catch(/* ... */)
        })

        app.get("/add",(req, res) =>{
            res.render("add.ejs");
        })

        // (1b) CREATE: client -> index.ejs -> data -> SUBMIT 
        // -> post -> '/quotes' -> collection -> insert -> result
        app.post('/save', (req, res) => {
            quotesCollection.insertOne(req.body)
            .then(result => {
                
                // results -> server -> console
                console.log(result)

                // -> redirect -> '/'
                res.redirect('/')
             })
            .catch((error) => {
                res.status(500).send({
                    message:
                    err.message ||
                    "Error! Some problem happened when creating product",
                });

            });
        });
        // (3) UPDATE: client -> click -> 'Replace Yoda's quote'
        // -> replace / create -> 'Yoda' -> 'Darth Vadar'
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
                {
                    // If name 'Yoda' exists, change Yoda’s quotes into Darth Vadar’s quotes
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    // If no Yoda quotes exist, force to create a new Darth Vadar quote
                    upsert: true
                }
                
            )
            .then(result => res.json('Success'))
            .catch(error => console.error(error))
        })

        // (4) DELETE: client -> click -> 'Delete Darth Vadar's quote'
        // -> delete -> 'Darth Vadar' 
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
            .then(result => {
                res.json(`Deleted Product`)
            })
            .catch(error => console.error(error))
        })

        // server -> listen -> port -> 3000
        app.listen(3000, function() {
            console.log('listening on 3000')
        })
    })



/*
app.get('/', (req, res) => {
    res.send('Hello World')
})
*/

/*
app.post('/quotes', (req, res) => {
    console.log('Hellooooooooooooooooo!')
})
*/

/*
app.post('/quotes', (req, res) => {
    console.log(req.body)
})
*/
