const mongoose = require("mongoose");

mongoose.connect(
    "mongodb://127.0.0.1:27017/paytm-clone?replicaSet=rs&directConnection=true"
);

const UserSchema = new mongoose.Schema({
  
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
      password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;