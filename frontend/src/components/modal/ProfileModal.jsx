/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { getActorProfile } from "../../services/actor"
import { useNotification } from "../../hooks"
import ModalContainer from "./ModalContainer"

export default function ProfileModal({ isModalVisible, profileId, onClose, type }) {
	const [profile, setProfile] = useState({})

	const { updateNotification } = useNotification()

	const fetchCastProfile = async () => {
		let error, actor
		switch (type) {
			case "director":
				;({ error, actor } = await getActorProfile(profileId)) // Corrected destructuring
				break
			case "actor":
				break
			case "writer":
				break
			default:
		}

		if (error) return updateNotification("error", error)

		setProfile(actor)
	}

	useEffect(() => {
		if (profileId) fetchCastProfile()
	}, [profileId])

	const { avatar, name, about } = profile

	return (
		<ModalContainer isModalVisible={isModalVisible} onClose={onClose} ignoreContainer>
			<div className="w-72 p-5 rounded flex flex-col items-center bg-white dark:bg-primary space-y-3">
				<img className="w-28 h-28 rounded-full" src={avatar} alt="" />
				<h1 className="dark:text-white text-primary font-semibold">{name}</h1>
				<p className="dark:text-dark-subtle text-light-subtle">{about}</p>
			</div>
		</ModalContainer>
	)
}
