/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { getMovies } from "../services/movie"
import { useNotification } from "../hooks"
import RecentUploads from "../components/RecentUploads"
// import MostRatedMovies from "../components/MostRatedMovies"
import { getUsers } from "../services/user"
import { getReviews } from "../services/review"

export default function Dashboard() {
	const [movies, setMovies] = useState([])
	const [users, setUsers] = useState([])
	const [reviews, setReviews] = useState([])

	const { updateNotification } = useNotification()

	async function fetchData() {
		try {
			console.log("refreshing")
			const { movies } = await getMovies()
			const { users } = await getUsers()
			const { reviews } = await getReviews()

			setMovies(movies || [])
			setUsers(users || [])
			setReviews(reviews || [])
		} catch (e) {
			updateNotification("error", e.message)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	const refreshData = () => {
		fetchData()
	}

	return (
		<div className="grid grid-cols-3 gap-5 p-5 mt-5">
			<InfoBox title="Total Uploads" subTitle={movies.length} />
			<InfoBox title="Total Reviews" subTitle={reviews.length} />
			<InfoBox title="Total Users" subTitle={users.length} />

			<RecentUploads movies={movies} refresh={refreshData} />
			{/* Disabling most rated movie section */}
			{/* <MostRatedMovies /> */}
		</div>
	)
}

function InfoBox({ title, subTitle }) {
	return (
		<div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded">
			<h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">{title}</h1>
			<p className="text-xl text-primary dark:text-white">{subTitle}</p>
		</div>
	)
}
