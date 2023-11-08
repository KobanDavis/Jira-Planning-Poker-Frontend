type QS<T extends string> = Partial<Record<T, string>>

function getQS<T extends string>() {
	return Object.fromEntries(new URLSearchParams(location.search).entries()) as QS<T>
}

function setQS(o: Record<string, string>) {
	let url = window.location.href.split('?')[0]
	const string = new URLSearchParams(o).toString()
	if (Object.keys(o).length > 0) {
		url += '?' + string
	}
	window.history.replaceState(null, null, url)
}

export { getQS, setQS }
