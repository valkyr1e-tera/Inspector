'use strict'

module.exports = function Inspector(mod) {
	const items = Object.assign({}, require(`./items/items.${mod.region}.json`))

	mod.command.add('inspect', () => {
		mod.settings.enabled = !mod.settings.enabled
		mod.command.message((mod.settings.enabled ? 'en' : 'dis') + 'abled')
	})

	let applied = false
	mod.hook('S_OTHER_USER_APPLY_PARTY', 1, (event) => {
		if (!mod.settings.enabled)
			return

		if (!mod.game.me.inCombat) {
			applied = true
			mod.toServer('C_REQUEST_USER_PAPERDOLL_INFO', 1, {name: event.name})
		}
	})

	mod.hook('S_USER_PAPERDOLL_INFO', 4, (event) => {
		if (!applied)
			return

		if (mod.settings.print_text) {
			let text = `${event.name}(IL:${event.itemLevel}/${event.itemLevelInventory})`
			if (event.guild != '')
				text += `(Guild:${event.guild})`
			mod.command.message(text)

			for (let item of event.items) {
				let equipment
				switch (item.slot) {
					case 1: // weapon
						equipment = event.weapon
						break;
					case 3: // chest
						equipment = event.chest
						break;
					case 4: // gloves
						equipment = event.gloves
						break;
					case 5: // boots
						equipment = event.boots
						break;
				}
				if (equipment)
					mod.command.message(`\t${conv(equipment)} +${item.enchantment}`)				
			}
		}

		applied = false
		if (!mod.settings.show_info_window)
			return false
	})

	function conv(id) {
		return items[id] || "Unknown"
	}
}