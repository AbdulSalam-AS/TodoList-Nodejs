require("dotenv").config();
const { Item, List }= require("../models/model");
const connectDB = require("../db/connect");
const _ = require("lodash");
connectDB(process.env.MONGODB_URL);

const item1 = new Item({ name: "Welcome to your todolist!" });
const item2 = new Item({ name: "Hit the + button to add a new item" });
const item3 = new Item({ name: "<-- Hit this to delete the item" });
const defaultItems = [item1, item2, item3];

// Handling Get Requests for Homepage
const Home = ("/", (req, res) => {
  Item.find({}).then(foundItems => {
    if(foundItems.length === 0){
      Item.insertMany(defaultItems);
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  })
  
});

//Handling Post Requests
const Post = ("/", function(req, res){
  const newItem = req.body.newItem;
  const listName = req.body.list;
  
  const item = new Item({
    name: newItem
  });

  if(listName === "Today"){
    item.save(item).then(()=>{
      res.redirect("/");
    });
  }else{
    List.findOne({name: listName}).then((foundList, err)=>{
      if(foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+listName);
      }
    })
  }
  
  });


//Handling Delete Request
const Delete = ("/delete",(req ,res)=>{
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.deleteOne({_id:checkedItemId}).then((result, err)=>{
      if(!err){
        res.redirect("/");
      }
    })
  }else{
    List.findOneAndUpdate({ name: listName },
      {$pull :{items:{_id:checkedItemId}}})
      .then((result,err)=>{
        if(err){
          console.log(err);
        }else if(!err){
          res.redirect("/" + listName);
        }
      })
  }
 
  });
  
// Handling Get Request For customLists
const customList = ("/:customListName",(req, res)=>{
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName }).then((foundList, err)=>{
    if(!err){
      if(!foundList){
        // Create a new List
        const list = new List({
          name:customListName,
          items:defaultItems
        });
        list.save();
        res.redirect("/"+ customListName);
      }else{
        res.render("list", {listTitle: customListName, newListItems: foundList.items});
      }
    }
  })

});

module.exports = { Home, customList, Delete, Post }