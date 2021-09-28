const { MessageEmbed } = require("discord.js");
const Command = require('../../Structures/Command');

module.exports = class queue extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['q'],
            category: "Music",
            nsfw: false,
            ownerOnly: false
        })
    }
    async run(message, args) {
        if(message.channel.name != 'musik') return message.reply("Forkert kanal bror/søster brug #musik");
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("Der er ingen spiller i denne klub.");

        const queue = player.queue;
        const embed = new MessageEmbed()
            .setAuthor(`Kø for ${message.guild.name}`);

        // change for the amount of tracks per page
        const multiple = 10;
        const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

        const end = page * multiple;
        const start = end - multiple;

        const tracks = queue.slice(start, end);

        if (queue.current) embed.addField("Current", `[${queue.current.title}](${queue.current.uri})`);

        if (!tracks.length) embed.setDescription(`Ingen tracks i ${page > 1 ? `page ${page}` : "køen"}.`);
        else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri})`).join("\n"));

        const maxPages = Math.ceil(queue.length / multiple);

        embed.setFooter(`Side ${page > maxPages ? maxPages : page} af ${maxPages}`);

        return message.reply(embed);
    }
};
