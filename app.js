const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes/route");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use("/",routes);


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
