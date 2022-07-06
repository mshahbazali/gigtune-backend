const express = require("express")
const router = new express.Router();
const { eventsSchema } = require('../../Model/Events')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { google } = require('googleapis')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")

const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
});


router.get("/", async (req, res) => {
    try {
        eventsSchema.find({}, (err, events) => {
            res.status(201).send({
                events: events
            });
        });
    }
    catch (e) {
        res.status(204).send(e)
    }
})

router.post("/create", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", async (err, decoded) => {
            const adminId = decoded.id
            let event = await eventsSchema.findOne({ title: req.body.title });
            if (event) {
                return res.status(202).send({ message: 'Your event title is already used' });
            } else {
                req.body.team = new Array()

                req.body.admin = adminId
                const addEvent = new eventsSchema(req.body)
                addEvent.save()
                res.status(202).send({ message: "Congratulations! Your Event Successfully Created" })
            }
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
            if (_id == req.body.admin) {
                await eventsSchema.findByIdAndDelete(req.body._id)
                res.status(202).send({
                    message: "Event Successfully Deleted"
                })
            }
        });

    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.post("/update", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "secret_gigtune", function (err, decoded) {
            const _id = decoded.id
            eventsSchema.findOne({ _id: req.body._id }, async (err, event) => {
                if (_id == req.body.admin) {
                    const updateEvent = await eventsSchema.findByIdAndUpdate(req.body._id, req.body, {
                        new: true
                    })
                    res.status(202).send({
                        message: "Event Successfully Updated",
                        updatedData: updateEvent
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




router.post("/uploadimage", upload.single("image"), async (req, res) => {
    try {
        const oauth2Client = new google.auth.OAuth2(
            "672364196408-h28bhu3k45rqs6uk7geduql5gjbnooi1.apps.googleusercontent.com",
            "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",
            "https://www.developers.google.com/oauthplayground/"
        );
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });
        const fileMetadata = {
            name: req.file.filename,
        };
        const media = {
            mimeType: req.file.type,
            body: fs.createReadStream(req.file.path),
        };
        oauth2Client.setCredentials({
            access_token: 'ya29.A0ARrdaM8h9AtivI2-d5Vi9dB5vHYq1Cg4oz1S3wC00c3JOunGCESwZ654ZOPld5SHRbFFl09Awd4aaeCL2z9_Vav7HXZc2H-MK8I-iO_UJhr2cn1LsLmzEWrpScbT-M15MK04Lj1NWl_53itzW8rzKJcB2lhvYUNnWUtBVEFTQVRBU0ZRRl91NjFWVVBkWldTbU5HMFBCZ2lFaHlvTmY2Zw0163',
            refresh_token: '1//04BY-kUGL8mRmCgYIARAAGAQSNwF-L9Ir5J7T5dNbvIjap4YM8tQdDoClQJE82ay3eVBth96vN9iWrutv7HWylmqfeFNtMcfY6lo',
            expiry_date: true
        });
        drive.files.create(
            {
                resource: fileMetadata,
                media: media,
                fields: 'id',
            },
            async (err, file) => {
                await drive.permissions.create({
                    fileId: file.data.id,
                    requestBody: {
                        role: "reader",
                        type: "anyone"
                    }
                })
                const result = await drive.files.get({
                    fileId: file.data.id,
                    fields: "webViewLink , webContentLink",
                });
                if (err) {
                    // Handle error
                    console.error(err);
                } else {
                    fs.unlinkSync(req.file.path);
                    res.send({ fileId: file.data.id });
                }
            }
        );

        // res.send({ "hello": "resFile.data" })
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.post("/uploadfile", upload.single("file"), async (req, res) => {
    try {
        const oauth2Client = new google.auth.OAuth2(
            "672364196408-h28bhu3k45rqs6uk7geduql5gjbnooi1.apps.googleusercontent.com",
            "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",
            "https://www.developers.google.com/oauthplayground/"
        );
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });
        const fileMetadata = {
            name: req.file.filename,
        };
        const media = {
            mimeType: req.file.type,
            body: fs.createReadStream(req.file.path),
        };
        oauth2Client.setCredentials({
            access_token: 'ya29.A0ARrdaM8h9AtivI2-d5Vi9dB5vHYq1Cg4oz1S3wC00c3JOunGCESwZ654ZOPld5SHRbFFl09Awd4aaeCL2z9_Vav7HXZc2H-MK8I-iO_UJhr2cn1LsLmzEWrpScbT-M15MK04Lj1NWl_53itzW8rzKJcB2lhvYUNnWUtBVEFTQVRBU0ZRRl91NjFWVVBkWldTbU5HMFBCZ2lFaHlvTmY2Zw0163',
            refresh_token: '1//04BY-kUGL8mRmCgYIARAAGAQSNwF-L9Ir5J7T5dNbvIjap4YM8tQdDoClQJE82ay3eVBth96vN9iWrutv7HWylmqfeFNtMcfY6lo',
            expiry_date: true
        });
        drive.files.create(
            {
                resource: fileMetadata,
                media: media,
                fields: 'id',
            },
            async (err, file) => {
                await drive.permissions.create({
                    fileId: file.data.id,
                    requestBody: {
                        role: "reader",
                        type: "anyone"
                    }
                })
                const result = await drive.files.get({
                    fileId: file.data.id,
                    fields: "webViewLink , webContentLink",
                });
                if (err) {
                    // Handle error
                    console.error(err);
                } else {
                    fs.unlinkSync(req.file.path);
                    res.send({ fileId: file.data.id });
                }
            }
        );

        // res.send({ "hello": "resFile.data" })
    }
    catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router