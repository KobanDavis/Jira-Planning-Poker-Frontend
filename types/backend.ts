import { Socket } from 'socket.io-client'

export namespace Game {
	export enum Resolution {
		TODO,
		ACCEPTED,
		REJECTED,
		REVIEWING,
	}

	export enum State {
		NOT_JOINED,
		LOBBY,
		PREGAME,
		INGAME,
		POSTGAME,
	}

	export type Role = 'player' | 'owner'

	export interface Player {
		name: string
		id: string
		socket: Socket<Events.ClientToServer, Events.ServerToClient>
		role: Role
		spectating?: false // todo
	}

	export type ClientPlayer = Omit<Player, 'socket'>

	export interface Card {
		id: string
		value: number | string
		name: string
	}

	export interface Round {
		id: string
		value: string
		title: string
		resolution: Resolution
	}
}

export namespace Events {
	export interface ClientToServer {
		ping: (cb: () => void) => void
		'room/create': (data: { playerId: string; roomName: string; sprintId: number }, cb: (roomId: string) => void) => void
		'room/name': (id: string, cb: (name: string) => void) => void
		'room/exists': (id: string, cb: (exists: boolean) => void) => void
		'room/join': (data: { name: string; id: string; roomId: string }, cb: (sprintId: number | undefined) => void) => void
		'ingame/state': (state: Game.State) => void
		'ingame/card': (card: Game.Card) => void
		'ingame/cards': (cards: Game.Card[]) => void
		'ingame/rounds': (rounds: Game.Round[]) => void
		'ingame/round': (rounds: Game.Round) => void
		'ingame/currentRound': (roundId: string) => void
	}

	export interface ServerToClient {
		'ingame/init': (data: { cards: Game.Card[]; self: Game.ClientPlayer; rounds: Game.Round[]; currentRound: string; state: Game.State }) => void
		'ingame/state': (state: Game.State) => void
		'ingame/cards': (cards: Game.Card[]) => void
		'ingame/rounds': (rounds: Game.Round[]) => void
		'ingame/players': (players: Game.ClientPlayer[]) => void
		'ingame/currentRound': (roundId: string) => void
	}
}
