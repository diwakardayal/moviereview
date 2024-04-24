/* eslint-disable react/prop-types */
import { useEffect } from "react"
import TagsInput from "../components/TagsInput"
import LiveSearch from "../components/LiveSearch"
import { useState } from "react"
import { useNotification, useSearch } from "../hooks/index"
import WritersModal from "../components/modal/WritersModal"
import CastForm from "../components/CastForm"
import { commonInputClasses } from "../utils/theme"
import CastModal from "../components/modal/CastModal"
import SelectPoster from "../components/SelectPoster"
import SelectGenres from "../components/SelectGenres"
import GenresModal from "../components/modal/GenresModal"
import Selector from "../components/Selector"
import { typeOptions, statusOptions, languageOptions } from "../utils/options"
import { uploadMovie } from "../services/movie"
import { searchDirector } from "../services/director"
import { searchWriter } from "../services/writer"

export function renderItem(result) {
	return (
		<div className="flex rounded overflow-hidden gap-2">
			<img src={result.avatar} alt="" className="w-16 h-16 object-cover" />
			<p className="dark:text-white font-semibold">{result.name}</p>
		</div>
	)
}

const defaultMovieInfo = {
	title: "",
	storyLine: "",
	tags: [],
	actors: [],
	director: {},
	writers: [],
	releaseDate: "",
	poster: null,
	genres: [],
	type: "",
	language: "",
	status: "",
	trailer: {
		url: "",
		public_id: "",
	},
}

