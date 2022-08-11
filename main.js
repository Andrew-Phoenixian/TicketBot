/*
# INITIALIZATION INDEX #
*/

// Dependencies

const { timeLog } = require('console');
const { Client, Collection } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv').config();

// Bot Variables

const bot = new Client();

var bot_config = require('./configuration.json')
var user_config = require('./user_config.json')

const { createTicket } = require('./modules/functions.js')

var prefix = bot_config.prefix

// Creates the bot commands and aliases collections
bot.commands = new Collection();
bot.aliases = new Collection();

// Functions

// Log Functions

const { AlertLog, InfoLog } = require('./modules/functions.js')

// Functions

function GetCurrentTimeAndDate() {
    let date_obj = new Date();

    let date = ("0" + date_obj.getDate()).slice(-2);
    let month = ("0" + (date_obj.getMonth() + 1)).slice(-2);
    let year = date_obj.getFullYear();
    let hours = date_obj.getHours();
    let minutes = date_obj.getMinutes();
    let seconds = date_obj.getSeconds();

    return date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds
}

// Events

// Message event. Fired when a message is sent somewhere.
bot.on("message", async (message) => {
    if (message.author.bot || !message.guild) return; // Ignore messages sent by bots or if guild property is not available.

    if (!message.content.startsWith(prefix)) {
        if (message.channel.name == "request-ticket") {
            createTicket(bot, message.content, message.member, true)
            message.delete()
            DenyTesting = true
        }
        return;
    }

    const argsSplit = message.content.slice(prefix.length).split(" "); // ["k!ban", "dad"]
    let cmd = argsSplit.shift().toLowerCase();

    let command = bot.commands.get(cmd);
    if (!command) command = bot.commands.get(bot.aliases.get(cmd));

    // Bot testing mode check

    var DenyTesting = false

    if (command) {
        if (bot_config.TestingMode) {
            if (user_config[message.author.id]) {
                if (!user_config[message.author.id]["AllAccess"] && !user_config[message.author.id]["TestingAccess"]) {
                    message.channel.send("<:Warning:838822306326249492> This bot is in testing mode. You have permission nodes but not for testing access. Talk to Voidex for access.")
                    InfoLog(Bot, "User: " + message.author.id + " attempted to run a command during testing.")
                    DenyTesting = true;
                }
            } else {
                message.channel.send("<:Warning:838822306326249492> This bot is in testing mode. You do not have access to this command at this time.")
                InfoLog(bot, "User: " + message.author.id + " attempted to run a command during testing.")
                DenyTesting = true;
            }
        }
    }

    // Permission checks
    if (command) {
        if (command.restricted) {
            var permitted = false;

            if (command.restricted.permissions) {
                command.restricted.permissions.forEach((perm) => {
                    if (message.member.hasPermission(perm)) permitted = true;
                });
            }

            if (command.restricted.node) {
                if (user_config[message.author.id]) {
                    if (user_config[message.author.id][command.restricted.node] == true) {
                        permitted = true
                    } else if (user_config[message.author.id]["AllAccess"] == true) {
                        permitted = true
                    }
                }
            }

            if (command.restricted.node) {
                if (user_config["default"][command.restricted.node] == true) {
                    permitted = true
                }
            }

            if (permitted == true && DenyTesting == false) {
                command.run(bot, message, argsSplit);
            } else if (permitted == false) {
                // command denied
                // access error
            }
        } else {
            if (DenyTesting == false) {
                command.run(bot, message, argsSplit);
            }
        }
    } else {
        // command doesent exist
    }
}); //hello

bot.on('ready', () => {
    bot.user.setPresence({ activity: { name: '?help' }, status: 'online' })

    // Logging
    if (bot_config.TestingMode) {
        AlertLog(bot, "Bot is in testing mode. Commands will be unavailable to the public.")
    }

    // Check if the bot was restarted
    if (fs.existsSync("./restart")) {
        const restartInfo = JSON.parse(fs.readFileSync("./restart", "utf8"));
        bot.channels.cache
            .get(restartInfo.channel)
            .messages.fetch(restartInfo.messageid)
            .then((m) => {
                m.edit(`<:DevUpdated:821495663371091998> Bot was restarted.`);
                fs.unlinkSync("./restart");
            });
    };

    InfoLog(bot, "Bot started at " + GetCurrentTimeAndDate())
})

// Required modules
require(`./modules/command.js`)(bot);

bot.login(process.env.BOTTOKEN)