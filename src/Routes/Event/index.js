const express = require("express")
const router = new express.Router();
const { usersSchema } = require('../../Model/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post("/create", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            usersSchema.findOne({ _id: _id }, async (err, user) => {
                if (err) { }
                else {
                    req.body.events = user.events == undefined ? {} : user.events;
                    Array.isArray(req.body.events[req.body.date]) == false ? req.body.events[req.body.date] = new Array(req.body[req.body.date][0]) : req.body.events[req.body.date].push(req.body[req.body.date][0])
                    const eventCreate = await usersSchema.findByIdAndUpdate(_id, req.body, {
                        new: true
                    })
                    res.status(202).send({
                        message: "Event successfully created",
                        data: eventCreate
                    })
                    // const eventTitleCheck = req.body.events[req.body.date].filter(data =>
                    //     data.eventTitle != req.body[req.body.date][req.body.eventIndex].eventTitle
                    // );
                    // if (eventTitleCheck[0] == undefined) {
                    // }
                    // else {
                    //     res.status(202).send({
                    //         message: "Event title already used",
                    //     })
                    // }

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
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            usersSchema.findOne({ _id: _id }, async (err, user) => {
                if (err) {
                    console.log(err);
                }
                else {
                    req.body.events = user.events
                    const eventDelete = req.body.events[req.body.date].filter(data =>
                        data.eventTitle != req.body[req.body.date][req.body.eventIndex].eventTitle
                    );
                    if (eventDelete[0] == undefined) {
                        req.body.events[req.body.date] = eventDelete;
                    } else {
                        req.body.events[req.body.date] = eventDelete;
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
router.patch("/update", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
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