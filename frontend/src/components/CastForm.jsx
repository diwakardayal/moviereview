/* eslint-disable react/prop-types */
import { useState } from "react"
import LiveSearch from "./LiveSearch"
import { commonInputClasses } from "../utils/theme"
import { renderItem } from "../admin/MovieForm"
import { useNotification, useSearch } from "../hooks"
import { searchActor } from "../services/actor"

const defaultCastInfo = {
	profile: {},
	roleAs: "",
	leadActor: false,
}

export default function CastForm({ onSubmit }) {
	const [castInfo, setCastInfo] = useState({ ...defaultCastInfo })
	const { handleSearch } = useSearch()
	const [actorName, setActorName] = useState("")
	const [actors, setActors] = useState([])

	const { leadActor, roleAs } = castInfo

	const { updateNotification } = useNotification()

	function handleOnChange({ target }) {
		const { checked, name, value } = target

		if (name === "leadActor") return setCastInfo({ ...castInfo, leadActor: checked })

		setCastInfo({ ...castInfo, [name]: value })
	}

	function handleProfileSelect(profile) {
		setActorName(profile.name)
		setCastInfo({ ...castInfo, profile })
	}

	function handleSubmit() {
		const { profile, roleAs } = castInfo

		if (!profile.name) return updateNotification("error", "Cast profile is missing")

		if (!roleAs.trim()) return updateNotification("error", "Cast role is missing")

		onSubmit(castInfo)
		setCastInfo({ ...defaultCastInfo })
		setActorName("")
	}

	function handleOnChangeLiveSearch(e) {
		const { value } = e.target

		handleSearch(searchActor, value, setActors)
	}

	return (
		<div className="flex items-center space-x-2">
			<input
				type="checkbox"
				name="leadActor"
				className="w-4 h-4 cursor-pointer"
				checked={leadActor}
				onChange={handleOnChange}
				title="Set as lead actor"
			/>

			<div className="w-full">
				<LiveSearch
					name="cast&Crew"
					placeholder="Search profile"
					value={actorName}
					results={actors}
					onSelect={handleProfileSelect}
					renderItem={renderItem}
					onChange={handleOnChangeLiveSearch}
					isModalVisible={actors.length}
				/>
			</div>
			<span className="dark:text-dark-subtle text-light-subtle font-semibold">as</span>

			<input
				type="text"
				name="roleAs"
				className={commonInputClasses + " rounded p-1 text-lg border-2"}
				placeholder="Role as"
				value={roleAs}
				onChange={handleOnChange}
			/>

			<button
				onClick={handleSubmit}
				type="button"
				className="bg-secondary text-white dark:text-primary dark:bg-white px-2 py-1 rounded"
			>
				Add
			</button>
		</div>
	)
}
