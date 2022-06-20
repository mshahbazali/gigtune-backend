const express = require("express")
const router = new express.Router();
const { usersSchema } = require('../../Model/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get("/", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            usersSchema.findOne({ _id: _id }, async (err, user) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.status(201).send(user)
                }
            }
            )
        });

    }
    catch (e) {
        res.status(204).send(e)
    }
})

module.exports = router