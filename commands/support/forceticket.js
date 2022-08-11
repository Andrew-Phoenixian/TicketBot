const fs = require('fs');
const { createTicket } = require('../../modules/functions.js')

module.exports = {
    name: "forceticket",
    enabled: true,
    hideHelp: false,
    aliases: ["ft"],
    category: "support",
    restricted: {
        node: "SupportSystem"
    },
    description: "Force a ticket to be created, this will be without a staff member assigned.",
    usage: "",
    run: async (bot, message, args) => {
        createTicket(bot, "This ticket was force created, therefore having no description.", message.member, false)
        message.channel.send("<:DevUpdated:821495663371091998> Ticket created.")
    }
}