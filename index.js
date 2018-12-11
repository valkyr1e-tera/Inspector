'use strict'

module.exports = function Inspector(mod) {
	mod.command.add('inspect', () => {
		mod.settings.enabled = !mod.settings.enabled
		mod.command.message((mod.settings.enabled ? 'en' : 'dis') + 'abled')
	})

	mod.hook('S_OTHER_USER_APPLY_PARTY', 1, (event) => {
		if (!mod.settings.enabled)
			return

		if (!mod.game.me.inCombat)
			mod.send('C_REQUEST_USER_PAPERDOLL_INFO', 1, { name: event.name })
	})
}