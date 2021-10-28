const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
   // userId: {
   //    type: Schema.Types.ObjectId,
   //    ref: "Bracket",
   //    required: true
   // }
   // leftLevels: {
   //    type: Number,
   //    required: true
   // }
   // rightLevels: {
   //    type: Number,
   //    required: true
   // }
});

module.exports = mongoose.model("Product", productSchema);
