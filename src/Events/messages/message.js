const Event = require('../../Structures/Event');

module.exports = class extends Event {

	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.author.bot) return;
		if (message.content.match(mentionRegex)) message.channel.send(`Mit prefix for ${message.guild.name} er \`${this.client.prefix}\`.`);

		const prefix = message.content.match(mentionRegexPrefix) ?
			message.content.match(mentionRegexPrefix)[0] : this.client.prefix;

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {

			if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
				return message.reply('Ups, du har ikke adgang til denne kommando!');
			}

			if (command.guildOnly && !message.guild) {
				return message.reply('Ups, denne kommando virker kun på en Discord server.');
			}

			if (command.nsfw && !message.channel.nsfw) {
				return message.reply('Ups, denne kommando virker kun i en NSFW mærket kanal.');
			}

			if (command.args && !args.length) {
				return message.reply(`Ups, denne kommando kræver argumenter for at fungere. Anvendelse: ${command.usage ?
					`${this.client.prefix + command.name} ${command.usage}` : 'Denne kommando har ikke et brugsformat'}`);
			}

			if (message.guild) {
				const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
				if (userPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
					if (missing.length) {
						return message.reply(`Du mangler ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))} permissions, Du mangler for at køre denne kommando!`);
					}
				}

				const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPerms;
				if (botPermCheck) {
					const missing = message.channel.permissionsFor(this.client.user).missing(botPermCheck);
					if (missing.length) {
						return message.reply(`Jeg mangler ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))} permissions, Jeg mangler for at køre denne kommando!`);
					}
				}
			}

			command.run(message, args);
		}
	}

};
