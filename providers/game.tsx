import React, { useContext, createContext, FC, useState, useEffect, useRef, useMemo } from 'react'
import { Events, Game } from 'backend/types'
import io, { Socket } from 'socket.io-client'

interface GameInfo {
	data: {
		cards: Game.Card[]
		players: Game.ClientPlayer[]
		state: Game.State
	}
	socket: Socket
	self: Game.ClientPlayer
	updateSelf<T extends keyof Game.ClientPlayer>(k: T, v: Game.ClientPlayer[T]): void
}

const getUserId = () => {
	const id = localStorage.getItem('user_id')
	if (id) {
		return id
	} else {
		const id = Math.random().toString().slice(2, 10)
		localStorage.setItem('user_id', id)
		return id
	}
}

const GameProvider: FC<{ children: React.ReactNode }> = (props) => {
	const [cards, setCards] = useState<Game.Card[]>([])
	const [players, setPlayers] = useState<Game.ClientPlayer[]>([])
	const [state, setState] = useState<Game.State>(Game.State.NOT_JOINED)
	const [self, setSelf] = useState<Game.ClientPlayer>({ id: null, role: null, name: null })
	const socket = useMemo<Socket<Events.ServerToClient, Events.ClientToServer>>(() => io(process.env.NEXT_PUBLIC_BACKEND_URL), [])

	function updateSelf<T extends keyof Game.ClientPlayer>(key: T, value: Game.ClientPlayer[T]) {
		setSelf((o) => {
			const n = Object.assign({}, o)
			n[key] = value
			return n
		})
	}

	useEffect(() => {
		updateSelf('id', getUserId())
		updateSelf('name', getUserId())
		socket.on('ingame/init', ({ cards, history, self }) => {
			setCards(cards)
			setSelf(self)
		})
		socket.on('ingame/state', (state) => {
			console.log('ingame/state', state)
			setState(state)
		})
		socket.on('ingame/players', (players) => {
			console.log('ingame/players', players)
			setPlayers(players)
		})
		socket.on('ingame/cards', (cards) => {
			console.log('ingame/cards', cards)
			setCards(cards)
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

	const gameInfo: GameInfo = {
		data: {
			cards,
			players,
			state,
		},
		self,
		socket,
		updateSelf,
	}

	return self.id ? <GameContext.Provider value={gameInfo} {...props} /> : null
}

const GameContext = createContext<GameInfo>(null)

const useGame = () => useContext(GameContext)

export { GameProvider, useGame }
