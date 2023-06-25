const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.status(200).sendFile(__dirname + "/signup.html");
});
app.post("/", (req, res) => {
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.Email;
    console.log(firstName, lastName, email);
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
        update_existing: true,
    };
    const jsonData = JSON.stringify(data);
    const url = process.env.URL;
    // const options = {
    //     method: "POST",
    //     auth: <Check in .env file>,
    // };
    // const request = https.request(url, options, (response) => {
    //     if (response.statusCode === 200) {
    //         res.sendFile(__dirname + "/success.html");
    //     } else {
    //         res.sendFile(__dirname + "/failure.html");
    //     }
    //     response.on("data", (data) => {
    //         console.log(JSON.parse(data));
    //     });
    // });
    // request.write(jsonData);
    // request.end();
    let obj = {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: process.env.API_KEY_AUTH,
        },
        body: jsonData,
    };
    let p = fetch(url, obj);
    p.then((response) => {
        console.log(response);
        if (response.status === 200) {
            res.sendFile(path.join(__dirname, "success.html"));
        } else {
            res.sendFile(path.join(__dirname, "failure.html"));
        }
        return response.json();
    }).then((value) => {
        console.log(value);
    });
});
app.post("/failure", (req, res) => {
    res.redirect("/");
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at localhost:${port}`);
});
