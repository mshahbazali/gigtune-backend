const express = require("express")
const router = new express.Router();
const { usersSchema } = require('../../Model/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post("/add", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            usersSchema.findOne({ _id: _id }, async (err, user) => {
                if (err) { }
                else {
                    req.body.events = user.events;
                    const alreadyAddTeamMember = req.body.events[req.body.date][req.body.eventIndex].team.filter(data => data._id == req.body.team._id);
                    if (alreadyAddTeamMember[0] == undefined) {
                        req.body.events[req.body.date][req.body.eventIndex].team.push(req.body.team);
                        const addedMember = await usersSchema.findByIdAndUpdate(_id, req.body, {
                            new: true
                        })
                        res.status(202).send({
                            message: "Team member successfully added",
                            data: addedMember
                        })
                    }
                    else {
                        res.status(202).send({ message: "Team member already added" })
                    }

                    const teamMemberId = req.body.team[req.body.teamMemberIndex]._id;
                    usersSchema.findOne({ _id: teamMemberId }, async (err, teamMember) => {
                        if (err) { }
                        else {
                            req.body.suggestions = teamMember.suggestions == undefined ? {} : teamMember.suggestions;
                            Array.isArray(req.body.suggestions[req.body.date]) == false ? req.body.suggestions[req.body.date] = new Array(req.body[req.body.date][req.body.eventIndex]) : req.body.suggestions[req.body.date].push(req.body[req.body.date][req.body.eventIndex])
                            const suggestionsCheck = req.body.suggestions[req.body.date].filter(data =>
                                data.eventTitle != req.body[req.body.date][req.body.eventIndex].eventTitle
                            );
                            if (suggestionsCheck[0] == undefined) {
                                await usersSchema.findByIdAndUpdate(teamMemberId, { suggestions: req.body.suggestions }, {
                                    new: true
                                });
                            }
                            else {
                                console.log("ok");
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
                                console.log("ok");
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
                    const updateauth = await usersSchema.findByIdAndUpdate(_id, req.body, {
                        new: true
                    })
                    res.status(202).send(updateauth)

                    const teamMemberId = req.body.team[req.body.teamMemberIndex]._id;
                    usersSchema.findOne({ _id: teamMemberId }, async (err, teamMember) => {
                        if (err) { }
                        else {
                            req.body.suggestions = teamMember.suggestions == undefined ? {} : teamMember.suggestions;
                            Array.isArray(req.body.suggestions[req.body.date]) == false ? req.body.suggestions[req.body.date] = new Array(req.body[req.body.date][req.body.eventIndex]) : req.body.suggestions[req.body.date].push(req.body[req.body.date][req.body.eventIndex])
                            const suggestionsCheck = req.body.suggestions[req.body.date].filter(data =>
                                data.eventTitle != req.body[req.body.date][req.body.eventIndex].eventTitle
                            );
                            console.log(suggestionsCheck);
                            if (suggestionsCheck[0] == undefined) {
                                await usersSchema.findByIdAndUpdate(teamMemberId, { suggestions: req.body.suggestions }, {
                                    new: true
                                });
                            }
                            else {
                                console.log("ok");
                                res.status(202).send({ message: "Request already send" })
                            }

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