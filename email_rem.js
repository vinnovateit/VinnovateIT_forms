var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
var nodemailer = require("nodemailer");
var mongoose = require("mongoose");
var latest_mess = require("./template_aft.js");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
    "mongodb+srv://wimpywarlord:warlord123@cluster0-fzp9u.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "goodmorningGirlfriend",
    },
    function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("CONNECTED");
        }
    }
);
var userSchema = new mongoose.Schema({
    email: String,
    phone: String,
    question: String,
});

var user = mongoose.model("user", userSchema);

// LOGIC
var everyday_mailingList = [];
async function fetchAllEmails() {
    return new Promise((resolve, reject) => {
        user.find({}, async function (err, users) {
            if (err) {
                console.log("NOT FETCHING DATA");
            } else {
                console.log(users);
                for (let i = 0; i < users.length; i++) {
                    everyday_mailingList.push([users[i].email]);
                    // console.log(everyday_mailingList);
                }
                console.log(everyday_mailingList, "$");
                resolve(everyday_mailingList);
            }
        });
    });
}

fetchAllEmails().then((everyday_mailingList) => {
    console.log(everyday_mailingList, "asddsa");

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "greetyourgirlfriend@gmail.com",
            pass: "Mama!@#123",
        },
    });

    everyday_mailingList.forEach((element) => {
        console.log(element);
        var mailOptions = {
            from: "VinnovateIT",
            to: element,
            subject: `Join VinnovateIT at 6:00PM on 20th June.`,
            html: `${latest_mess}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    });
});

app.listen(process.env.PORT || 8000, function () {
    console.log("SERVER 8000 HAS STARTED");
});
