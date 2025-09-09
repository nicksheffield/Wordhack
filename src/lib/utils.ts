import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getLikeness = (a: string, b: string) => {
	const word = b.split('')
	return a
		.split('')
		.reduce((acc, letter, i) => +(letter === word[i]) + acc, 0)
}

// https://stackoverflow.com/a/48083382
export function shuffle<T>(array: T[]): T[] {
	let currentIndex = array.length,
		randomIndex

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--

		// And swap it with the current element.
		;[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		]
	}

	return array
}

export function randInt(min: number, max: number): number {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(min + (max - min + 1) * Math.random())
}
