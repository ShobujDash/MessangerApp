const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:[true,"Provide name"]
  },
  email: {
    type: String,
    required: [true, "provide email"],
    unique:true
  },
  password: {
    type: String,
    required: [true, "provide passowrd"],
  },
  profile_pic: {
    type: String,
    default:""
  }
},{timestamps:true})

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel; 



