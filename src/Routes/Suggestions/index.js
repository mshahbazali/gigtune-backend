const express = require("express")
const router = new express.Router();
const { usersSchema } = require('../../Model/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post("/", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            usersSchema.findOne({ _id: _id }, async (err, user) => {
                if (err) { }
                else {
                    req.body.events = user.events
                    req.body.events[req.body.date][req.body.eventIndex].team.push(req.body.team)
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
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            usersSchema.findOne({ _id: _id }, async (err, user) => {
                if (err) { }
                else {
                    req.body.events = user.events;
                    const latestTeamMember = req.body.events[req.body.date][req.body.eventIndex].team.filter(data => data.name != req.body.team.name);
                    req.body.events[req.body.date][req.body.eventIndex].team = latestTeamMember
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
                if (err) { }
                else {
                    req.body.events = user.events
                    req.body.events[req.body.date][req.body.eventIndex].team[req.body.teamMemberIndex].charges = req.body.charges
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