const Command = require('../../Structures/Command');

const levels = {
    none: 0.0,
    low: 0.10,
    medium: 0.15,
    high: 0.25,
};


module.exports = class bassboost extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['bb', 'bass'],
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

        let level = "none";
        if (args.length && args[0].toLowerCase() in levels) level = args[0].toLowerCase();

        const bands = new Array(3)
            .fill(null)
            .map((_, i) =>
                ({ band: i, gain: levels[level] })
            );

        player.setEQ(...bands);

        return message.reply(`Ændrer bassbost til level ${level}`);
    }
};
