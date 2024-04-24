/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FileUploader } from "react-drag-drop-files"
import { uploadTrailer } from "../services/movie"
import { useNotification } from "../hooks"
import { AiOutlineCloudUpload } from "react-icons/ai"
import { useState } from "react"
import MovieForm from "./MovieForm"
import ModalComponent from "../components/modal/ModalContainer"

export default function UploadMovie({ isMovieFormVisible, onClose }) {
	const [isVideoSelected, setIsVideoSelected] = useState(false)
	const [isVideoUploaded, setIsVideoUploaded] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)
	const [trailer, setTrailer] = useState({
		url: "",
		public_id: "",
	})

	const { updateNotification } = useNotification()

	function handleTypeError(e) {
		updateNotification("error", e)
		console.log(e)
	}

	async function handleChange(file) {
		try {
			const formData = new FormData()
			formData.append("video", file)

			setIsVideoSelected(true)
			const res = await uploadTrailer(formData, setUploadProgress)
			const { public_id, url } = res
			console.log(public_id, url)
			setTrailer({
				public_id,
				url,
			})

			setIsVideoUploaded(true)
			if (!res.error) {
				setIsVideoUploaded(false)
			}
		} catch (e) {
			setIsVideoUploaded(false)
		}
	}

	function getUploadProgressValue() {
		if (!isVideoUploaded && uploadProgress >= 100) {
			return "Processing!"
		}

		return `Upload progress ${uploadProgress}%`
	}

	return (
		<ModalComponent isModalVisible={isMovieFormVisible} onClose={onClose}>
			<UploadProgress
				visible={isVideoSelected && !isVideoUploaded && uploadProgress < 99}
				message={getUploadProgressValue()}
				width={uploadProgress}
			/>
			{!isVideoSelected ? (
				<TrailerComponent
					visible={!isVideoSelected}
					handleChange={handleChange}
					handleTypeError={handleTypeError}
				/>
			) : (
				<MovieForm trailer={trailer} />
			)}
		</ModalComponent>
	)
}

function TrailerComponent({ visible, handleChange, handleTypeError }) {
	if (!visible) return null
	return (
		<div className="h-full flex items-center justify-center">
			<FileUploader
				handleChange={handleChange}
				onTypeError={handleTypeError}
				name="file"
				types={["mp4", "avi"]}
			>
				<div className="w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle dark:text-dark-subtle text-secondary rounded-full flex items-center justify-center flex-col cursor-pointer">
					<AiOutlineCloudUpload size={80} />
					<p>Upload your file here</p>
				</div>
			</FileUploader>
		</div>
	)
}

function UploadProgress({ message, visible, width }) {
	if (!visible) return null

	return (
		<div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-3">
			<div className="h-3 dark:bg-black-subtle bg-light-subtle">
				<div
					className="left-0 h-full bg-secondary dark:bg-white"
					style={{ width: width + "%" }}
				></div>
			</div>
			<div className="mt-2 font-semibold dark:text-dark-subtle text-light-subtle animate-pulse">
				{message}
			</div>
		</div>
	)
}
