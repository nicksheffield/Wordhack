const englishWords = require('an-array-of-english-words')
const fs = require('node:fs')

// npm install an-array-of-english-words and remove it afterward
// set package.type from 'module' to 'CommonJs' just for running this file

fs.writeFileSync(
	'./src/dictionary.json',
	JSON.stringify(
		englishWords.filter((x) => x.length === 5).map((x) => x.toUpperCase())
	)
)
