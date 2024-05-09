/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getSingleMovie } from "../../services/movie"
import { useNotification, useAuth } from "../../hooks"
import ProfileModal from "../modal/ProfileModal"
import RelatedMovies from "../RelatedMovie"
import RatingStar from "../RatingStar"
import AddRatingModal from "../modal/AddRatingModal"

const convertDate = (date = "") => {
	return date.split("T")[0]
}

const convertReviewCount = (count = 0) => {
	if (count <= 999) return count

	return parseFloat(count / 1000).toFixed(2) + "k"
}

export default function MoviePage() {
	const [ready, setReady] = useState(false)
	const [showRatingModal, setShowRatingModal] = useState(false)
	const [movie, setMovie] = useState({})
	const [showProfileModal, setShowProfileModal] = useState(false)
	// eslint-disable-next-line no-unused-vars
	const [selectedProfile, setSelectedProfile] = useState({})

	const { movieId } = useParams()
	console.log("movieId ", movieId)
	const { updateNotification } = useNotification()
	const { user } = useAuth()

	const navigate = useNavigate()

	async function fetchMovie() {
		const { error, movie } = await getSingleMovie(movieId)

		if (error) return updateNotification("error", error)
		setReady(true)
		setMovie(movie)
	}

	function handleOnRateMovie() {
		if (!user) {
			navigate("/login")
			return
		}
		setShowRatingModal(true)
	}

	function hideRatingModal() {
		setShowRatingModal(false)
	}

	// function handleProfileClick(profile) {
	// 	setSelectedProfile(profile)
	// 	setShowProfileModal(true)
	// }

	function hideProfileModal() {
		setShowProfileModal(false)
	}

	function handleOnRatingSuccess(reviews) {
		setMovie({ ...movie, reviews: { ...reviews } })
	}

	useEffect(() => {
		fetchMovie()
	}, [])

	if (!ready)
		return (
			<div className="h-screen flex justify-center items-center dark:bg-primary bg-white">
				<p className="text-light-subtle dark:text-dark-subtle animate-pulse">Please wait</p>
			</div>
		)

	const {
		id,
		trailer,
		poster,
		title,
		storyLine,
		language,
		releaseDate,
		type,
		director = {},
		reviews = {},
		writers = [],
		actors = [],
		genres = [],
	} = movie

	return (
		<div className="dark:bg-primary bg-white min-h-screen pb-10">
			<div className={"max-w-screen-xl mx-auto xl:px-0 px-2"}>
				<video poster={poster} controls src={trailer}></video>
				<div className="flex justify-between">
					<h1 className="xl:text-4xl lg:text-3xl text-2xl  text-highlight dark:text-highlight-dark font-semibold py-3">
						{title}
					</h1>
					<div className="flex flex-col items-end">
						<RatingStar rating={reviews.ratingAvg} />
						<CustomButtonLink
							label={convertReviewCount(reviews.reviewCount) + " Reviews"}
							onClick={() => navigate("/movie/reviews/" + id)}
						/>
						<CustomButtonLink label="Rate the movie" onClick={handleOnRateMovie} />
					</div>
				</div>

				<div className="space-y-3">
					<p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>
					<ListWithLabel label="Director:">
						<CustomButtonLink
							// onClick={() => handleProfileClick(director)}
							label={director.name}
						/>
					</ListWithLabel>

					<ListWithLabel label="Writers:">
						{writers.map(w => (
							<CustomButtonLink
								// onClick={() => handleProfileClick(w)}
								key={w.id}
								label={w.name}
							/>
						))}
					</ListWithLabel>

					<ListWithLabel label="Cast:">
						{actors.map(({ id, profile, leadActor }) => {
							return leadActor ? (
								<CustomButtonLink
									// onClick={() => handleProfileClick(profile)}
									label={profile.name}
									key={id}
								/>
							) : null
						})}
					</ListWithLabel>

					<ListWithLabel label="Language:">
						<CustomButtonLink label={language} clickable={false} />
					</ListWithLabel>

					<ListWithLabel label="Release Date:">
						<CustomButtonLink label={convertDate(releaseDate)} clickable={false} />
					</ListWithLabel>

					<ListWithLabel label="Cast:">
						{genres.map(g => (
							<CustomButtonLink label={g} key={g} clickable={false} />
						))}
					</ListWithLabel>

					<ListWithLabel label="Type:">
						<CustomButtonLink label={type} clickable={true} />
					</ListWithLabel>

					<CastProfiles cast={actors} />
					<RelatedMovies movieId={movieId} />
				</div>
			</div>

			<ProfileModal
				isModalVisible={showProfileModal}
				onClose={hideProfileModal}
				profileId={selectedProfile.id}
			/>

			<AddRatingModal
				isModalVisible={showRatingModal}
				onClose={hideRatingModal}
				onSuccess={handleOnRatingSuccess}
			/>
		</div>
	)
}

function CustomButtonLink({ label, clickable = true, onClick }) {
	const className = clickable
		? "text-highlight dark:text-highlight-dark hover:underline"
		: "text-highlight dark:text-highlight-dark cursor-default"

	return (
		<button onClick={onClick} className={className} type="button">
			{label}
		</button>
	)
}

const ListWithLabel = ({ children, label }) => {
	return (
		<div className="flex space-x-2">
			<p className="text-light-subtle dark:text-dark-subtle font-semibold">{label}</p>
			{children}
		</div>
	)
}

// eslint-disable-next-line no-unused-vars
const CastProfiles = ({ cast, onProfileClick }) => {
	return (
		<div className="">
			<h1 className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
				Cast:
			</h1>
			<div className="flex flex-wrap space-x-4">
				{cast.map(({ id, profile, roleAs }) => {
					return (
						<div
							key={id}
							className="basis-28 flex flex-col items-center text-center mb-4"
						>
							<img
								className="w-24 h-24 aspect-square object-cover rounded-full"
								src={profile.avatar}
								alt=""
							/>

							<CustomButtonLink label={profile.name} />
							<span className="text-light-subtle dark:text-dark-subtle text-sm">
								as
							</span>
							<p className="text-light-subtle dark:text-dark-subtle">{roleAs}</p>
						</div>
					)
				})}
			</div>
		</div>
	)
}
