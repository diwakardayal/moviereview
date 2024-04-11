/* eslint-disable react/prop-types */
import { useState } from "react"
import LiveSearch from "./LiveSearch"
import { commonInputClasses } from "../utils/theme"
import { renderItem, results } from "../admin/MovieForm"
import { useNotification } from "../hooks"

const defaultCastInfo = {
	profile: {},
	roleAs: "",
	leadActor: false,
}

export default function CastForm({ onSubmit }) {
	const [castInfo, setCastInfo] = useState({ ...defaultCastInfo })

	const { leadActor, profile, roleAs } = castInfo

	const { updateNotification } = useNotification()

	function handleOnChange({ target }) {
		const { checked, name, value } = target

		if (name === "leadActor") return setCastInfo({ ...castInfo, leadActor: checked })

		setCastInfo({ ...castInfo, [name]: value })
	}

	function handleProfileSelect(profile) {
		setCastInfo({ ...castInfo, profile })
	}

	function handleSubmit() {
		const { profile, roleAs } = castInfo

		if (!profile.name) return updateNotification("error", "Cast profile is missing")

		if (!roleAs.trim()) return updateNotification("error", "Cast role is missing")

		onSubmit(castInfo)
		setCastInfo({ ...defaultCastInfo })
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
			<LiveSearch
				placeholder="Search profile"
				value={profile.name}
				results={results}
				onSelect={handleProfileSelect}
				renderItem={renderItem}
			/>
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
