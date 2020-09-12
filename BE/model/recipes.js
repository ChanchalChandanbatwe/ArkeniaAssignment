const mongoose = require('mongoose');
const mongooseSchema = mongoose.Schema({
    id:String,
    name:String,
    description:String,
    ingredients:[],
    calories:Number,
    create_date:{ type: Date, default: Date.now },
    imageName: String,
});
module.exports = mongoose.model('Recipe',mongooseSchema);
