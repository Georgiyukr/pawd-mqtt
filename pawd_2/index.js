const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json("SERVER for PAWD_2 is running");
});

let mqtt = require("mqtt");

let id = "5f95bc19606f0f20857ea06f";

var options = {
    host: "e7119a5329754541afb06ea316cdb0b3.s1.eu.hivemq.cloud",
    port: 8883,
    protocol: "mqtts",
    username: "pawd_atl_2020",
    password: "Pawdgtatl2020",
};

// const URL = "http://f2c0b86adfca.ngrok.io"
// const URL = "mqtt://localhost:1883"
// const URL = "broker.hivemq.com:1883"
// let client = mqtt.connect(URL, options);
let client = mqtt.connect(options);
// let client = mqtt.connect("http://localhost:1883", options);

client.on("connect", function () {
    console.log("PAWD 2 MQTT connected");
    client.subscribe(`PAWD/Inactive/Open/${id}`, { qos: 2 }, function (err) {
        console.log("subscribed to PAWD/Inactive/Open");
    });

    client.subscribe(`PAWD/Active/Open/${id}`, { qos: 2 }, function (err) {
        console.log("subscribed to PAWD/Active/Open");
    });
});

client.on("message", function (topic, message) {
    if (topic === `PAWD/Inactive/Open/${id}`) {
        console.log("PAWD/Inactive/Open Opening door", Date.now());
        client.publish(`PAWD/Inactive/Opened/${id}`, "675 Ponce Door Opened", {
            qos: 2,
        });
        setTimeout(() => {
            client.publish(`PAWD/Session/Start`, JSON.stringify({ id }));
            console.log("Session Started");
        }, 5000);
    } else if (topic === `PAWD/Active/Open/${id}`) {
        console.log("PAWD/Active/Open Opening door");
        client.publish(`PAWD/Active/Opened/${id}`, "675 Ponce Door Opened", {
            qos: 2,
        });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`SERVER for PAWD_2 is running on port ${port}!`);
});

module.exports = app;
