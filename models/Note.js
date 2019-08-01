const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let NoteSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    body: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("Note", NoteSchema);