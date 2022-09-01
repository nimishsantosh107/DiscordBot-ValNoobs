const io = require("socket.io-client");
const Discord = require("discord.js");
require("dotenv").config();

// DISCORD SETUP
const client = new Discord.Client(process.env.DISCORD_BOT_TOKEN);
client.login("");

var socket = null;

//DISCORD JS HANDLERS
var channels = {};

client.on("ready", async () => {
    console.log("BOT RUNNING");

    //SAVE REQD CHANNELS HERE
    channels.home_test = await client.channels.cache.get("851582286209220638");
    channels.vn_general = await client.channels.cache.get("837304449919614976");
    channels.vn_valorant = await client.channels.cache.get("750194877903405126");
    channels.vn_minecraft = await client.channels.cache.get("834802118825082952");

    sendMessageToChannel("vn_general", "TEST_MESSAGE");

    // //SOCKET IO SETUP
    socket = io.connect("https://valnoobs-mc.herokuapp.com/");
    socket.on("connect", async function () {
        console.log("CONNECTED TO  RELAY SERVER");

        //SOCKET IO HANDLERS (For MC Server) -----
        // socket.emit('status-req');

        socket.on("status-res", function (status) {
            if (status === "OFFLINE") {
                sendMessageToChannel("home_test", `🔴  No Servers Running`);
            } else {
                sendMessageToChannel("home_test", `🟢  ${status} Currently Online`);
            }
        });

        socket.on("online", function (onlineid) {
            sendMessageToChannel("home_test", `🟢  ${onlineid} Currently Online`);
        });

        socket.on("offline", function () {
            sendMessageToChannel("home_test", `🔴  No Servers Running`);
        });
        //SOCKET IO HANDLERS (For MC Server) -----
    });
});

client.on("message", (msg) => {
    console.log(msg.content);
    if (msg.content === "xyz") {
        socket.emit("status-req");
    }
});
//UTILS
const sendMessageToChannel = function (channel, message) {
    // console.log(message);
    channels[channel].send(message);
};
