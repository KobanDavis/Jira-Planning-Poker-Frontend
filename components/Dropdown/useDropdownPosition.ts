import { useRef } from 'react'

const useDropdownPosition = () => {
	const dropdownRef = useRef<HTMLButtonElement>(null)
	const position = {
		maxHeight: 0,
		margin: 4,
		x: 0,
		y: 0,
		dropdownRef,
	}

	const dropdown = dropdownRef.current
	if (dropdown) {
		const rect = dropdown.getBoundingClientRect()
		position.maxHeight = window.innerHeight - rect.bottom - position.margin * 2
		position.x = rect.x
		position.y = rect.y
	}

	return position
}

export default useDropdownPosition