export default function MovieForm({ trailer }) {
	const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo })
	const [isWritersModalVisible, setIsWritersModalVisible] = useState(false)
	const [isCastModalVisible, setIsCastModalVisible] = useState(false)
	const [poster, setPoster] = useState("")
	const [isGenresModalVisible, setIsGenresModalVisible] = useState(false)
	const [writerProfile, setWriterProfile] = useState()
	const [writers, setWriters] = useState([])
	const [directorProfile, setDirectorProfile] = useState("")

	const { updateNotification } = useNotification()

	async function handleSubmit(e) {
		e.preventDefault()

		setMovieInfo(prev => {
			return {
				...prev,
				trailer: {
					public_id: "iiq7jeltq5zchhbr335y",
					url: "https://res.cloudinary.com/dgwonhl7c/video/upload/v1713627145/iiq7jeltq5zchhbr335y.mp4",
				},
			}
		})

		const sanitizedCast = movieInfo.actors.map(c => ({
			id: c.profile._id,
			roleAs: c.roleAs,
			leadActor: c.leadActor,
		}))

		console.log(movieInfo)
		const formData = new FormData()
		formData.append("title", movieInfo.title)
		formData.append("storyLine", movieInfo.storyLine)
		formData.append("director", movieInfo.director)
		formData.append("writers", JSON.stringify(movieInfo.writers))
		formData.append("releaseDate", "2024-04-04")
		formData.append("type", movieInfo.type)
		formData.append("genres", JSON.stringify(movieInfo.genres))
		formData.append("language", movieInfo.language)
		formData.append("status", "public")
		formData.append("tags", JSON.stringify(["action"]))
		formData.append("trailer", JSON.stringify(trailer))
		formData.append("poster", movieInfo.poster)

		formData.append("actors", JSON.stringify(sanitizedCast))

		console.log("formData: ", formData)
		const res = await uploadMovie(formData)
		console.log(res)

		if (res?.error) {
			updateNotification("error", "Failed to create movie entry")
			return
		}
		console.log("MOVIE IS UPLOADED WHAAAA R U WAITNG 4")
		updateNotification("success", "Movie is uploaded")
	}

	useEffect(() => {
		setMovieInfo(prevMovieInfo => ({
			...prevMovieInfo,
			trailer: trailer,
		}))

		console.log("trailer in useEffect: ", trailer)
	}, [trailer])

	const { handleSearch, resetSearch } = useSearch()

	function handleChange({ target }) {
		const { value, name, files } = target

		if (name === "poster") {
			const poster = files[0]
			console.log(URL.createObjectURL(poster))
			setPoster(URL.createObjectURL(poster))

			return setMovieInfo({ ...movieInfo, poster })
		}

		if (name === "director") {
			console.log("LOLAA")
		}
		// if (name === "writers") {
		// }

		setMovieInfo({ ...movieInfo, [name]: value })
	}

	function updateTags(tags) {
		setMovieInfo({ ...movieInfo, tags })
	}

	function updateDirector(profile) {
		setMovieInfo({ ...movieInfo, director: profile })
		resetSearch()
	}

	function updateCast(castInfo) {
		const { actors } = movieInfo
		setMovieInfo({ ...movieInfo, actors: [...actors, castInfo] })
	}

	function updateWriters(writer) {
		const isWriterSelectedAlready = movieInfo.writers.some(w => w._id === writer._id)

		if (!isWriterSelectedAlready) {
			const newWriter = [...movieInfo.writers, writer]

			setMovieInfo({ ...movieInfo, writers: newWriter })
			setWriterProfile()
			resetSearch()
			return
		}
		updateNotification("warning", "This profile is already selected")
	}

	async function handleProfileChange({ target }) {
		const { name, value } = target

		if (name === "director") {
			handleSearch(searchDirector, value, setDirectorProfile)
		}

		if (name === "writers") {
			handleSearch(searchWriter, value, setWriters)
			setWriterProfile(value)
		}
	}

	let { title, storyLine, director, actors, type, language, status } = movieInfo

	function handleRemoveWriter(writer) {
		const modifiedArray = movieInfo.writers.filter(w => w !== writer)
		setMovieInfo({ ...movieInfo, writers: [...modifiedArray] })
	}

	function handleRemoveCast(actor) {
		const modifedArray = actors.filter(c => c.profile.name !== actor)
		setMovieInfo({ ...movieInfo, actors: [...modifedArray] })
	}

	function handleGenresModal() {
		setIsGenresModalVisible(false)
	}

	function updateGenres(genres) {
		setMovieInfo({ ...movieInfo, genres })
	}

	return (
		<div className="custom-scroll-bar">
			<div className="flex space-x-3">
				<div className="w-[70%] space-y-5">
					<div>
						<Label htmlFor="title">Title</Label>
						<input
							value={title}
							onChange={handleChange}
							name="title"
							id="title"
							type="text"
							className={commonInputClasses + " border-b-2 font-semibold text-xl"}
							placeholder="Titanic"
						/>
					</div>

					<div>
						<Label htmlFor="storyLine">Story line</Label>
						<textarea
							value={storyLine}
							onChange={handleChange}
							name="storyLine"
							id="storyLine"
							className={commonInputClasses + " border-b-2 resize-none h-16"}
							placeholder="Movie storyline..."
						/>
					</div>
					<div>
						<Label htmlFor="tags">Tags</Label>
						<TagsInput names="tags" onChange={updateTags} />
					</div>

					<div>
						<Label htmlFor="director">Director</Label>
						<LiveSearch
							name="director"
							value={director.name}
							results={directorProfile}
							placeholder="Search profile"
							renderItem={renderItem}
							onSelect={updateDirector}
							onChange={handleProfileChange}
							isModalVisible={directorProfile}
						/>
					</div>

					<div>
						<div className="flex justify-between">
							<LabelWithBadge htmlFor="writers" badge={movieInfo?.writers.length}>
								Writers
							</LabelWithBadge>
							{movieInfo?.writers.length > 0 && (
								<button
									className="dark:text-white text-primary"
									onClick={() => setIsWritersModalVisible(true)}
								>
									View All
								</button>
							)}
						</div>

						<LiveSearch
							name="writers"
							results={writers}
							placeholder="Search profile"
							renderItem={renderItem}
							onSelect={updateWriters}
							value={writerProfile?.name}
							onChange={handleProfileChange}
							isModalVisible={writers.length}
						/>
					</div>

					<div>
						<div className="flex justify-between">
							<LabelWithBadge badge={actors.length}>Add Cast & Crew</LabelWithBadge>
							{actors.length > 0 && (
								<button
									type="button"
									className="dark:text-white text-primary"
									onClick={() => setIsCastModalVisible(true)}
								>
									View All
								</button>
							)}
						</div>
						<CastForm onSubmit={updateCast} />
					</div>
					<div>
						<input
							onChange={handleChange}
							name="releaseDate"
							type="date"
							className={
								commonInputClasses +
								" border-2 rounded p-1 w-auto dark:[color-scheme:dark]"
							}
						/>
					</div>

					<button
						onClick={handleSubmit}
						className="w-full rounded dark:bg-white bg-secondary dark:text-secondary text-white hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 mt-5"
					>
						Submit
					</button>
				</div>
				<div className="w-[30%] space-y-5">
					<SelectPoster
						name="poster"
						onChange={handleChange}
						selectedPoster={poster}
						label="Select Poster"
					/>

					<SelectGenres onClick={() => setIsGenresModalVisible(true)} />
					<Selector
						onChange={handleChange}
						name="type"
						label="Type"
						value={type}
						options={typeOptions}
					/>
					<Selector
						onChange={handleChange}
						name="language"
						label="Language"
						value={language}
						options={statusOptions}
					/>
					<Selector
						onChange={handleChange}
						name="status"
						label="Status"
						value={status}
						options={languageOptions}
					/>
				</div>
			</div>

			<WritersModal
				isModalVisible={isWritersModalVisible}
				onClose={() => setIsWritersModalVisible(false)}
				profiles={movieInfo.writers}
				modifyWriters={handleRemoveWriter}
			/>
			<CastModal
				isModalVisible={isCastModalVisible}
				onClose={() => setIsCastModalVisible(false)}
				casts={actors}
				onRemoveClick={handleRemoveCast}
			/>
			<GenresModal
				isModalVisible={isGenresModalVisible}
				onSubmit={updateGenres}
				onClose={handleGenresModal}
				previouslySelectedGenres={movieInfo.genres}
			/>
		</div>
	)
}

function Label({ children, htmlFor }) {
	return (
		<label className="dark:text-dark-subtle text-light-subtle font-semibold" htmlFor={htmlFor}>
			{children}
		</label>
	)
}

function LabelWithBadge({ children, badge = 0, htmlFor }) {
	return (
		<div>
			<Label
				className="dark:text-dark-subtle text-light-subtle font-semibold"
				htmlFor={htmlFor}
			>
				{children}
			</Label>
			<span className="dark:text-dark-subtle text-light-subtle font-semibold">
				{" "}
				- {badge}
			</span>
		</div>
	)
}
