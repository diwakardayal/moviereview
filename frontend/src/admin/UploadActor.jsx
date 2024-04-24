/* eslint-disable react/prop-types */
import { useState } from "react"
import CastTypeForm from "../components/CastTypeForm"
import ModalComponent from "../components/modal/ModalContainer"
import { useNotification } from "../hooks"
import { createCast } from "../services/cast"

export default function UploadCast({ isModalVisible, onClose }) {
	const [busy, setBusy] = useState(false)
	const { updateNotification } = useNotification()

	async function handleSubmit(data) {
		setBusy(true)
		const { error } = await createCast(data)
		setBusy(false)
		if (error) return updateNotification("error", error)
		updateNotification("success", "Actor created successfully")
		onClose()
	}

	return (
		<ModalComponent isModalVisible={isModalVisible} onClose={onClose} ignoreContainer>
			<CastTypeForm
				title="Create New"
				btnTitle="Create"
				onSubmit={!busy ? handleSubmit : null}
			/>
		</ModalComponent>
	)
}
