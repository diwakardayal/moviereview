/* eslint-disable react/prop-types */
import { useState, createContext } from "react"
import { useNotification } from "../hooks/index"

export const SearchContext = createContext()

let timeoutId
const debounce = (func, delay) => {
	return (...args) => {
		if (timeoutId) clearTimeout(timeoutId)
		timeoutId = setTimeout(() => {
			func.apply(null, args)
		}, delay)
	}
}

export default function SearchProvider({ children }) {
	const [isSearching, setIsSearching] = useState(false)
	const [results, setResults] = useState([])
	const [resultNotFound, setResultNotFound] = useState(false)

	const { updateNotification } = useNotification()

	async function search(method, query, updaterFn) {
		const { error, results } = await method(query)
		if (error) {
			updateNotification("error", error.e)
			return
		}

		if (!results.length) {
			// setResults([])
			// updaterFn && updaterFn([])
			return setResultNotFound(true)
		}
		setResultNotFound(false)
		setResults(results)
		updaterFn && updaterFn([...results])
	}

	const debounceFn = debounce(search, 300)

	function handleSearch(method, query, updaterFn) {
		setIsSearching(true)
		if (!query.trim()) {
			updaterFn && updaterFn([])
			return resetSearch()
		}

		debounceFn(method, query, updaterFn)
	}

	function resetSearch() {
		setIsSearching(false)
		setResults([])
		setResultNotFound(false)
	}

	return (
		<SearchContext.Provider
			value={{ handleSearch, isSearching, results, resultNotFound, resetSearch }}
		>
			{children}
		</SearchContext.Provider>
	)
}
