// REQUIRE DEPENDENCIES
const { readdirSync } = require("fs"); // Filesystem

const ascii = require("ascii-table"); // An ascii table.
const table = new ascii().setHeading("Name", "Status", "Category") // Creates a table with 3 values.

module.exports = (bot) => {
    readdirSync("./commands/").forEach(dir => { // Reads the commands folder, dir being the category.
        if (dir.endsWith(".js"))
            return;
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js")) // Reads the category, filters if the file is a .js or not.

        for (let file of commands) { // Simple for loop
            let commandFile
            try {
                commandFile = require(`../commands/${dir}/${file}`) // Requires file. (Not run function)
            } catch(e) {
                console.warn("Failed to load command: " + file + " in category: " + dir)
                console.log(e)
                continue
            }
            

            if (commandFile.name) { // If there's a command name in command config.
                bot.commands.set(commandFile.name, commandFile) // Adds it to bot directory.
                table.addRow(file, `YES`, dir) // Adds checkmark with command name and category to table.
            } else {
                table.addRow(file, `NO: Error loading command.`, dir) // Probably missing proper configuration in the name.
                continue;
            }
            
            if (commandFile.aliases && Array.isArray(commandFile.aliases)) { // If the file has aliases,
                commandFile.aliases.forEach(alias => bot.aliases.set(alias, commandFile.name)) // Set the aliases correctly to that file.
            }
        }
    });

    console.log(table.toString()); // Log it into the console.
}