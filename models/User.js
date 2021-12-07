const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
   email: {
      type: String,
      required: true,
   },
   password: {
      type: String,
      required: true,
   },
   resetToken: String, // for the reseting passwords
   resetTokenExpiration: Date, // for the reseting passwords
   usersBrackets: {
      bracket: [
         {
            bracketId: {
               type: Schema.Types.ObjectId,
               ref: "Bracket",
               required: true,
            },
            quantity: { type: Number, required: true },
         },
      ],
   },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
