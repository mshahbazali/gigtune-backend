const express = require("express")
const router = new express.Router();
const { usersSchema } = require('../../Model/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Data Create 

router.post("/create", async (req, res) => {
    try {
        jwt.verify(req.body.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            usersSchema.findOne({ _id: _id }, async (err, user) => {
                if (err) {
                    console.log(err);
                }
                else {
                    req.body.events = [
                        {
                            eventTitle: "Event Title1"
                        },
                        {
                            eventTitle: "Event Title2"
                        },
                        {
                            eventTitle: "Event Title3"
                        },
                    ]
                    const updateauth = await usersSchema.findByIdAndUpdate(_id, req.body, {
                        new: true
                    })
                    res.status(202).send(updateauth)
                }
            }
            )
        });

    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.delete("/delete", async (req, res) => {
    try {
        jwt.verify(req.body.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            usersSchema.findOne({ _id: _id }, async (err, user) => {
                if (err) {
                    console.log(err);
                }
                else {
                    req.body.events = user.events
                    req.body.events.splice(1, 2)
                    const updateauth = await usersSchema.findByIdAndUpdate(_id, req.body, {
                        new: true
                    })
                    res.status(202).send(updateauth)
                }
            }
            )
        });

    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.patch("/update", async (req, res) => {
    try {
        jwt.verify(req.body.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            usersSchema.findOne({ _id: _id }, async (err, user) => {
                if (err) {
                    console.log(err);
                }
                else {
                    req.body.events = user.events
                    req.body.events[0] = {
                        eventTitle: "Title10"
                    }
                    const updateauth = await usersSchema.findByIdAndUpdate(_id, req.body, {
                        new: true
                    })
                    res.status(202).send(updateauth)
                }
            }
            )
        });

    }
    catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router