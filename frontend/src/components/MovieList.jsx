/* eslint-disable react/prop-types */
import { AiFillStar } from "react-icons/ai"
import { Link } from "react-router-dom"
import { getPoster } from "../utils/helper"

const trimTitle = (text = "") => {
	if (text.length <= 20) return text
	return text.substring(0, 20) + ".."
}

export default function MovieList({ title, movies = [] }) {
	if (!movies.length) return null

	return (
		<div>
			{title ? (
				<h1 className="text-2xl dark:text-white text-secondary font-semibold mb-5">
					{title}
				</h1>
			) : null}
			<div className={"grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-3 "}>
				{movies.map(movie => {
					return <ListItem key={movie.id} movie={movie} />
				})}
			</div>
		</div>
	)
}

const ListItem = ({ movie }) => {
	const { id, responsivePosters, title, poster, reviews } = movie
	return (
		<Link to={"/movie/" + id}>
			<img
				className="aspect-video object-cover w-full"
				src={getPoster(responsivePosters) || poster}
				alt={title}
			/>
			<h1 className="text-lg dark:text-white text-secondary font-semibold" title={title}>
				{trimTitle(title)}
			</h1>
			{reviews?.ratingAvg ? (
				<p className="text-highlight dark:text-highlight-dark flex items-center space-x-1">
					<span>{reviews?.ratingAvg}</span>
					<AiFillStar />
				</p>
			) : (
				<p className="text-highlight dark:text-highlight-dark">No reviews</p>
			)}
		</Link>
	)
}
