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
        if(message.channel.name != 'musik') return message.reply("Forkert kanal bror/søster brug #musik");
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("Der er ingen spiller i denne klub.");

        const { channel } = message.member.voice;

        if (!channel) return message.reply("Du mangler at tilslutte en talekanal.");
        if (channel.id !== player.voiceChannel) return message.reply("Du er ikke i den samme talekanal.");

        if (args.length && /queue/i.test(args[0])) {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "aktivere" : "deaktive";
            return message.reply(`${queueRepeat} kø gentagelse.`);
        }

        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "aktivere" : "deaktive";
        return message.reply(`${trackRepeat} track gentagelse.`);
    }
};
