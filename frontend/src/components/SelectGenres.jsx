/* eslint-disable react/prop-types */
import { ImTree } from "react-icons/im"

export default function SelectGenres({ onClick }) {
	return (
		<button
			onClick={onClick}
			className="flex items-center space-x-2 py-1 px-3 border-2 dark:border-dark-subtle border-light-subtle dark:hover:border-white hover:border-primary transition dark:text-dark-subtle text-light-subtle dark:hover:text-white hover:text-primary rounded"
		>
			<ImTree />
			<span>Select Genres</span>
		</button>
	)
}
