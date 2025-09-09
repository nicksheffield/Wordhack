const englishWords = require('an-array-of-english-words')
const fs = require('node:fs')

// set package.type from 'module' to 'CommonJs' just for running this file

fs.writeFileSync(
	'./src/dictionary.json',
	JSON.stringify(
		englishWords.filter((x) => x.length === 5).map((x) => x.toUpperCase())
	)
)
