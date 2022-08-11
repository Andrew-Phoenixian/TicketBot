const fs = require('fs');
const { closeTicket } = require('../../modules/functions.js')

var tickets = require('../../tickets.json')

module.exports = {
    name: "closeticket",
    enabled: true,
    hideHelp: false,
    aliases: ["ct"],
    category: "support",
    restricted: {
        node: "SupportSystem"
    },
    description: "Close a ticket.",
    usage: "closeticket [channel id]",
    run: async (bot, message, args) => {
        if (!args[0]) {
            if (message.channel.name.search("ticket-") == 0) {
                for (i = 0; i < tickets.length; i++) {
                    if (tickets[i].ticketChannel == message.channel.id) {
                        message.channel.send("<:DevWarning:821495663422078996> This ticket is being closed.")

                        const copy = tickets[i]

                        setTimeout(() => {
                            closeTicket(bot, message, copy)
                        }, 5000);
                    }
                }
            }
        } else {
            for (i = 0; i < tickets.length; i++) {
                if (tickets[i].ticketChannel == args[0]) {

                    const copy = tickets[i]
                    message.channel.send("Closing ticket...")
                    message.guild.channels.cache.get(tickets[i].ticketChannel).send("<:DevWarning:821495663422078996> This ticket is being closed.").then(() => {
                        setTimeout(() => {
                            closeTicket(bot, message, copy)
                        }, 5000);
                    })
                }
            }
        }
    }
}