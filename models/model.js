const mongoose = require('mongoose');   

const itemSchema = mongoose.Schema({
    name:{
      type:String,
      required:[true,"No Name Specified"]
    }
  });
const listSchema = mongoose.Schema({
  name:String,
  items:[itemSchema]
})

const Item = mongoose.model('Item',itemSchema);
const List = mongoose.model("List",listSchema)
module.exports = {Item, List }