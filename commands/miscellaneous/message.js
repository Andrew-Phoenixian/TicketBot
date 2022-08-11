const { MessageEmbed, MessageCollector } = require("discord.js");

module.exports = {
    name: "message",
    enabled: true,
    hideHelp: false,
    aliases: ["msg"],
    category: "miscellaneous",
    description: "Creates a standard embed message in red.",
    restricted: {
        node: "MessageCommand"
    },
    usage: "",
    run: async (bot, message, args) => {
        const Embed = new MessageEmbed()

        const filter = m => m.author.id == message.author.id

        message.channel.send("Title of embed?").then(msg => {
            const collector = message.channel.createMessageCollector(filter, { max: 1, time: 15000 })

            collector.on('collect', m => {
                Embed.setTitle(m.content)
                m.delete()
                msg.edit("Content of embed?")
                const collector = message.channel.createMessageCollector(filter, { max: 1, time: 15000 })

                collector.on('collect', m => {
                    Embed.setDescription(m.content)
                    Embed.setAuthor("Project: Homecoming")
                    Embed.setColor("RED")
                    m.delete()
                    msg.edit("What channel to send to? (Id)")
                    const collector = message.channel.createMessageCollector(filter, { max: 1, time: 15000 })

                    collector.on('collect', m => {
                        message.guild.channels.resolve(m.content).send(Embed)                        
                    })
                })
            })
        })
    }
}