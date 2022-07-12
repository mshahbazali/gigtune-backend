const express = require("express")
const router = new express.Router();
const { eventsSchema } = require('../../Model/Events')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { usersSchema } = require("../../Model/Users");


router.post("/", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            if (_id) {
                eventsSchema.find().where('_id').in(req.body.suggestions).exec((err, records) => {
                    res.status(201).send({
                        suggestions: records
                    })
                });
            }
        });
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.post("/approve", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            if (_id) {
                eventsSchema.findOne({ _id: req.body.eventId }, async (err, event) => {
                    if (event) {
                        await eventsSchema.findByIdAndUpdate({ _id: req.body.eventId }, req.body.event, {
                            new: true
                        })
                        await usersSchema.findByIdAndUpdate({ _id: req.body.userId }, req.body.user, {
                            new: true
                        })
                        res.status(201).send({
                            message: "Suggestion Successfully Approved",
                        })
                    }
                }
                )
            }
        });

    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.post("/reject", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            if (_id) {
                eventsSchema.findOne({ _id: req.body.eventId }, async (err, event) => {
                    if (event) {
                        await eventsSchema.findByIdAndUpdate({ _id: req.body.eventId }, req.body.event, {
                            new: true
                        })
                        await usersSchema.findByIdAndUpdate({ _id: req.body.userId }, req.body.user, {
                            new: true
                        })
                        res.status(201).send({
                            message: "Suggestion Successfully Reject",
                        })
                    }
                }
                )
            }
        });

    }
    catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router