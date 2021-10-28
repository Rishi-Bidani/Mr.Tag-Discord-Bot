const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../dbHandler.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("tag")
        .setDescription("Read tag")
        .addStringOption(option => {
            return option
                .setName("tagname")
                .setDescription("which tag to read")
                .setRequired(true)
        }),
    async execute(interaction) {
        const tagname = interaction.options.getString("tagname");
        let tagData = await db.getTag(tagname);
        if (tagData) {
            interaction.reply(tagData.content);
        } else {
            interaction.reply("Tag not found");
        }
    }
}