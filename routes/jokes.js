import express from "express";
import Joke from "../models/Joke.js";
import {faker} from "@faker-js/faker";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const jokes = await Joke.find({});

        const collection = {
            items: jokes,
            _links: {
                self: {
                    href: `${process.env.BASE_URL}/jokes`
                },
                collection: {
                    href: `${process.env.BASE_URL}/jokes`
                }
            }
        };

        res.json(collection);
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, body, author, amount, method, replace } = req.body;

        if (method === "SEED") {
            if (replace) {
                await Joke.deleteMany({});
            }
            for (let i = 0; i < amount; i++) {
                await Joke.create({
                    title: faker.word.words({ count: { min: 3, max: 6 } }),
                    body: faker.lorem.paragraphs({ min: 1, max: 2 }),
                    author: faker.internet.username(),
                });
            }
            return res.status(201).json({ success: true });
        }

        if (!title || !body || !author) {
            return res.status(400).json({ error: "Title, body, and author are required fields." });
        }

        const joke = await Joke.create({
            title: title,
            body: body,
            author: author,
        });

        res.status(201).json(joke);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





router.options("/", (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.status(200).send();
});

router.options("/:id", (req, res) => {
    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS");
    res.status(200).send();
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const joke = await Joke.findById(id);

    if (!joke) {
        return res.status(404).json({ error: "Joke not found" });
    }
    //if existing, show joke
    res.json(joke);
});


router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body, author } = req.body;

        if (!title || !body || !author) {
            return res.status(400).json({ error: 'Title, body, and author are required' });
        }

        const updatedJoke = await Joke.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedJoke) {
            return res.status(404).json({ error: 'Joke not found' });
        }

        res.status(200).json(updatedJoke);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// DELETE a joke by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedJoke = await Joke.findByIdAndDelete(id);

        if (!deletedJoke) {
            return res.status(404).json({ error: "Joke not found" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;