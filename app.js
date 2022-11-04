import express from "express";
import https from "https";
import dirname from 'path';
import bodyParser from "body-parser";

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(dirname.resolve() + "/signup.html");
});
app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailID = req.body.emailID;
    const data = {
        members: [
            {
                email_address: emailID,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    console.log(firstName + " " + lastName + " " + emailID);
    const url = "https://us21.api.mailchimp.com/3.0/lists/86aac877c1";
    const options = {
        method: "POST",
        auth: "Rahul:03187bfbef94ea5c7d578ca68d43b8a4-us21"
    }
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(dirname.resolve() + "/success.html");
        }
        else {
            res.sendFile(dirname.resolve() + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});
app.post("/failure", function (req, res) {
    res.redirect("/");
});
app.listen(process.env.PORT || 3000, function (req, res) {
    console.log("Server is running on 3000");
});

// Api key
//03187bfbef94ea5c7d578ca68d43b8a4-us21
// uniqeID/ListID
// 86aac877c1
//prefix
// us21