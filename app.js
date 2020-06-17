var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
var nodemailer = require("nodemailer");
var mongoose = require("mongoose");
var message = require("./template.js");

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

app.get("/", function (req, res) {
    res.render("home_page.ejs");
});

app.post("/", function (req, res) {
    console.log("asdasd");
    console.log(req.body);

    res.redirect("/");

    // SENDING MAIL
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "wimpycodes@gmail.com",
            pass: "viit_is_the_best",
        },
    });

    var mailOptions = {
        from: "wimpycodes@gmail.com",
        to: req.body.email,
        subject: `Join VinnovateIT at 6:00PM on 20th June.`,
        html: `${message}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });

    // PUSHING DATA INTO THE DATABASE
    user.create(
        {
            email: req.body.email,
            phone: req.body.phone,
            question: req.body.question,
        },
        function (err, yolo) {
            if (err) {
                console.log("DATA IS NOT PUSHED");
            } else {
                console.log("DATA HAS BEEN PUSHED");
            }
        }
    );
});

app.listen(process.env.PORT || 8000, function () {
    console.log("SERVER 8000 HAS STARTED");
});
