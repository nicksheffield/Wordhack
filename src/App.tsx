import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn, getLikeness, randInt, shuffle } from '@/lib/utils'
import { CheckIcon, DotIcon, XIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import dict from './dictionary.json'

type Difficulty = {
	name: string
	chances: number
	options: number
	matchingOptions: [number, number]
}

const difficulties: Difficulty[] = [
	{
		name: 'Normal',
		chances: 6,
		options: 12,
		matchingOptions: [3, 8],
	},
	{
		name: 'Hard',
		chances: 4,
		options: 8,
		matchingOptions: [3, 5],
	},
]

type GuessLog = {
	type: 'guess'
	value: string
	likeness: number
}

type WinLog = {
	type: 'win'
	value: string
}

type Log = GuessLog | WinLog

const getAnswer = () => dict.at(Math.floor(Math.random() * dict.length)) || ''

export const App = () => {
	const [answer, setAnswer] = useState<string>(getAnswer)

	const [difficulty, setDifficulty] = useState<Difficulty>(difficulties[0])

	const [logs, setLogs] = useState<Log[]>([])

	const chances = difficulty.chances - logs.length
	const guesses = logs.filter((x) => x.type === 'guess').length
	const won = logs.some((x) => x.type === 'win')

	const options = useMemo(() => {
		const len = difficulty.options
		const matching = randInt(
			difficulty.matchingOptions[0],
			difficulty.matchingOptions[1]
		)

		const matchingOptions = shuffle(
			dict.filter((x) => getLikeness(x, answer) > 0)
		).slice(0, matching)

		const unmatchingOptions = shuffle(
			dict.filter((x) => getLikeness(x, answer) === 0)
		).slice(0, len - matching)

		// console.log(matchingOptions, unmatchingOptions)

		return shuffle([...matchingOptions, ...unmatchingOptions, answer])
	}, [answer, difficulty])

	const reset = useCallback(() => {
		setAnswer(getAnswer())
		setLogs([])
	}, [])

	const select = (option: string) => {
		const likeness = getLikeness(answer, option)

		setLogs((a) => [
			...a,
			likeness === 5
				? {
						type: 'win',
						value: option,
				  }
				: {
						type: 'guess',
						value: option,
						likeness,
				  },
		])
	}

	const selectDifficulty = (val: string) => {
		if (val === difficulty.name) return

		setDifficulty(difficulties.find((x) => x.name === val)!)

		reset()
	}

	return (
		<div className="flex items-center flex-col sm:py-6 bg-white sm:bg-muted min-h-screen">
			<Card className="max-w-2xl w-full sm:rounded-xl rounded-none border-0 shadow-none sm:border sm:shadow-sm">
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle>Wordhack</CardTitle>
						<div className="flex items-center gap-2">
							<Select
								value={difficulty.name}
								onValueChange={(name) => selectDifficulty(name)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Theme" />
								</SelectTrigger>
								<SelectContent>
									{difficulties.map((diff) => (
										<SelectItem
											key={diff.name}
											value={diff.name}
										>
											{diff.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button onClick={reset}>Reset</Button>
						</div>
					</div>
				</CardHeader>

				<CardContent className="flex flex-col gap-8">
					<div className="flex flex-col gap-2">
						<div className="text-xs font-medium text-muted-foreground">
							Chances
						</div>
						<div className="flex items-center gap-2">
							{Array.from({ length: guesses }).map((_) => (
								// <div className="size-3 bg-muted-foreground" />
								<XIcon className="size-4 text-destructive" />
							))}

							{won && (
								<CheckIcon className="size-4 text-green-500" />
							)}

							{Array.from({ length: chances }).map((_) => (
								// <div className="size-3 bg-muted-foreground" />
								<DotIcon className="size-4 text-muted-foreground" />
							))}
						</div>
					</div>

					<div className="grid sm:grid-cols-2 gap-10">
						<div className="flex flex-col gap-2">
							<div className="text-xs font-medium text-muted-foreground">
								Options
							</div>
							<div className="grid grid-cols-4 gap-3">
								{options.map((option) => (
									<Button
										key={option}
										onClick={() => select(option)}
										className="text-sm font-medium font-mono"
										variant="ghost"
										disabled={won}
									>
										{option}
									</Button>
								))}
							</div>
						</div>

						<div className="flex flex-col gap-4">
							<div className="text-xs font-medium text-muted-foreground">
								Log
							</div>
							<div className="flex flex-col divide-y">
								{logs.map((log, i) => (
									<div
										key={i}
										className={cn(
											'flex flex-row gap-2',
											i === 0 ? 'pb-4' : 'py-4'
										)}
									>
										{log.type === 'guess' ? (
											<>
												<div className="pt-0.5">
													<XIcon className="size-4 text-muted-foreground" />
												</div>
												<div className="flex flex-col font-mono text-sm">
													<div>{log.value}</div>
													{/* <div>Access Denied</div> */}
													<div>
														Likeness ={' '}
														{log.likeness}
													</div>
												</div>
											</>
										) : log.type === 'win' ? (
											<>
												<div className="pt-0.5">
													<CheckIcon className="size-4 text-muted-foreground" />
												</div>
												<div className="flex flex-col font-mono text-sm">
													<div>{log.value}</div>
													{/* <div>Access Granted</div> */}
												</div>
											</>
										) : null}
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
