let timeoutId
function debounce(fn, delay) {
	return (...args) => {
		if (fn) clearTimeout(timeoutId)
		timeoutId = setTimeout(() => {
			fn.apply(null, args)
		}, delay)
	}
}

export default function Dashboard() {
	const search = value => {
		console.log(value)
	}
	const debounceSearch = debounce(search, 500)

	const handleChange = ({ target }) => {
		debounceSearch(target.value)
	}
	return (
		<input
			type="text"
			name="search"
			className="border-2 border-black"
			onChange={handleChange}
		/>
	)
}
