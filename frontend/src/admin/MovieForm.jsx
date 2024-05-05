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
import { updateMovie, uploadMovie } from "../services/movie"
import { getDirectors, searchDirector } from "../services/director"
import { getWriters, searchWriter } from "../services/writer"
import { getActors } from "../services/actor"
import { ImSpinner3 } from "react-icons/im"

export function renderItem(result) {
	return (
		<div className="flex rounded overflow-hidden gap-2">
			<img src={result.avatar} alt="" className="w-16 h-16 object-cover" />
			<p className="dark:text-white font-semibold">{result.name}</p>
		</div>
	)
}
export default function MovieForm({ trailer, initialFormData = null, movieId = null, onClose }) {
	const [movieInfo, setMovieInfo] = useState(
		initialFormData || {
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
		},
	)
	const [isWritersModalVisible, setIsWritersModalVisible] = useState(false)
	const [isCastModalVisible, setIsCastModalVisible] = useState(false)
	const [poster, setPoster] = useState("")
	const [isGenresModalVisible, setIsGenresModalVisible] = useState(false)
	const [writerProfile, setWriterProfile] = useState()
	const [writers, setWriters] = useState([])
	const [directorProfile, setDirectorProfile] = useState("")
	const [processing, setProcessing] = useState(false)

	const { updateNotification } = useNotification()

	async function handleSubmit(e) {
		e.preventDefault()

		const sanitizedCast = movieInfo.actors.map(c => ({
			id: c.profile._id,
			roleAs: c.roleAs,
			leadActor: c.leadActor,
		}))

		const sanitizedWritersOnlyWithIds = movieInfo.writers.map(w => w._id)
		const formData = new FormData()
		formData.append("title", movieInfo.title)
		formData.append("storyLine", movieInfo.storyLine)
		formData.append("director", movieInfo.director._id)
		formData.append("writers", JSON.stringify(sanitizedWritersOnlyWithIds))
		formData.append("releaseDate", movieInfo.releaseDate)
		formData.append("type", movieInfo.type)
		formData.append("genres", JSON.stringify(movieInfo.genres))
		formData.append("language", movieInfo.language)
		formData.append("status", movieInfo.status)
		formData.append("tags", JSON.stringify(movieInfo.tags))
		formData.append("trailer", JSON.stringify(movieInfo.trailer))
		formData.append("poster", movieInfo.poster)
		formData.append("actors", JSON.stringify(sanitizedCast))

		setProcessing(true)

		let res
		if (initialFormData) {
			res = await updateMovie(movieId, formData)
			if (res?.error) {
				updateNotification("error", "Failed to update movie")
			}
			updateNotification("success", "Movie is updated")
			window.location.reload()
			onClose()
			return
		}

		res = await uploadMovie(formData)
		if (res?.error) {
			updateNotification("error", "Failed to create movie")
			return
		}
		updateNotification("success", "Movie is uploaded")
		setProcessing(false)
		window.location.reload()
		onClose()
	}

	useEffect(() => {
		setMovieInfo(prevMovieInfo => ({
			...prevMovieInfo,
			trailer: trailer,
		}))
	}, [trailer])

	async function fetchDirectors(ids) {
		const res = await getDirectors(ids)
		if (res.error) {
			return
		}

		return res.results[0]
	}

	async function fetchWriters(ids) {
		const res = await getWriters(ids)

		if (res.error) {
			return
		}
		return res.results
	}

	async function initialiseForm() {
		const directorId = initialFormData.director

		const actorsIds = initialFormData.actors.map(a => a.id)

		const actors = await getActors(actorsIds)

		const ac = actors.results.map(x => {
			const actorInfo = initialFormData.actors.find(a => {
				if (a.id === x._id) {
					return a
				}
			})

			return {
				profile: {
					_id: x._id,
					name: x.name,
					about: x.name,
					gender: x.gender,
					avatar: x.avatar.url,
				},
				roleAs: actorInfo.roleAs,
				leadActor: actorInfo.leadActor,
			}
		})
		initialFormData.actors = ac
		const director = await fetchDirectors(directorId)
		let writers = await fetchWriters(initialFormData.writers)
		initialFormData.director = director

		writers = writers.map(({ _id, name, about, avatar }) => ({
			_id,
			name,
			about,
			avatar: avatar.url,
		}))
		initialFormData.writers = writers

		const date = initialFormData.releaseDate.split("T")[0]

		initialFormData.releaseDate = date

		setMovieInfo(initialFormData)
	}

	useEffect(() => {
		if (initialFormData) {
			initialiseForm()
		}
	}, [initialFormData])

	const { handleSearch, resetSearch } = useSearch()

	function handleChange({ target }) {
		const { value, name, files } = target

		if (name === "poster") {
			const poster = files[0]

			setPoster(URL.createObjectURL(poster))

			return setMovieInfo({ ...movieInfo, poster })
		}

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

	let { title, storyLine, actors, type, language, status } = movieInfo

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
						<TagsInput
							names="tags"
							onChange={updateTags}
							initialTags={movieInfo.tags}
						/>
					</div>

					<div>
						<Label htmlFor="director">Director</Label>
						<LiveSearch
							name="director"
							value={movieInfo?.director?.name}
							results={directorProfile}
							placeholder="Search profile"
							renderItem={renderItem}
							onSelect={updateDirector}
							onChange={handleProfileChange}
							isModalVisible={directorProfile}
							caller="director"
						/>
					</div>

					<div>
						<div className="flex justify-between">
							<LabelWithBadge htmlFor="writers" badge={movieInfo?.writers?.length}>
								Writers
							</LabelWithBadge>
							{movieInfo?.writers?.length > 0 && (
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
							value={initialFormData?.releaseDate}
						/>
					</div>

					<button
						onClick={handleSubmit}
						className="flex justify-center w-full rounded dark:bg-white bg-secondary dark:text-secondary text-white hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 mt-5"
					>
						{processing ? (
							<ImSpinner3 className="animate-spin text-3xl  " />
						) : initialFormData ? (
							"Update"
						) : (
							"Submit"
						)}
					</button>
				</div>
				<div className="w-[30%] space-y-5">
					<SelectPoster
						name="poster"
						onChange={handleChange}
						selectedPoster={poster || movieInfo?.poster?.url}
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
						options={languageOptions}
					/>
					<Selector
						onChange={handleChange}
						name="status"
						label="Status"
						value={status}
						options={statusOptions}
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
				casts={movieInfo.actors}
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
