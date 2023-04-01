const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const server = require("http").Server(app)
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

app.set('view engine', 'ejs')
app.use(express.static(__dirname + "/public"))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});  

app.get("/", (req,res)=>{
    res.render("index")
})

io.on('connection', (socket)=>{
    socket.emit('hello', {msg:"hello"})
})

server.listen(port, (req,res) => {
    console.log(`listening on port ${port}`)
})