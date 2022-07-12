const express = require("express")
const router = new express.Router();
const { eventsSchema } = require('../../Model/Events')
const { usersSchema } = require('../../Model/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");

router.post("/add", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", async (err, decoded) => {
            const _id = decoded.id
            eventsSchema.find({ _id: req.body._id }, async (err, event) => {
                if (err) { }
                else {
                    if (_id === req.body.admin) {
                        req.body.team = [...event[0].team, req.body.team[0]]
                        await eventsSchema.findByIdAndUpdate(req.body._id, req.body, {
                            new: true
                        })
                        usersSchema.findOne({ _id: req.body.userId }, async (err, user) => {
                            await usersSchema.findByIdAndUpdate({ _id: req.body.userId }, { suggestions: [...user.suggestions, { eventId: event[0]._id, date: new Date().toISOString().slice(0, 10), status: "Awating" }] }, {
                                new: true
                            })
                        })
                        res.status(201).send({
                            message: "Team Member Successfully Added"
                        })
                    }

                }
            }
            )
        });

    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.post("/update/charges", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", async (err, decoded) => {
            const _id = decoded.id
            eventsSchema.find({ _id: req.body._id }, async (err, event) => {
                if (err) { }
                else {
                    if (_id === req.body.admin) {
                        req.body.team = event[0].team[req.body.teamMemberIndex] = req.body.team[0]
                        await eventsSchema.findByIdAndUpdate(req.body._id, req.body, {
                            new: true
                        })
                        res.status(201).send({
                            message: "Charges Successfully Updated"
                        })
                    }

                }
            }
            )
        });

    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.post("/delete", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", async (err, decoded) => {
            const _id = decoded.id
            eventsSchema.find({ _id: req.body._id }, async (err, event) => {
                if (err) { }
                else {
                    if (_id === req.body.admin) {
                        const updateEvent = await eventsSchema.findByIdAndUpdate(req.body._id, req.body, {
                            new: true
                        })
                        usersSchema.find({ _id: req.body.deleteMemberId }, async (err, user) => {
                            await usersSchema.findByIdAndUpdate({ _id: req.body.deleteMemberId }, { suggestions: req.body.deleteSuggestions }, {
                                new: true
                            })
                        })
                        res.status(201).send({
                            message: "Team Member Successfully Deleted",
                            event: updateEvent
                        })
                    }

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