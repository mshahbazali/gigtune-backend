const express = require("express")
const router = new express.Router();
const { eventsSchema } = require('../../Model/Events')
const { usersSchema } = require('../../Model/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post("/add", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", async (err, decoded) => {
            const _id = decoded.id
            console.log(req.body._id);
            eventsSchema.find({ _id: req.body._id }, async (err, event) => {
                if (err) { }
                else {
                    if (_id === req.body.admin) {
                        req.body.team = [...event[0].team, req.body.team[0]]
                        await eventsSchema.findByIdAndUpdate(req.body._id, req.body, {
                            new: true
                        })
                        usersSchema.find({ _id: req.body.team[0].id }, async (err, user) => {
                            console.log(user);
                            await usersSchema.findByIdAndUpdate(req.body.team[0].id, { suggestions: [...user[0].suggestions, event[0]._id] }, {
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
router.delete("/delete", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            usersSchema.findOne({ _id: _id }, async (err, user) => {
                if (err) { }
                else {
                    req.body.events = user.events;
                    const latestTeamMember = req.body.events[req.body.date][req.body.eventIndex].team.filter(data => data._id != req.body.team._id);
                    req.body.events[req.body.date][req.body.eventIndex].team = latestTeamMember;
                    const updateauth = await usersSchema.findByIdAndUpdate(_id, req.body, {
                        new: true
                    })
                    res.status(202).send(updateauth)
                    const teamMemberId = req.body.team[req.body.teamMemberIndex]._id;
                    usersSchema.findOne({ _id: teamMemberId }, async (err, teamMember) => {
                        if (err) { }
                        else {
                            req.body.suggestions = teamMember.suggestions == undefined ? {} : teamMember.suggestions;
                            const suggestionsCheck = req.body.suggestions[req.body.date].filter(data =>
                                data.eventTitle != req.body[req.body.date][req.body.eventIndex].eventTitle
                            );
                            if (suggestionsCheck[0] == undefined) {
                                req.body.suggestions[req.body.date] = suggestionsCheck;
                                await usersSchema.findByIdAndUpdate(teamMemberId, { suggestions: req.body.suggestions }, {
                                    new: true
                                });
                            }
                            else {
                                res.status(202).send({ message: "Request already send" })
                            }

                        }

                    })
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
                    console.log(req.body.events[req.body.date][req.body.eventIndex].team);
                    const updateauth = await usersSchema.findByIdAndUpdate(_id, { events: req.body.events }, {
                        new: true
                    })
                    res.status(202).send(updateauth)

                    const teamMemberId = req.body.team[req.body.teamMemberIndex]._id;
                    console.log(teamMemberId);
                    usersSchema.findOne({ _id: teamMemberId }, async (err, teamMember) => {
                        if (err) { }
                        else {
                            req.body.suggestions = teamMember.suggestions
                            req.body.suggestions[req.body.date][req.body.eventIndex].charges = req.body.charges
                            await usersSchema.findByIdAndUpdate({ _id: teamMemberId }, { suggestions: req.body.suggestions }, {
                                new: true
                            })
                        }

                    })
                }
            }
            )
        })

    }
    catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router