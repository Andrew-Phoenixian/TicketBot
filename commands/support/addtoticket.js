const fs = require('fs');

module.exports = {
    name: "addtoticket",
    enabled: true,
    hideHelp: false,
    aliases: ["add"],
    category: "support",
    restricted: {
        node: "SupportSystem"
    },
    description: "Adds another member to your ticket.",
    usage: "addtoticket <username>",
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send("<:DevWarning:821495663422078996> You need to give a name of the member you'd wish to add to the ticket.")

        if (message.channel.name.search("ticket-") == 0) {
            const UserToSearchFor = args.join(' ')
            var Found = false

            message.guild.members.fetch({ query: UserToSearchFor, limit: 1 })
                .then(Collection => {
                    console.log(Collection.first().id)
                    message.channel.updateOverwrite(Collection.first().id, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    })
                        .then(() => message.channel.send("<:DevUpdated:821495663371091998> Successfully added " + Collection.first().displayName + "."))
                        .catch(err => message.channel.send("<:DevWarning:821495663422078996> An error occured adding that member: " + err))
                })
                .catch(() => {
                    message.channel.send("<:DevWarning:821495663422078996> Could not find anyone, please try again?")
                });


        } else {
            return message.channel.send("<:DevWarning:821495663422078996> This channel cannot be altered.")
        }
    }
}