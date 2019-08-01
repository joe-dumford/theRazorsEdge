const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema constructor creating a new UserSchema object
let ArticleSchema = new Schema({
    title: {
        type: String,
        required: false 
    },
    link: {
        type: String,
        required: false
    },
    //`note` is an object that stores a Note id. The ref links the ObjectId to the
    // Note model, allowing us to populate the Article w/ associated Note
    note: {
        type: Schema.Typles.ObjectId,
        ref: "Note"
    }
});

module.exports =  mongoose.model("Article", ArticleSchema);
