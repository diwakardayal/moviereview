export const getPoster = (posters = []) => {
	const { length } = posters

	if (!length) return null

	// if poster has more then 2 items then selecting second poster.
	if (length > 2) return posters[1]

	// other wise the first one
	return posters[0]
}
