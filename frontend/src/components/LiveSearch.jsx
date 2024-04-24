/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useEffect, useRef, useState, forwardRef } from "react"
import { commonInputClasses } from "../utils/theme"

export default function LiveSearch({
	name,
	value = "",
	placeholder = "",
	results = [],
	resultContainerStyle,
	selectedResultStyle,
	inputStyle,
	renderItem = null,
	onChange = null,
	onSelect = null,
	isModalVisible,
}) {
	const [isSearchDisplayed, setIsSearchDisplayed] = useState(false)
	const [focusedIndex, setFocusedIndex] = useState(-1)
	const [defaultValue, setDefaultValue] = useState("")

	function handleOnFocus() {
		if (results.length) setIsSearchDisplayed(true)
	}

	function closeSearch() {
		setIsSearchDisplayed(false)
		setFocusedIndex(-1)
	}

	function handleOnBlur() {
		closeSearch()
	}

	function handleSelection(selectedItem) {
		if (!selectedItem) {
			return
		}
		onSelect(selectedItem)
		setDefaultValue("")
		closeSearch()
	}

	function handleKeyDown({ key }) {
		let nextCount

		const keys = ["ArrowDown", "ArrowUp", "Enter", "Escape"]
		if (!keys.includes(key)) return

		// move selection up and down
		if (key === "ArrowDown") {
			nextCount = (focusedIndex + 1) % results.length
		}

		if (key === "ArrowUp") {
			nextCount = (focusedIndex + results.length - 1) % results.length
		}

		if (key === "Enter") return handleSelection(results[focusedIndex])

		if (key === "Escape") return closeSearch()

		setFocusedIndex(nextCount)
	}

	function getInputStyle() {
		return inputStyle ? inputStyle : commonInputClasses + " border-2 rounded p-1 text-lg"
	}

	function handleChange(e) {
		setDefaultValue(e.target.value)
		onChange && onChange(e)
	}

	useEffect(() => {
		setDefaultValue(value)
	}, [value])

	useEffect(() => {
		if (isModalVisible) return setIsSearchDisplayed(isModalVisible)
		setIsSearchDisplayed(false)
	}, [isModalVisible])

	return (
		<div
			tabIndex={1}
			onKeyDown={handleKeyDown}
			onBlur={handleOnBlur}
			className="relative outline-none"
		>
			<input
				name={name}
				type="text"
				id={name}
				className={getInputStyle()}
				placeholder={placeholder}
				onFocus={handleOnFocus}
				onChange={handleChange}
				value={defaultValue}
				autoComplete="off"
			/>
			<SearchResults
				results={results}
				isResultsVisible={isSearchDisplayed}
				focusedIndex={focusedIndex}
				onSelect={handleSelection}
				renderItem={renderItem}
				resultContainerStyle={resultContainerStyle}
				selectedResultStyle={selectedResultStyle}
			/>
		</div>
	)
}

function SearchResults({
	isResultsVisible,
	results = [],
	focusedIndex,
	onSelect,
	renderItem,
	resultContainerStyle,
	selectedResultStyle,
}) {
	const resultContainer = useRef()

	useEffect(() => {
		resultContainer.current?.scrollIntoView({
			behavior: "smooth",
			block: "center",
		})
	}, [focusedIndex])

	if (!isResultsVisible) return null
	return (
		<div className="absolute z-10 right-0 left-0 top-10 bg-white dark:bg-secondary shadow-md p-2 max-h-64 space-y-2  mt-1 overflow-auto custom-scroll-bar">
			{results.map((result, index) => {
				function getSelectedClass() {
					return selectedResultStyle
						? selectedResultStyle
						: "dark:bg-dark-subtle bg-light-subtle"
				}

				return (
					<ResultCard
						key={index}
						item={result}
						renderItem={renderItem}
						resultContainerStyle={resultContainerStyle}
						selectedResultStyle={index === focusedIndex ? getSelectedClass() : ""}
						onMouseDown={() => onSelect(result)}
					/>
				)
			})}
		</div>
	)
}

const ResultCard = forwardRef((props, ref) => {
	const { item, renderItem, resultContainerStyle, selectedResultStyle, onMouseDown } = props

	const getClasses = () => {
		if (resultContainerStyle) return resultContainerStyle + " " + selectedResultStyle

		return (
			selectedResultStyle +
			" cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition"
		)
	}
	return (
		<div onMouseDown={onMouseDown} ref={ref} className={getClasses()}>
			{renderItem(item)}
		</div>
	)
})
