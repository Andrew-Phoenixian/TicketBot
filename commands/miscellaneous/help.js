const { MessageEmbed } = require("discord.js");

const fs = require("fs");
var categories = fs.readdirSync("./commands/");

function getAll(bot, message) {
    const embed = new MessageEmbed().setColor("#e8941e").setTitle("Project: Homecoming");
    embed.setDescription("**List of all commands**. Use **help <command>** to get more information about the command");

    function commands(category) {
        return bot.commands
            .filter(cmd => cmd.category === category) // If it's the correct category
            .filter(cmd => cmd.enabled == true) // If command is enabled
            .filter(cmd => cmd.hideHelp == false) // If hidehelp is not set to true
            .map(cmd => `**${cmd.name} ${cmd.aliases.map(alias => `| ${alias} `).join('')}** - ${cmd.description}`) // Aliases and stuff

            .join("\n") || "No commands";
    }

    const info = categories
        .filter(folder => folder.search(".js") == -1) // If file doesen't have .js
        .map(folder => {
            embed.addField(`**${folder}**`, `${commands(folder)}`)
        });
    embed.setFooter(`Syntax: <> = required, [] = optional`);

    message.channel.send(embed)
        .catch(err => {
            message.channel.send(":x: Looks like I can't do that. Please check my permissions and make sure they are correct. Internal error: `" + err + "`")
        })
}

function getCMD(bot, message, arg) { // Get command specific
    const embed = new MessageEmbed().setColor("#e8941e").setTitle("Project: Homecoming");

    const cmd = bot.commands.get(arg) || bot.commands.get(bot.aliases.get(arg));
    let info = `No information found for command **${arg}**`;

    if (!cmd) { // If command was found
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    if (!cmd.enabled || cmd.hideHelp) { // If it's not enabled or hide help is enabled, return
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    info = `**Command**: ${cmd.name}\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}\n**Description**: ${cmd.description}\n**Usage**: ${cmd.usage}`
    embed.setFooter(`Syntax: <> = required, [] = optional`);

    return message.channel.send(embed.setDescription(info));
}

module.exports = {
    name: "help",
    enabled: true,
    hideHelp: false,
    aliases: ["cmds"],
    category: "miscellaneous",
    description: "Shows a list of commands and their usage.",
    usage: "[commmand]",
    run: async (bot, message, args) => {
        if (args[0]) {
            return getCMD(bot, message, args[0].toLowerCase()); // Cmd specific
        } else {
            return getAll(bot, message); // All commands
        }
    }
}