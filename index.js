import express from 'express';
import mongoose from "mongoose";
import jokes from "./routes/jokes.js";

// const animals = [
//     {
//         "id": 1,
//         "name": "Lion",
//         "description": "A large carnivorous feline found in Africa and India.",
//         "habitat": "Savannas and grasslands"
//     },
//     {
//         "id": 2,
//         "name": "Elephant",
//         "description": "The largest land animal, known for its intelligence and memory.",
//         "habitat": "Forests and grasslands"
//     },
//     {
//         "id": 3,
//         "name": "Penguin",
//         "description": "A flightless bird that lives in the Southern Hemisphere.",
//         "habitat": "Antarctic and coastal regions"
//     },
//     {
//         "id": 4,
//         "name": "Kangaroo",
//         "description": "A marsupial native to Australia, known for its powerful legs.",
//         "habitat": "Grasslands and open forests"
//     },
//     {
//         "id": 5,
//         "name": "Dolphin",
//         "description": "A highly intelligent aquatic mammal known for its playful behavior.",
//         "habitat": "Oceans and coastal waters"
//     },
//     {
//         "id": 6,
//         "name": "Panda",
//         "description": "A bear native to China, known for its diet primarily of bamboo.",
//         "habitat": "Mountainous forests"
//     },
//     {
//         "id": 7,
//         "name": "Tiger",
//         "description": "A solitary big cat with a distinctive orange and black striped coat.",
//         "habitat": "Tropical forests and grasslands"
//     },
//     {
//         "id": 8,
//         "name": "Polar Bear",
//         "description": "A large bear adapted to life in Arctic regions.",
//         "habitat": "Sea ice and tundra"
//     },
//     {
//         "id": 9,
//         "name": "Peacock",
//         "description": "A bird known for its vibrant and colorful tail feathers.",
//         "habitat": "Forests and open woodlands"
//     },
//     {
//         "id": 10,
//         "name": "Octopus",
//         "description": "An intelligent mollusk with eight arms and a soft body.",
//         "habitat": "Oceans and coral reefs"
//     }
// ]

const app = express();

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()

})

app.use((req, res, next) => {
    if (req.method !== 'OPTIONS' && req.headers.accept !== 'application/json') {
        return res.status(406).json({ error: 'Only requests with "Accept: application/json" are allowed' });
    }
    next();
});


mongoose.connect('mongodb://127.0.0.1:27017/prg-06-db');

app.use((req, res, next) =>{
    const acceptHeader = req.headers.accept;
    if (acceptHeader !== 'application/json'){
        return res.status(406).json({error: 'Request are only accepted with Accept of json'});
    }
    next()
})

// Middleware voor JSON-gegevens
app.use(express.json());
// Middleware voor www-urlencoded-gegevens
app.use(express.urlencoded({extended: true}));

app.use("/jokes", jokes)

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});