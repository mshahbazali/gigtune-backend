const mongoose = require('mongoose')
const dbConnectAtlas = "mongodb+srv://gigtune:gigtune1862@cluster0.lohvd.mongodb.net/test";
mongoose.connect(dbConnectAtlas, { useNewUrlParser: true }).then(() => {
    console.log("connected");
})
    .catch((e) => {
        console.log("no connected");
    })