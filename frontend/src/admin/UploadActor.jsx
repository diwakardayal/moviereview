/* eslint-disable react/prop-types */
import { useState } from "react"
import ActorForm from "../components/ActorForm"
import ModalComponent from "../components/modal/ModalContainer"
import { useNotification } from "../hooks"
import { createActor } from "../services/actor"

export default function UploadActor({ isModalVisible, onClose }) {
	const [busy, setBusy] = useState(false)
	const { updateNotification } = useNotification()

	async function handleSubmit(data) {
		setBusy(true)
		const { error } = await createActor(data)
		setBusy(false)
		if (error) return updateNotification("error", error)
		updateNotification("success", "Actor created successfully")
		onClose()
	}

	return (
		<ModalComponent isModalVisible={isModalVisible} onClose={onClose} ignoreContainer>
			<ActorForm
				title="Create New Actor"
				btnTitle="Create"
				onSubmit={!busy ? handleSubmit : null}
			/>
		</ModalComponent>
	)
}
