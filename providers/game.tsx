import React, { useContext, createContext, FC, useState, useEffect, useMemo } from 'react'
import { Events, Game } from 'types/backend'
import io, { Socket } from 'socket.io-client'

interface Data {
	rounds: Game.Round[]
	cards: Game.Card[]
	players: Game.ClientPlayer[]
	state: Game.State
	name: string
	currentRound: string
}

interface GameInfo {
	data: Data
	socket: Socket<Events.ServerToClient, Events.ClientToServer>
	self: Game.ClientPlayer
	updateSelf<T extends keyof Game.ClientPlayer>(k: T, v: Game.ClientPlayer[T]): void
	updateData<T extends keyof Data>(k: T, v: Data[T]): void
}

const getUserId = () => {
	let id = localStorage.getItem('user_id')
	if (!id) {
		const id = Math.random().toString().slice(2, 10)
		localStorage.setItem('user_id', id)
	}
	return id
}

const GameProvider: FC<{ children: React.ReactNode }> = (props) => {
	const [self, setSelf] = useState<Game.ClientPlayer>({
		id: null,
		role: null,
		name: null,
	})

	const [data, setData] = useState<Data>({
		currentRound: null,
		cards: [],
		players: [],
		rounds: null,
		name: null,
		state: Game.State.NOT_JOINED,
	})

	const socket = useMemo<Socket<Events.ServerToClient, Events.ClientToServer>>(() => io(process.env.NEXT_PUBLIC_BACKEND_URL), [])

	function updateSelf<T extends keyof Game.ClientPlayer>(key: T, value: Game.ClientPlayer[T]) {
		setSelf((o) => Object.assign({}, o, { [key]: value }))
	}

	function updateData<T extends keyof Data>(key: T, value: Data[T]) {
		setData((o) => Object.assign({}, o, { [key]: value }))
	}

	useEffect(() => {
		updateSelf('id', getUserId())

		socket.on('ingame/init', ({ self, ...initData }) => {
			setData((data) => Object.assign({}, data, initData))
			setSelf(self)
		})
		socket.on('ingame/rounds', (rounds) => {
			console.log('ingame/rounds', rounds)
			updateData('rounds', rounds)
		})
		socket.on('ingame/state', (state) => {
			console.log('ingame/state', state)
			updateData('state', state)
		})
		socket.on('ingame/players', (players) => {
			console.log('ingame/players', players)
			updateData('players', players)
		})
		socket.on('ingame/cards', (cards) => {
			console.log('ingame/cards', cards)
			updateData('cards', cards)
		})
		socket.on('ingame/currentRound', (roundId) => {
			console.log('ingame/currentRound', roundId)
			updateData('currentRound', roundId)
		})
	}, [])

	const ping = () => {
		return new Promise<number>((r) => {
			const start = Date.now()
			socket.emit('ping', () => {
				r(Date.now() - start)
			})
		})
	}
	;((typeof window !== 'undefined' ? window : {}) as any).socket = socket
	const gameInfo: GameInfo = {
		data,
		self,
		socket,
		updateSelf,
		updateData,
	}

	return self.id ? <GameContext.Provider value={gameInfo} {...props} /> : null
}

const GameContext = createContext<GameInfo>(null)

const useGame = () => useContext(GameContext)

export { GameProvider, useGame }
