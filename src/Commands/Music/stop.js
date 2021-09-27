const Command = require('../../Structures/Command');

module.exports = class stop extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['leave'],
            category: "Music",
            nsfw: false,
            ownerOnly: false
        })
    }
    async run(message) {
        if(message.channel.name != 'musik') return message.reply("Forkert kanal bror/søster brug #musik");
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("Der er ingen spiller i denne klub.");

        const { channel } = message.member.voice;

        if (!channel) return message.reply("Du mangler at tilslutte en talekanal.");
        if (channel.id !== player.voiceChannel) return message.reply("Du er ikke i den samme talekanal.");

        player.destroy();
        return message.reply("dræbte musikken.");
    }
};
