const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "stats",
    enabled: true,
    hideHelp: false,
    aliases: [],
    category: "support",
    restricted: {
        node: "SupportSystem"
    },
    description: "Views ticket stats of the server of which staff member has completed most tickets.",
    usage: "",
    run: async (bot, message, args) => {
        var guildTicketSystem = require('../../guildTicketSystem.json')

        var GuildObj = guildTicketSystem[message.guild.id]

        const messageEmbed = new MessageEmbed()
        messageEmbed.setTitle("Staff Ticket Stats")
        messageEmbed.setDescription("This panel show various stats on various members.")
        messageEmbed.setColor(0x0fd7a5)
        messageEmbed.setAuthor("Project: Homecoming Ticket System")

        messageEmbed.setFooter("Ticket System by Project: Homecoming")

        for (const Id in GuildObj.Stats) {
            messageEmbed.addField(GuildObj.Stats[Id].Username, "Tickets closed: " + GuildObj.Stats[Id].TicketsClosed)
        }

        message.channel.send(messageEmbed)
    }
}