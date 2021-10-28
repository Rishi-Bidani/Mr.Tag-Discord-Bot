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
        // const tagContent = interaction.options.getString("content");
        let tagContent;
        const author = interaction.member.user.id

        console.log(tagContent);
        // await db.insertIntoTableTag(tagname, )
        await interaction.deferReply();
        const firstMessage = m => m
        const collector = await interaction.channel.createMessageCollector({
            firstMessage,
            time: 30000,
            max: 1
        });
        collector.on('collect', async m => {
            // console.log(`Collected ${m.content}`);
            tagContent = await m
            console.log(tagContent.content, tagContent);

            // await wait(30000);
            await interaction.editReply({
                content: `Creating ${tagname}`,
                ephemeral: false
            })
        });
        collector.on('end', async collected => {
            console.log(`Collected ${collected, collected.size} items`);
            await interaction.followUp({
                content: `Created ${tagname}\n${tagContent}`
            })
        });
        // await interaction.reply({
        //     content: `Created ${tagname}`,
        //     ephemeral: false
        // })


        // await interaction.followUp({
        //     content: firstMessage,
        //     ephemeral: false
        // })
    }
}