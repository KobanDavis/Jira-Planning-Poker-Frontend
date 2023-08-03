import { useEffect } from 'react'

type QS<T extends string> = Partial<Record<T, string>> & {
	setQS: (qs: Record<string, string | number | symbol>) => void
}

function useQS<T extends string>() {
	const qs = Object.fromEntries(new URLSearchParams(location.search).entries()) as QS<T>

	qs.setQS = (o: Record<string, string>) => {
		const url = window.location.href.split('?')[0]
		const string = new URLSearchParams(o).toString()
		window.history.replaceState(null, null, `${url}?${string}`)
	}

	return qs
}

export default useQS
