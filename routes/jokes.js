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

router.get("/test",  (req, res, next) => {
    res.json("HELLO")
});

router.post("/", async (req, res) => {
    try {
        const {title, body, author, amount, method, replace} = req.body;

        if (method === "SEED") {
            if (replace) {
                await Joke.deleteMany({});
            }
            for (let i = 0; i < amount; i++) {
                await Joke.create({
                    title: faker.word.verb(),
                    body: faker.lorem.paragraphs(),
                    author: faker.person.fullName(),
                });
            }
            return res.status(201).json({success: true})
        }

        const joke = await Joke.create({
            title: title,
            body: body,
            author: author
        })
        res.status(201).json(joke)
    } catch (error) {
        res.json({error: error.message})
    }

    // console.log(title, body, author);
})



router.options("/", (req, res, next) => {
    res.setHeader('Allow', 'GET, POST');
    res.send();
})

router.options("/:id", (req, res, next) => {
    res.setHeader('Allow', 'GET, PUT, DELETE');
    res.send();
})

router.get("/:id", async (req, res) => {
    const {id} = req.params;
    const joke = await Joke.findById(id);
    res.json(joke)
})

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const updatedJoke = await Joke.findByIdAndUpdate(id, req.body, { new : true});
        res.status(201).json(updatedJoke)
    } catch (error) {
        res.status(204).json({ error: error.message });
    }


})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedJoke = await Joke.findByIdAndDelete(id);

        if (!deletedJoke) {
            return res.status(404).json({ error: "Joke not found" });
        }

        res.status(204).send(); // No content in the response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;