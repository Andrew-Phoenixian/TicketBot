const fs = require('fs');
const { closeTicket } = require('../../modules/functions.js')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "assign",
    enabled: true,
    hideHelp: false,
    aliases: ["view"],
    category: "support",
    restricted: {
        node: "SupportSystem"
    },
    description: "Assigns another staff to a ticket. Make sure to add them first to the ticket.",
    usage: "assign @MENTION",
    run: async (bot, message, args) => {
        var tickets = require('../../tickets.json')

        if (!args[0]) {
            for (i = 0; i < tickets.length; i++) {
                if(tickets[i].ticketChannel == message.channel.id) {
                    tickets[i].staffMember = message.author.id

                    fs.writeFileSync('./tickets.json', JSON.stringify(tickets))
                    message.channel.send("<:DevUpdated:821495663371091998> Ticket has been assigned to you.")
                }
            }
        } else {
            if (message.mentions.members.first()) {
                for (i = 0; i < tickets.length; i++) {
                    if(tickets[i].ticketChannel == message.channel.id) {
                        tickets[i].staffMember = message.mentions.members.first().id
    
                        fs.writeFileSync('./tickets.json', JSON.stringify(tickets))
                        message.channel.send("<:DevUpdated:821495663371091998> Ticket has been assigned to user-id: " + message.mentions.members.first().id +".")

                        message.guild.channels.cache.get(tickets[i].ticketChannel).send("<:DevFeature:821495663450783804> <@" + message.mentions.members.first().id + "> You have been assigned to this ticket by another staff member.")
                    }
                }
            }
        }
        
        for (i = 0; i < tickets.length; i++) {
            if (tickets[i].ticketId == args[0] && tickets[i].ticketGuild == message.guild.id) {
                const messageEmbed = new MessageEmbed()
                messageEmbed.setTitle('Ticket id: ' + tickets[i].ticketId)
                messageEmbed.setDescription('This ticket was created by ' + tickets[i].createdBy)
                messageEmbed.setColor(0x0fd7a5)
                messageEmbed.setAuthor("Project: Homecoming Ticket System")
                messageEmbed.addField("Ticket Description", tickets[i].ticketDescription, true)
                if (tickets[i].staffMember != "None") {
                    messageEmbed.addField("Ticket Staff", tickets[i].staffMember.displayName)
                }
                messageEmbed.setFooter("Ticket System by Project: Homecoming Dev Team")
                message.channel.send(messageEmbed)
            }
        }
    }
}