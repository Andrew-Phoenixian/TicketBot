const fs = require('fs');
const { createTicket } = require('../../modules/functions.js')
const guildTicketSystem = require('../../guildTicketSystem.json')

function getUserStaffLevel(Member, Levels, Callback) {
    for (i=0; i < Levels.length; i++) {
        if (Member.roles.cache.some(role => role.id === Levels[i])) {
            Callback(i.toString())
        }
    }
}

module.exports = {
    name: "onduty",
    enabled: true,
    hideHelp: false,
    aliases: ["ond"],
    restricted: {
        node: "SupportSystem"
    },
    category: "support",
    description: "Registers the staff running the command as on-duty.",
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
                    debounce = true
                    console.log("debounce true!")
                }
            }
        }

        if (!debounce) { // True if user has been found on-duty already.
            getUserStaffLevel(message.member, guildTicketSystem[message.guild.id].Levels, function (StaffLevel) {
                if (!guildTicketSystem[message.guild.id].onDuty[StaffLevel]) {
                    guildTicketSystem[message.guild.id].onDuty[StaffLevel] = []
                    guildTicketSystem[message.guild.id].onDuty[StaffLevel].push(message.member.id)
                    console.log(guildTicketSystem[message.guild.id].onDuty[StaffLevel].push(message.member.id))
                    fs.writeFileSync('./guildTicketSystem.json', JSON.stringify(guildTicketSystem))
                    message.channel.send("<:DevUpdated:821495663371091998> You are now on-duty.")
                } else {
                    guildTicketSystem[message.guild.id].onDuty[StaffLevel].push(message.member.id)
                    fs.writeFileSync('./guildTicketSystem.json', JSON.stringify(guildTicketSystem))
                    message.channel.send("<:DevUpdated:821495663371091998> You are now on-duty.")
                }

                var tickets = require('../../tickets.json')
                for(i=0; i < tickets.length; i++) {
                    if(tickets[i].staffMember == "None" && tickets[i].ticketDescription.search("force created") == -1) {
                        tickets[i].staffMember = message.author.id
                        fs.writeFileSync("./tickets.json", JSON.stringify(tickets))

                        message.channel.send("<:DevFeature:821495663450783804> You have been auto-assigned to ticket-id **" + tickets[i].ticketId + "**.")
                        message.guild.channels.resolve(tickets[i].ticketChannel).send("<:DevFeature:821495663450783804> <@" + message.author.id + "> You have been auto-assigned to this ticket.")
                        message.guild.channels.resolve(tickets[i].ticketChannel).updateOverwrite(message.author.id, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true
                        })
                    }
                }
            })
        } else {
            message.channel.send("<:DevWarning:821495663422078996> You are already on-duty.")
        }
    }
}