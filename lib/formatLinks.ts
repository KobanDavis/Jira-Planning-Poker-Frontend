export default function formatLinks(s: string) {
	const matches = s.matchAll(/src="(.*?)"/g)
	for (let [, match] of matches) {
		s = s.replace(match, 'https://mondago.atlassian.net' + match)
	}
	return s
}
