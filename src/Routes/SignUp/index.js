const express = require("express")
const router = new express.Router();
const { usersSchema } = require('../../Model/Users')
const bcrypt = require('bcrypt')

router.post("/", async (req, res) => {
    try {
        let user = await usersSchema.findOne({ emailAddress: req.body.emailAddress });
        if (user) {
            return res.status(202).send({ message: 'Your phone number is already registered' });
        } else {
            const securePass = await bcrypt.hash(req.body.password, 10)
            req.body.password = securePass
            const addauth = new usersSchema(req.body)
            addauth.save()
            res.status(202).send({ message: "Congratulations! Your Account Successfully Created" })
        }

    }
    catch (err) {
        console.log(err);
        res.status(202).send({ message: "Please fill valid information" })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const _id = req.params.id
        usersSchema.findOne({ _id: _id }, async (err, user) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(201).send(user)
            }
        }
        )
    }
    catch (e) {
        res.status(204).send(e)
    }
})

// Data Update 

router.patch("/:id", async (req, res) => {
    try {

        const _id = req.params.id
        const updateauth = await usersSchema.findByIdAndUpdate(_id, req.body, {
            new: true
        })
        res.status(202).send(updateauth)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// Data Delete 

router.delete("/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const updateauth = await usersSchema.findByIdAndDelete(_id)
        res.status(202).send(updateauth)
    }
    catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router