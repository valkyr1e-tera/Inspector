'use strict'

const strings = require('./strings')["item"]

module.exports = function Inspector(mod) {
	mod.command.add('inspect', () => {
		mod.settings.enabled = !mod.settings.enabled
		mod.command.message((mod.settings.enabled ? 'en' : 'dis') + 'abled')
	})

	let applied = false
	mod.hook('S_OTHER_USER_APPLY_PARTY', 1, (event) => {
		if (!mod.settings.enabled)
			return
		applied = true

		if (!mod.game.me.inCombat) {
			mod.toServer('C_REQUEST_USER_PAPERDOLL_INFO', 1, {name: event.name})
		}
	})

	mod.hook('S_USER_PAPERDOLL_INFO', 4, (event) => {
		if (!applied)
			return

		let text = `${event.name}(IL:${event.itemLevel}/${event.itemLevelInventory})`
		if (event.guild != '')
			text += `(Guild:${event.guild})`

		if (mod.settings.print_text) {
			mod.command.message(text)
			for (let item of event.items) {
				switch (item.slot) {
					case 1: // weapon
						mod.command.message(`\t${conv(event.weapon)}+${item.enchantment}`)
						break;
					case 3: // chest
						mod.command.message(`\t${conv(event.chest)}+${item.enchantment}`)
						break;
					case 4: // gloves
						mod.command.message(`\t${conv(event.gloves)}+${item.enchantment}`)
						break;
					case 5: // boots
						mod.command.message(`\t${conv(event.boots)}+${item.enchantment}`)
						break;
				}
			}
		}

		applied = false
		if (!mod.settings.show_info_window)
			return false
	})

	function conv(s) {
		return strings[s] || "Undefined"
	}
}