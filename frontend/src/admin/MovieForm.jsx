/* eslint-disable react/prop-types */

import TagsInput from "../components/TagsInput"
import LiveSearch from "../components/LiveSearch"
import { useState } from "react"
import { useNotification } from "../hooks/index"
import WritersModal from "../components/modal/WritersModal"
import CastForm from "../components/CastForm"
import { commonInputClasses } from "../utils/theme"
import CastModal from "../components/modal/CastModal"
import SelectPoster from "../components/SelectPoster"
import SelectGenres from "../components/SelectGenres"
import GenresModal from "../components/modal/GenresModal"
import Selector from "../components/Selector"
import { typeOptions, statusOptions, languageOptions } from "../utils/options"

export const results = [
	{
		id: "1",
		avatar: "https://images.unsplash.com/photo-1643713303351-01f540054fd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
		name: "John Doe",
	},
	{
		id: "2",
		avatar: "https://images.unsplash.com/photo-1643883135036-98ec2d9e50a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
		name: "Chandri Anggara",
	},
	{
		id: "3",
		avatar: "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
		name: "Amin RK",
	},
	{
		id: "4",
		avatar: "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
		name: "Edward Howell",
	},
	{
		id: "5",
		avatar: "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
		name: "Amin RK",
	},
	{
		id: "6",
		avatar: "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
		name: "Edward Howell",
	},
]

export function renderItem(result) {
	return (
		<div className="flex rounded overflow-hidden">
			<img src={result.avatar} alt="" className="w-16 h-16 object-cover" />
			<p className="dark:text-white font-semibold">{result.name}</p>
		</div>
	)
}

const defaultMovieInfo = {
	title: "",
	storyLine: "",
	tags: [],
	cast: [],
	director: {},
	writers: [],
	releaseDate: "",
	poster: null,
	genres: [],
	language: "",
	status: "",
}

export default function MovieForm() {
	const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo })
	const [isWritersModalVisible, setIsWritersModalVisible] = useState(false)
	const [isCastModalVisible, setIsCastModalVisible] = useState(false)
	const [poster, setPoster] = useState("")
	const [isGenresModalVisible, setIsGenresModalVisible] = useState(false)

	function handleSubmit(e) {
		e.preventDefault()

		console.log(movieInfo)
	}

	const { updateNotification } = useNotification()

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
	}

	function updateCast(castInfo) {
		const { cast } = movieInfo
		setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] })
	}

	function updateWriters(writer) {
		if (!movieInfo.writers.includes(writer)) {
			setMovieInfo({ ...movieInfo, writers: [...movieInfo.writers, writer] })
			return
		}
		updateNotification("Warning", "This profile is already selected")
	}

	const { title, storyLine, director, writers, cast, type, language, status } = movieInfo

	function handleRemoveWriter(writer) {
		const modifiedArray = movieInfo.writers.filter(w => w.name !== writer)
		setMovieInfo({ ...movieInfo, writers: [...modifiedArray] })
	}

	function handleRemoveCast(castName) {
		const modifedArray = cast.filter(c => c.profile.name !== castName)
		setMovieInfo({ ...movieInfo, cast: [...modifedArray] })
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
							results={results}
							placeholder="Search profile"
							renderItem={renderItem}
							onSelect={updateDirector}
						/>
					</div>

					<div>
						<div className="flex justify-between">
							<LabelWithBadge htmlFor="writers" badge={writers.length}>
								Writers
							</LabelWithBadge>
							{writers.length > 0 && (
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
							results={results}
							placeholder="Search profile"
							renderItem={renderItem}
							onSelect={updateWriters}
						/>
					</div>

					<div>
						<div className="flex justify-between">
							<LabelWithBadge badge={cast.length}>Add Cast & Crew</LabelWithBadge>
							{cast.length > 0 && (
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
					<SelectPoster name="poster" onChange={handleChange} selectedPoster={poster} />

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
			{/* <ModalComponent
				isModalVisible={isModalVisible}
				onClose={() => setIsModalVisible(value => !value)}
			>
				<div className="p-20 bg-red-200"></div>
			</ModalComponent> */}

			<WritersModal
				isModalVisible={isWritersModalVisible}
				onClose={() => setIsWritersModalVisible(value => !value)}
				profiles={writers}
				modifyWriters={handleRemoveWriter}
			/>
			<CastModal
				isModalVisible={isCastModalVisible}
				onClose={() => setIsWritersModalVisible(false)}
				casts={cast}
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
