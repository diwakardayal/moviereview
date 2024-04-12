/* eslint-disable react/prop-types */
import { useState } from "react"
import { commonInputClasses } from "../utils/theme"
import SelectPoster from "./SelectPoster"
import Selector from "./Selector"
import { useNotification } from "../hooks/index"
import { ImSpinner3 } from "react-icons/im"

const defaultActorInfo = {
	name: "",
	about: "",
	avatar: null,
	gender: "",
}

const genderOptions = [
	{ title: "Male", value: "male" },
	{ title: "Female", value: "female" },
	{ title: "Other", value: "other" },
]

function validateActor({ avatar, name, about, gender }) {
	if (!name.trim()) return { error: "Actor name is missing!" }
	if (!about.trim()) return { error: "About name is missing!" }
	if (!gender.trim()) return { error: "Gender name is missing!" }

	if (avatar && !avatar.type?.startsWith("image")) return { error: "Invalid image / avatar file" }

	return { error: null }
}

export default function ActorForm({ title, btnTitle, onSubmit, busy }) {
	const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo })
	const [avatar, setAvatar] = useState()
	const { updateNotification } = useNotification()

	function handleChange({ target }) {
		const { value, files, name } = target

		if (name === "avatar") {
			const file = files[0]
			setAvatar(URL.createObjectURL(file))
			setActorInfo({ ...actorInfo, avatar: file })
			return
		}

		setActorInfo({ ...actorInfo, [name]: value })
	}

	function handleSubmit(e) {
		e.preventDefault()
		const { error } = validateActor(actorInfo)

		if (error) return updateNotification("error", error)

		const formData = new FormData()
		for (let key in actorInfo) {
			if (key) formData.append(key, actorInfo[key])
		}

		console.log(actorInfo)
		onSubmit(actorInfo)
	}

	const { name, about, gender } = actorInfo

	return (
		<form className="dark:bg-primary bg-white p-3 w-[35rem] rounded" onSubmit={handleSubmit}>
			<div className="flex justify-between items-center mb-3">
				<h1 className="font-semibold text-xl dark:text-white text-primary">{title}</h1>
				<button
					className="px-3 py-1 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded"
					type="submit"
				>
					{btnTitle}
				</button>
				{busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
			</div>

			<div className="flex space-x-2">
				<SelectPoster
					label="Select Avatar"
					className={"w-36 h-36 aspect-square object-cover rounded"}
					selectedPoster={avatar}
					name="avatar"
					onChange={handleChange}
				/>
				<div className="flex-grow flex flex-col space-y-2">
					<input
						name="name"
						value={name}
						placeholder="Enter name"
						type="text"
						className={commonInputClasses + " border-b-2"}
						onChange={handleChange}
					/>
					<textarea
						name="about"
						value={about}
						placeholder="About"
						className={commonInputClasses + " border-b-2 resize-none h-full"}
						onChange={handleChange}
					></textarea>
				</div>
			</div>
			<div className="mt-2">
				<Selector
					options={genderOptions}
					label="Gender"
					value={gender}
					onChange={handleChange}
					name="gender"
				/>
			</div>
		</form>
	)
}
