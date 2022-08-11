const fs = require('fs');
const { closeTicket } = require('../../modules/functions.js')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "viewticket",
    enabled: true,
    hideHelp: false,
    aliases: ["view"],
    category: "support",
    restricted: {
        node: "SupportSystem"
    },
    description: "Views a ticket and gives information about it.",
    usage: "viewticket <id>",
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send("<:DevWarning:821495663422078996> You need to give a ticket id with the command.")
        
        var tickets = require('../../tickets.json')
        
        for (i = 0; i < tickets.length; i++) {
            if (tickets[i].ticketId == args[0] && tickets[i].ticketGuild == message.guild.id) {
                const messageEmbed = new MessageEmbed()
                messageEmbed.setTitle('Ticket id: ' + tickets[i].ticketId)
                messageEmbed.setDescription('This ticket was created by ' + tickets[i].createdBy)
                messageEmbed.setColor(0x0fd7a5)
                messageEmbed.setAuthor("Project: Homecoming Ticket System", "http://www.newdesignfile.com/postpic/2013/04/free-vector-hands-holding_391702.jpg", "https://www.youtube.com/watch?v=iik25wqIuFo")
                messageEmbed.addField("Ticket Description", tickets[i].ticketDescription, true)
                if (tickets[i].staffMember != "None") {
                    
                    messageEmbed.addField("Ticket Staff", message.guild.members.resolve(tickets[i].staffMember).user.tag)
                }
                messageEmbed.setFooter("Ticket System by Project: Homecoming Dev Team")
                message.channel.send(messageEmbed)
            }
        }
    }
}