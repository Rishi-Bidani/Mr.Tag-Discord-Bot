const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../dbHandler.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("makealias")
        .setDescription("Make an alias for an existing tag")
        .addStringOption(option => {
            return option
                .setName("alias")
                .setDescription("New alias name")
                .setRequired(true)
        })
        .addStringOption(option => {
            return option
                .setName("tag")
                .setDescription("New alias for which tag")
                .setRequired(true)
        }),
    async execute(interaction) {
        const alias = interaction.options.getString("alias");
        const tag = interaction.options.getString("tag");
        const author = interaction.member.user.id
        console.log(alias, tag);
        await db.setAlias(alias, tag, author);
        interaction.reply("Alias created!");
    }
}