module.exports = {
    name: "ping",
    enabled: true,
    hideHelp: false,
    aliases: [],
    category: "miscellaneous",
    description: "Returns latency and API ping",
    usage: "",
    run: async (bot, message, args) => {
            const m = await message.channel.send(`<:DevWarning:821495663422078996> Fetching ping...`)
            m.edit(`Client Latency: ${Math.floor(m.createdTimestamp - message.createdTimestamp)}ms\nAPI Latency: ${Math.round(bot.ws.ping)}ms`)
    }
}