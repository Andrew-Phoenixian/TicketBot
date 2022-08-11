const { getMember, formatDate } = require("../../modules/functions.js");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const user_config = require('./../../user_config.json');

module.exports = {
    name: "whois",
    enabled: true,
    hideHelp: false,
    aliases: ["userinfo", "user", "who"],
    category: "miscellaneous",
    description: "Get's infomation on a user",
    usage: "[username | id | mention]",
    run: async (bot, message, args) => {
        const member = getMember(message, args.join(" "));
            
            // Member variables
            const joined = member.joinedAt;
            const roles = member.roles.cache
                .filter(r => r.id !== message.guild.id)
                .map(r => r)
                .join(", ") || "none";

            // User variables
            const created = member.user.createdAt

            const embed = new MessageEmbed()
                .setFooter(member.displayName, member.user.displayAvatarURL)
                .setThumbnail(member.user.displayAvatarURL)
                .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)

                .addField("Member information", stripIndents`**> Display name:** ${member.displayName}
            **> Joined at:** ${joined}
            **> Roles:** ${roles}`, true)

                .addField("User information", stripIndents`**> ID:** ${member.user.id}
            **> Username:** ${member.user.username}
            **> Discord Tag:** ${member.user.tag}
            **> Created at:** ${created}`, true)

                .setTimestamp()


            if (member.user.presence.game)
                embed.addField('Currently playing', `**> Name:** ${member.user.presence.game.name}`)

            message.channel.send(embed)
    }
}