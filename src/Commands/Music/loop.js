const Command = require('../../Structures/Command');

module.exports = class loop extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['repeat'],
            category: "Music",
            nsfw: false,
            ownerOnly: false
        })
    }
    async run(message, args) {
        if(message.channel.name != 'musik') return message.reply("Wrong channel mate.... Please use #musik");
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("there is no player for this guild.");

        const { channel } = message.member.voice;

        if (!channel) return message.reply("you need to join a voice channel.");
        if (channel.id !== player.voiceChannel) return message.reply("you're not in the same voice channel.");

        if (args.length && /queue/i.test(args[0])) {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
            return message.reply(`${queueRepeat} queue repeat.`);
        }

        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
        return message.reply(`${trackRepeat} track repeat.`);
    }
};