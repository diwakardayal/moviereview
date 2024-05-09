/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { AiOutlineStar, AiFillStar } from "react-icons/ai"

const createArray = count => {
	return new Array(count).fill("")
}

const ratings = createArray(10)
// eslint-disable-next-line no-unused-vars
export default function RatingForm({ busy, initialState, onSubmit }) {
	const [selectedRatings, setSelectedRatings] = useState([])
	const [comment, setComment] = useState("")

	const handleMouseEnter = index => {
		const ratings = createArray(index + 1)
		setSelectedRatings([...ratings])
	}

	const handleOnChange = ({ target }) => {
		setComment(target.value)
	}

	const handleSubmit = () => {
		if (!selectedRatings.length) return
		const data = {
			rating: selectedRatings.length,
			comment: comment,
		}

		onSubmit(data)
	}

	useEffect(() => {
		if (initialState) {
			setComment(initialState.content)
			setSelectedRatings(createArray(initialState.rating))
		}
	}, [initialState])

	return (
		<div>
			<div className="p-5 dark:bg-primary bg-white rounded space-y-3">
				<div className="text-highlight dark:text-highlight-dark flex items-center relative">
					<StarsOutlined ratings={ratings} onMouseEnter={handleMouseEnter} />
					<div className="flex items-center absolute top-1/2 -translate-y-1/2">
						<StarsFilled ratings={selectedRatings} onMouseEnter={handleMouseEnter} />
					</div>
				</div>

				<textarea
					value={comment}
					onChange={handleOnChange}
					className="w-full h-24 border-2 p-2 dark:text-white text-primary rounded outline-none bg-transparent resize-none"
				></textarea>

				<button
					className="w-full rounded dark:bg-white bg-secondary dark:text-secondary text-white hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 mt-5"
					type="submit"
					onClick={handleSubmit}
				>
					Rate This Movie
				</button>
			</div>
		</div>
	)
}

const StarsOutlined = ({ ratings, onMouseEnter }) => {
	return ratings.map((_, index) => {
		return (
			<AiOutlineStar
				onMouseEnter={() => onMouseEnter(index)}
				className="cursor-pointer"
				key={index}
				size={24}
			/>
		)
	})
}

const StarsFilled = ({ ratings, onMouseEnter }) => {
	return ratings.map((_, index) => {
		return (
			<AiFillStar
				onMouseEnter={() => onMouseEnter(index)}
				className="cursor-pointer"
				key={index}
				size={24}
			/>
		)
	})
}
