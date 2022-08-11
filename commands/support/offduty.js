const fs = require('fs');
const { createTicket } = require('../../modules/functions.js')
const guildTicketSystem = require('../../guildTicketSystem.json');
const { User } = require('discord.js');

module.exports = {
    name: "offduty",
    enabled: true,
    hideHelp: false,
    aliases: ["offd"],
    category: "support",
    restricted: {
        node: "SupportSystem"
    },
    description: "Removes the staff running the command as on-duty.",
    usage: "",
    run: async (bot, message, args) => {
        if (!guildTicketSystem[message.guild.id]) return message.channel.send("<:DevWarning:821495663422078996> This command is not usable in this server.")
        var IsAllowed = false

        for (const StaffLevel of guildTicketSystem[message.guild.id].Levels) {
            if (message.member.roles.cache.get(StaffLevel)) {
                IsAllowed = true
            }
        }

        if (!IsAllowed) return message.channel.send("<:DevWarning:821495663422078996> You're not supposed to use this command.").then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 5000);
        })

        var tableLength = Object.keys(guildTicketSystem[message.guild.id].onDuty).length

        var debounce = false;
        for (i = 0; i < tableLength; i++) {
            for (b = 0; b < guildTicketSystem[message.guild.id].onDuty[i.toString()].length; b++) {

                if (guildTicketSystem[message.guild.id].onDuty[i.toString()][b] === message.author.id) {
                    message.channel.send("<:DevUpdated:821495663371091998> You are now off-duty.")
                    debounce = true
                    guildTicketSystem[message.guild.id].onDuty[i.toString()].splice(b, 1)
                    fs.writeFileSync('./guildTicketSystem.json', JSON.stringify(guildTicketSystem));
                }
            }
        }

        if(!debounce) {
            message.channel.send("<:DevWarning:821495663422078996> You are not on-duty.")
        }
    }
}