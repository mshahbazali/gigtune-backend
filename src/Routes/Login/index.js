const express = require("express")
const router = new express.Router();
const { usersSchema } = require('../../Model/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Data Create 

router.post("/", async (req, res) => {
    try {
        const emailAddress = req.body.identifier
        usersSchema.find({ emailAddress: emailAddress })
            .exec()
            .then(async (user) => {
                if (user.length < 1) {
                    res.status(202).send("User Not Found")
                }
                else {
                    await bcrypt.compare(req.body.password, user[0].password).then((pass) => {
                        if (pass === true) {
                            const token = jwt.sign({ id: user[0].id }, "secret_gigtune");
                            res.status(202).send({
                                message: "Successfully signed",
                                token: token
                            })
                        }
                        else {
                            res.status(202).send({ message: "Your password is incorrect" })
                        }
                    })
                }
            })
            .catch(e => {
                console.log(e);
                res.status(201).send({ message: "User Not Found", user: 'false' })
            })
    }
    catch (e) {
        res.status(201).send({ message: "User Not Found", user: 'false' })
    }
})


module.exports = router