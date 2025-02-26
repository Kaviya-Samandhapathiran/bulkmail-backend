const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")


const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://kaviyajain0030:0310@cluster0.iplds.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function () {
    console.log("Connected to db")
}).catch(function () {
    console.log("Failed to connect")
})

const credential = mongoose.model("credential", {}, "bulkmail")

app.post("/sendmail", function (req, res) {

    var msg = req.body.msg
    var emaillist = req.body.emaillist

    credential.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });

        new Promise(async function (resolve, reject) {
            try {
                for (i = 0; i < emaillist.length; i++) {
                    await transporter.sendMail({
                        from: "kaviya0030@gmail.com",
                        to: emaillist[i],
                        subject: "A message from bulk mail app",
                        text: msg
                    }
                    )
                    console.log("Email sent to " + emaillist[i])
                }
                resolve("Success")
            }
            catch (error) {
                reject("Error")
                console.log(error)
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })
    
    }).catch(function (error) {
        console.log(error)
    })
})


app.listen(5000, function () {
    console.log("Server started...")
})