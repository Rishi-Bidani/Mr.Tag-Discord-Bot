const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../dbHandler.js")
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Create new tag")
        .addStringOption(option => {
            return option
                .setName("tagname")
                .setDescription("New tag name")
                .setRequired(true)
        }),
    // .addStringOption(option => {
    //     return option
    //         .setName("content")
    //         .setDescription("New tags content")
    //         .setRequired(true)
    // }),
    async execute(interaction) {
        const tagname = interaction.options.getString("tagname");
        const author = interaction.member.user.id

        const filter = m => m.author.id === author;

        interaction
            .reply(tagname, { fetchReply: true })
            .then(() => {
                interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                    .then(async collected => {
                        try {
                            const message = await collected.first();
                            const response = await db.insertIntoTableTag(tagname, message.content, author, "")
                            console.log(message.content);
                            await interaction.followUp(`Tag: ${tagname}\n${message.content}`);

                        } catch (error) {
                            console.log(error)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        interaction.followUp("error");
                    });
            });
    }
}