const bodyParser = require('body-parser');
const cors = require('cors');
const express = require("express");
require('dotenv').config();
const app = express()
const port = process.env.PORT
require('./src/DB')
app.use(express.json())
app.use(bodyParser.json({ limit: '30mb', extended: false }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: false }))
app.use(cors());
app.get("/", (req, res) => {
    res.send("hello Shahbaz");
})
app.listen(port, () => {
    console.log(`Server Is Running Please Open This Link http://localhost:${port}/`);
});

app.use("/api/register", require("./src/Routes/SignUp"))
app.use("/api/login", require("./src/Routes/Login"))
app.use("/api/user", require("./src/Routes/User"))
app.use("/api/event", require("./src/Routes/Event"))
app.use("/api/team", require("./src/Routes/Team"))
app.use("/api/suggestions", require("./src/Routes/Suggestions"))