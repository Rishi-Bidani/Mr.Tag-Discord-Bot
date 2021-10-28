const fs = require("fs");
const path = require("path");
const db = require("./dbHandler.js");
(async () => await db.createDBIfNotExist())();
// Discord Imports
const { Client, Intents, Constants, Collection } = require('discord.js');
const { REST } = require("@discordjs/rest");
const { Routes, InteractionResponseType } = require("discord-api-types/v9");

// .env file
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

// Important constants
const TOKEN = process.env['TOKEN'];
const GUILD_ID = process.env['GUILD_ID'];


const commands = [];
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(__dirname, "commands", file));
    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
    console.log('Ready!');
    const CLIENT_ID = client.user.id;
    const rest = new REST({ version: "9" }).setToken(TOKEN);
    (async () => {
        try {
            if (process.env.ENV === "production") {
                await rest.put(Routes.applicationCommand(CLIENT_ID), {
                    body: commands
                });
                console.log("Successfully registered commands globally!")
            } else {
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
                    body: commands
                });
                console.log("Successfully registered commands locally!")
            }
        } catch (err) {
            if (err) console.log(err)
        }
    })()
    // const guild = client.guilds.cache.get(guildId);
    // let commands;

    // if (guild) {
    //     commands = guild.commands;
    // } else {
    //     commands = client.application?.commands;
    // }

    // commands.create({
    //     name: "ping",
    //     description: "Replies pong!!"
    // });

    // commands.create({
    //     name: "add",
    //     description: "Adds 2 numbers",
    //     options: [
    //         {
    //             name: "num1",
    //             description: "Number 1",
    //             required: true,
    //             type: Constants.ApplicationCommandOptionTypes.NUMBER
    //         },
    //         {
    //             name: "num2",
    //             description: "Number 2",
    //             required: true,
    //             type: Constants.ApplicationCommandOptionTypes.NUMBER
    //         }
    //     ]
    // })

});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    // const { commandName, options } = interaction;

    // if (commandName === "ping") {
    //     interaction.reply({
    //         content: "pong",
    //         ephemeral: false
    //     })
    // } else if (commandName === "add") {
    //     const num1 = options.getNumber("num1") || 0;
    //     const num2 = options.getNumber("num2") || 0;
    //     interaction.reply({
    //         content: `The sum is ${num1 + num2}`,
    //         ephemeral: false
    //     })
    // }

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(TOKEN);