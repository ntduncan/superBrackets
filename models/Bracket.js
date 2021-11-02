const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
   userId: {
      type: Schema.Types.ObjectId,
      ref: "Bracket",
      required: true,
   },
});

module.exports = mongoose.model("Product", productSchema);
