import express from "express";
import Joke from "../models/Joke.js";
import {faker} from "@faker-js/faker";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const jokes = await Joke.find({});

        const collection = {
            "items": jokes,
            "_links": {
                "self": {
                    "href": process.env.BASE_URL+"/jokes"
                },
                "collection": {
                    "href": process.env.BASE_URL+"/jokes"
                }
            }
        }
        res.json(collection)
    } catch (error) {
        res.json({error: error.message})
    }
})

router.post("/", async (req, res) => {
    try {
        const {title, body, author} = req.body;

        const joke = Joke.create({
            title: title,
            body: body,
            author: author
        })
        res.json({});

    } catch (error) {
        res.json({error: error.message})
    }

    // console.log(title, body, author);
})

router.options("/", (req, res) => {
    res.setHeader('Allow', 'GET, POST');
    res.send();
})

router.options("/:id", (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE');
    res.send();
})

router.get("/:id", async (req, res) => {
    const {id} = req.params;
    const joke = await Joke.findById(id);
    res.json(joke)
})

router.post("/seed", async (req, res) => {
    try {
        const {amount} = req.body;

        await Joke.deleteMany({});

        for (let i = 0; i < amount; i++) {
            await Joke.create({
                title: faker.word.verb(),
                body: faker.lorem.paragraphs(),
                author: faker.person.fullName(),
            });
        }
        res.json({success: true})
    } catch (error) {
        res.json({error: error.message})
    }
})

export default router;