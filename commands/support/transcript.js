const { doesNotReject } = require('assert');
const { stripIndent } = require('common-tags');
const fs = require('fs');
const { fetchTranscript } = require('reconlx');
const { MessageAttachment } = require('discord.js');
module.exports = {
    name: "transcript",
    enabled: true,
    hideHelp: false,
    aliases: ["st"],
    category: "support",
    restricted: {
        node: "SupportSystem"
    },
    description: "Saves the transcript of a ticket, for references.",
    usage: "",

    run: async function (bot, message, args) {
        if (message.channel.name.search('ticket-') == -1 || message.channel.name.search('ticket-logs') != -1) return message.channel.send("<:DevWarning:821495663422078996> This cannot be used here.")
        fetchTranscript(message, 99)
        .then((data) => {
            const file = new MessageAttachment(data, 'index.html')
            message.channel.send(file);
        })
        

    }
}