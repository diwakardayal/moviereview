/* eslint-disable react/prop-types */
import { useState } from "react"
import ModalComponent from "./ModalContainer"
import { genres } from "../../utils/genres"

export default function GenresModal({
	isModalVisible,
	onClose,
	onSubmit,
	previouslySelectedGenres,
}) {
	const [selectedGenres, setSelectedGenres] = useState(previouslySelectedGenres)
	function handleGenres(e) {
		const { name: genreName } = e.target

		if (!genreName) {
			return
		}

		if (selectedGenres.includes(genreName)) {
			setSelectedGenres(selectedGenres.filter(x => x !== genreName))
		} else {
			setSelectedGenres(() => [...selectedGenres, genreName])
		}
	}

	function handleSubmit() {
		onSubmit(selectedGenres)
		onClose()
	}

	console.log(selectedGenres)
	return (
		<ModalComponent isModalVisible={isModalVisible} onClose={onClose}>
			<div className="flex flex-col justify-between h-full">
				<div>
					<h1 className="dark:text-white text-primary text-2xl font-semibold text-center">
						Select Genres
					</h1>
					<div className="space-y-3" onClick={handleGenres}>
						{genres.map(genre => {
							return (
								<button
									name={genre}
									className={
										(selectedGenres.includes(genre)
											? `dark:bg-white dark:text-primary bg-light-subtle text-white`
											: "text-primary dark:text-white") +
										" border-2 dark:border-dark-subtle border-light-subtle  text-primary p-1 rounded mr-3"
									}
									key={genre}
								>
									{genre}
								</button>
							)
						})}
					</div>
				</div>
				<div className="self-end">
					<button
						className="px-8 text-white w-full rounded dark:bg-white bg-secondary dark:text-secondary hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer h-10 flex items-center justify-center"
						onClick={handleSubmit}
					>
						Submit
					</button>
				</div>
			</div>
		</ModalComponent>
	)
}
