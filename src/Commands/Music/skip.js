const Command = require('../../Structures/Command');

module.exports = class skip extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['s'],
            category: "Music",
            nsfw: false,
            ownerOnly: false
        })
    }
    async run(message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("there is no player for this guild.");

        const { channel } = message.member.voice;
        if (!channel) return message.reply("you need to join a voice channel.");
        if (channel.id !== player.voiceChannel) return message.reply("you're not in the same voice channel.");

        if (!player.queue.current) return message.reply("there is no music playing.")

        const { title } = player.queue.current;

        player.stop();
        return message.reply(`${title} was skipped.`)
    }
};