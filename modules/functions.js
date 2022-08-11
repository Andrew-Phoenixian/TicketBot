const { arrayFill } = require('ascii-table');
const { MessageEmbed } = require('discord.js')

const sp = require('synchronized-promise');
const fs = require('fs');

const bot_config = require('../configuration.json')
var guildTicketSystem = require('../guildTicketSystem.json')
var tickets = require('../tickets.json');
const { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } = require('constants');

module.exports = {

    AlertLog: function (bot, Message) {
        bot.channels.cache.get(bot_config.Logs).send("<:DevWarning:821495663422078996> " + Message)
    },

    InfoLog: function (bot, Message) {
        bot.channels.cache.get(bot_config.Logs).send("<:DevUpdated:821495663371091998> " + Message)
    },

    // Support functions

    getSupportCategory: function (bot, guild, callback) {
        var debounce = false
        guild.channels.cache.forEach(channel => {
            if (channel.type == "category" && channel.name == "Tickets") {
                callback(channel)
                debounce = true
            }
        })

        if (!debounce) this.AlertLog(bot, "This server has no support category;" + guild.name)
    },

    closeTicket: function (bot, message, ticket) {
        message.guild.channels.cache.find(channel => channel.id === ticket.ticketChannel).delete()

        if (message.guild.channels.cache.find(channel => channel.name === "ticket-logs")) {
            tickets = require('../tickets.json')
            message.guild.channels.cache.find(channel => channel.name === "ticket-logs").send(" Ticket closed by " + message.author.tag +", ID: " + ticket.ticketId + ".")
        }

        message.guild.members.fetch(ticket.requester)
            .then(member => {
                member.roles.remove(message.guild.roles.cache.find(role => role.name === "TicketActive"))
            })

        if (guildTicketSystem[message.guild.id].Stats[message.author.id]) {
            guildTicketSystem[message.guild.id].Stats[message.author.id].TicketsClosed = guildTicketSystem[message.guild.id].Stats[message.author.id].TicketsClosed + 1
            guildTicketSystem[message.guild.id].Stats[message.author.id].Username = message.author.tag
            fs.writeFileSync('./guildTicketSystem.json', JSON.stringify(guildTicketSystem))
        } else {
            guildTicketSystem[message.guild.id].Stats[message.author.id] = {
                "Username": message.author.tag,
                "TicketsClosed": 1
            }
            fs.writeFileSync('./guildTicketSystem.json', JSON.stringify(guildTicketSystem))
        }
    },

    createTicket: function (bot, description, requester, autoassign) {
        // requester = guildmember, autoassign = bool
        var GuildTest = requester.guild

        module.exports.getSupportCategory(bot, GuildTest, function (SupportCategory) {
            var foundStaff = false
            var selectedStaff = null
            if (autoassign) {
                for (i = 0; i < Object.keys(guildTicketSystem[requester.guild.id].onDuty).length; i++) {
                    if (foundStaff) continue;
                    if (guildTicketSystem[requester.guild.id].onDuty[i.toString()].length != 0) {
                        foundStaff = true
                        var RandomStaffId = guildTicketSystem[requester.guild.id].onDuty[i.toString()][Math.floor(Math.random() * guildTicketSystem[requester.guild.id].onDuty[i.toString()].length)]

                        //selectedStaff = requester.guild.members.cache.get(RandomStaffId)
                        var member = requester.guild.members.fetch(RandomStaffId)
                            .then(asd => {
                                selectedStaff = asd
                            })

                        let asyncFunction = (value) => {
                            return new Promise((resolve, reject) => {
                                requester.guild.members.fetch(value).then(member => {
                                    resolve(member)
                                })
                                    .catch(err => {
                                        reject(err)
                                    })
                            })
                        }

                        let syncFunc = sp(asyncFunction)

                        selectedStaff = syncFunc(RandomStaffId)
                    }
                }

            } else {
                module.exports.InfoLog(bot, "Ticket created for server: " + requester.guild.name + " by " + requester.user.username)
            }

            guildTicketSystem[requester.guild.id].Tickets = guildTicketSystem[requester.guild.id].Tickets + 1

            var PermissionOverwrites = [
                {
                    id: requester.guild.roles.cache.find(role => role.name === "@everyone").id,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: requester.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                }
            ]

            if (foundStaff) {
                PermissionOverwrites.push({ id: selectedStaff.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"] })
            }

            let asyncFunction = () => {
                return new Promise((resolve, reject) => {
                    requester.guild.channels.create('ticket-' + guildTicketSystem[requester.guild.id].Tickets, {
                        reason: 'Ticket created.',
                        parent: SupportCategory.id,
                        permissionOverwrites: PermissionOverwrites
                    })
                        .then(channel => {
                            const TicketObject = {
                                "ticketId": guildTicketSystem[requester.guild.id].Tickets,
                                "ticketChannel": channel.id,
                                "ticketGuild": channel.guild.id,
                                "requester": requester.id,
                                "createdBy": requester.user.tag,
                                "staffMember": foundStaff ? selectedStaff.id : "None",
                                "ticketDescription": description
                            }

                            tickets.push(TicketObject)
                            fs.writeFileSync('./tickets.json', JSON.stringify(tickets))
                            module.exports.informTicketChannel(bot, requester.guild.channels.cache.find(channel => channel.name === "ticket-" + guildTicketSystem[requester.guild.id].Tickets), TicketObject)
                            if (!foundStaff) {
                                channel.send("<:DevWarning:821495663422078996> There are no staff available for this ticket. They will be assigned once they get online.")
                            } else {
                                channel.send("<:DevFeature:821495663450783804> <@" + selectedStaff.id + "> You have been automatically assigned this ticket.")
                            }
                            resolve()
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
            }

            let syncFunc = sp(asyncFunction)

            syncFunc()

            if (requester.guild.roles.cache.find(role => role.name === "TicketActive")) {
                requester.roles.add(requester.guild.roles.cache.find(role => role.name === "TicketActive").id)
            }
            // ticket-logs

            if (requester.guild.channels.cache.find(channel => channel.name === "ticket-logs")) {
                tickets = require('../tickets.json')
                requester.guild.channels.cache.find(channel => channel.name === "ticket-logs").send("<:DevFeature:821495663450783804> Ticket created, ID: " + guildTicketSystem[requester.guild.id].Tickets + ". Requester: " + requester.user.tag + " Description: " + tickets[guildTicketSystem[requester.guild.id].Tickets - 1].ticketDescription)
                if (foundStaff) {
                    requester.guild.channels.cache.find(channel => channel.name === "ticket-logs").send("<:DevUpdated:821495663371091998> Ticket changed, staff member assigned to ticket: " + guildTicketSystem[requester.guild.id].Tickets + ". Staff member: " + selectedStaff.user.tag)
                }
            }

            fs.writeFileSync('./guildTicketSystem.json', JSON.stringify(guildTicketSystem));
        })
    },

    informTicketChannel: function (bot, channel, ticket) {
        const messageEmbed = new MessageEmbed()
        messageEmbed.setTitle('Ticket created: ID-' + ticket.ticketId)
        messageEmbed.setDescription('This ticket was created by ' + ticket.createdBy)
        messageEmbed.setColor(0x0fd7a5)
        messageEmbed.setAuthor("Project: Homecoming Ticket System", "http://www.newdesignfile.com/postpic/2013/04/free-vector-hands-holding_391702.jpg", "https://www.youtube.com/watch?v=iik25wqIuFo")
        messageEmbed.addField("Ticket Description", ticket.ticketDescription, true)
        messageEmbed.setFooter("Ticket System by Project: Homecoming Dev Team")
        channel.send(messageEmbed)
    },


    formatDate: function (date) {
        return new Intl.DateTimeFormat('en-US')
    }
}