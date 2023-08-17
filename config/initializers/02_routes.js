'use strict'

module.exports = function() {
	const routes_path = process.cwd() + '/config/api/routes'

	return fs
		.readdirAsync(routes_path)
		.then((files) => {
			// move base.js to last item
			files.push(files.splice(files.indexOf('node.js'), 1)[0])

			return files
		})
		.mapSeries((file) => {
			if (file && file.includes('.js')) {
				require(routes_path + '/' + file)(this)
			}

			return null
		})
}