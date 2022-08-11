const { getMember, formatDate } = require("../../modules/functions.js");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const user_config = require('./../../user_config.json');

module.exports = {
    name: "nodes",
    enabled: true,
    hideHelp: false,
    aliases: [],
    category: "miscellaneous",
    description: "Gives you a list of your own node permissions.",
    usage: "",
    run: async (bot, message, args) => {
        if (!user_config[message.author.id]) return message.channel.send(":x: You have no node permissions.")

        var member = message.member

        var nodes = ""

        for (var node in user_config[member.user.id]) {
            nodes = nodes + node + ": " + user_config[member.user.id][node]+ "\n"
        }

        // User variables
        const created = member.user.createdAt

        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)

            .addField("User Nodes", stripIndents`**> Nodes:** ${nodes}`, true)

            .setTimestamp()


        if (member.user.presence.game)
            embed.addField('Currently playing', `**> Name:** ${member.user.presence.game.name}`)

        message.channel.send(embed)
    }
}