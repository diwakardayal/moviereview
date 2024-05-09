/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom"
import { addReview } from "../../services/review"
import { useNotification } from "../../hooks"
import RatingForm from "../form/RatingModal"
import ModalContainer from "./ModalContainer"

export default function AddRatingModal({ isModalVisible, onSuccess, onClose }) {
	const { movieId } = useParams()
	const { updateNotification } = useNotification()

	const handleSubmit = async data => {
		const { error, review } = await addReview(movieId, data)
		if (error) return updateNotification("error", error)

		updateNotification("success", "Review added")
		onSuccess(review)
		onClose()
	}
	return (
		<ModalContainer isModalVisible={isModalVisible} onClose={onClose} ignoreContainer>
			<RatingForm onSubmit={handleSubmit} />
		</ModalContainer>
	)
}
