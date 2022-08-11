const fs = require('fs');

module.exports = {
    name: "restart",
    enabled: true,
    hideHelp: false,
    aliases: [],
    category: "admin",
    restricted: {
        node: "RestartCommand"
    },
    description: "Restarts the bot",
    usage: "",
    run: async (bot, message, args) => {
        try {
            
            await message.channel.send(`<:DevWarning:821495663422078996> Bot is restarting...`)
                .then(msg => {
                    var restart = {
                        "channel": msg.channel.id,
                        "messageid": msg.id
                    }
                    fs.writeFile('restart', JSON.stringify(restart), function(err) {
                        if (err) throw err;
                        process.exit();
                    })
                })
        } catch(e) {
            return message.channel.send(`ERROR: ${e.message}`)
        }
    }
}