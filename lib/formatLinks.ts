export default function formatLinks(html: string, resourceUrl: string) {
	const matches = Array.from(html.matchAll(/src="(.*?)"/g))
	for (let [, match] of matches) {
		html = html.replace(match, resourceUrl + match)
	}
	return html
}
