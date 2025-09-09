import fs from 'node:fs'
import wordListPath from 'word-list'

const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n')

fs.writeFileSync(
	'./src/dictionary.json',
	JSON.stringify(
		wordArray.filter((x) => x.length === 5).map((x) => x.toUpperCase())
	)
)
