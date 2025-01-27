import express from 'express';
import mongoose from "mongoose";
import jokes from "./routes/jokes.js";

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/prg-06-db');

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, Allow');
    next();
});

// Middleware voor JSON-gegevens
app.use(express.json());
// Middleware voor www-urlencoded-gegevens
app.use(express.urlencoded({extended: true}));


app.use((req, res, next)=>{
    if (req.header('Accept')!== 'application/json' && req.method !== "OPTIONS"){
        res.status(406).json({error:'Requests must include Accept: application/json'})
    } else {
        next();
    }
})

app.use("/jokes", jokes)

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});