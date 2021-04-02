require("dotenv").config();
var ekspres = require("express");
var app = ekspres();
const mongoose = require("mongoose");

var server = app.listen(3000, () => {
  console.log("server is running on port", server.address().port);
  mongoose.connect(process.env.db_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
app.use(ekspres.static(__dirname));
var Message = mongoose.model("Message", { ime: String, poruka: String });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
  console.log("Uspesno");
});
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/poruke", (req, res) => {
  Message.find({}, (err, poruke) => {
    res.send(poruke);
  });
});

app.post("/poruke", (req, res) => {
  var poruke = new Message(req.body);
  console.log(poruke);
  poruke.save((err) => {
    if (err) sendStatus(500);
    io.emit("poruka", req.body);
    res.sendStatus(200);
  });
});
var http = require("http").Server(app);
var io = require("socket.io")(http);

io.listen(server);

io.on("connection", function (socket) {
  socket.on("room", function (data) {
    socket.join(data);
    console.log(data);
  });
});
  io.sockets.in("abc").emit("message", "Hello World");
  console.log("Hi");
  

