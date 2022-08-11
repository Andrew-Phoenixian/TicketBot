const { stripIndent } = require('common-tags');
const fs = require('fs');

module.exports = {
    name: "escalate",
    enabled: true,
    hideHelp: false,
    aliases: [],
    category: "support",
    restricted: {
        node: "SupportSystem"
    },
    description: "Escalates the ticket to another staff member. This will assign the ticket to someone on a higher rank and add them to the ticket. It will not remove any staff from ticket, as they can provide information.",
    usage: "",

    run: async function (bot, message, args) {
        if (message.channel.name.search('ticket-') == -1 || message.channel.name.search('ticket-logs') != -1) return message.channel.send("<:DevWarning:821495663422078996> This cannot be used here.")
        message.channel.send("<a:Loading1:858106520139071488> This ticket is being escalated...").then(msg => {
            var guildTicketSystem = require('../../guildTicketSystem.json')
            var tickets = require('../../tickets.json')
          
            if (guildTicketSystem[message.guild.id].onDuty["1"].length !== 0) {
                let devId = guildTicketSystem[message.guild.id].onDuty["1"][0];

                for (i = 0; i < tickets.length; i++) {
                    if(tickets[i].ticketChannel == message.channel.id) {
                        tickets[i].staffMember = devId
                        fs.writeFileSync('./tickets.json', JSON.stringify(tickets))
                        message.channel.send(`<:DevUpdated:821495663371091998> Ticket has been escalated to <@${devId}>.`)
                    }
                }                                
            } else {
        
               return msg.edit("<:DevWarning:821495663422078996> No-one is on-duty for escalation.")
            }
        })
    }
}