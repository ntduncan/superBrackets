const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bracketSchema = new Schema({
   title: {
      type: String,
      required: true,
   },
   // user model and auth needs worked out
   // creatorId: {
   //    type: Schema.Types.ObjectId,
   //    ref: "User",
   //    required: true,
   // },
   description: {
      type: String,
      required: true,
   },
   participants: [
      {
         name: {
            type: String,
            required: true,
         },
         round: {
            type: Number,
            required: true,
         },
      },
   ],
});

module.exports = mongoose.model("Bracket", bracketSchema);
