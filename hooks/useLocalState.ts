import { useState } from 'react'

export default function useLocalState(key: string, defaultValue?: string): [string, (v: string) => void] {
	const [state, setState] = useState(localStorage.getItem(key) ?? defaultValue)

	function updateState(value: string): void {
		setState(value)
		localStorage.setItem(key, value)
	}

	return [state, updateState]
}
