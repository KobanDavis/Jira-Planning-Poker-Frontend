import { useState } from 'react'

export default function useLocalState(key: string, defaultValue?: string): [string, (v: string) => void] {
	const [state, setState] = useState(localStorage.getItem(key) ?? defaultValue ?? null)

	function updateState(value: string): void {
		setState(value)
		if (value) {
			localStorage.setItem(key, value)
		} else {
			localStorage.removeItem(key)
		}
	}

	return [state, updateState]
}
