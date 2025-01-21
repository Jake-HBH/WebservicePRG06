import mongoose from 'mongoose';

const jokeSchema = new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    author: {type: String, required: true}
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: process.env.BASE_URL+`/jokes/${ret.id}`
                },
                collection: {
                    href: process.env.BASE_URL+`jokes`
                }
            }

            delete ret._id
        }
    }
});

export default mongoose.model('Joke', jokeSchema);