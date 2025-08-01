const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email : { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const userModel = mongoose.model('User', userSchema);
 

module.exports = {
    userModel 
}
