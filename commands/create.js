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

        // await db.insertIntoTableTag(tagname, )
        // await interaction.deferReply();
        const filter = m => m.author.id === author;
        // const collector = await interaction.channel.createMessageCollector({
        //     firstMessage,
        //     time: 30000,
        //     max: 2
        // });

        // try {
        //     await interaction.reply(tagname, { fetchReply: true })

        //     const collected = await interaction.channel
        //         .awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] });
        //     interaction.followUp(collected.first());
        // } catch (error) {
        //     await interaction.followUp(error);
        // }

        interaction.reply(tagname, { fetchReply: true })
            .then(() => {
                interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                    .then(collected => {
                        console.log(collected.first())
                        interaction.followUp(`${collected.first()}`);
                    })
                    .catch(collected => {
                        interaction.followUp('');
                    });
            });
        // collector.on('collect', async m => {
        //     // console.log(`Collected ${m.content}`);
        //     tagContent = await m
        //     console.log(await tagContent.content);

        //     // await wait(30000);
        //     await interaction.editReply({
        //         content: `Creating ${tagname}`,
        //         ephemeral: false
        //     })
        // });
        // collector.on('end', async collected => {
        //     console.log(`Collected ${await collected.first(), collected.size} items`);
        //     await interaction.followUp(`Created ${tagname}\n${tagContent}`)
        // });



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