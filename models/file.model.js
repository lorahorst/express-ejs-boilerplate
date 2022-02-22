const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
    name: String,
    url: String
})

module.exports = mongoose.model("File", fileSchema);