const Event = require('../Structures/Event');
const { Manager } = require("erela.js");
const config = require('../../config.json');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		console.log([
			`Logged in as ${this.client.user.tag}`,
			`Loaded ${this.client.commands.size} commands!`,
			`Loaded ${this.client.events.size} events!`
		].join('\n'));


		const nodes = [
			{
				"host": "0.0.0.0",
				"port": 2333,
				"password": "youshallnotpass"
			}
		]

		this.client.manager = new Manager({
			nodes,
			send: (id, payload) => {
				const guild = this.client.guilds.cache.get(id);
				// NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
				if (guild) guild.shard.send(payload);
			}
		});

		this.client.manager.on('nodeConnect', node => {
			console.log(`Node connected to ${node.options.identifier}`)
		});

		this.client.manager.on("nodeError", (node, error) => {
			console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
		})

		this.client.manager.on("trackStart", (player, track) => {
			const channel = this.client.channels.cache.get(player.textChannel);
			channel.send(`Now playing: \`${track.title}\`, requested by \`${track.requester.tag}\`.`);
		});

		this.client.manager.on("queueEnd", player => {
			const channel = this.client.channels.cache.get(player.textChannel);
			player.destroy();
		});


        this.client.on('raw', (d) =>  {
            this.client.manager.updateVoiceState(d);
        })

		this.client.manager.init(this.client.user.id)

	}
};