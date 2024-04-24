/* eslint-disable react/prop-types */
import ModalComponent from "./ModalContainer"
import { IoCloseOutline } from "react-icons/io5"

export default function WritersModal({ profiles = [], isModalVisible, onClose, modifyWriters }) {
	if (!isModalVisible) return null

	if (profiles.length === 0) {
		return null
	}

	return (
		<ModalComponent isModalVisible={isModalVisible} onClose={onClose} ignoreContainer={true}>
			<div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] p-2 custom-scroll-bar">
				{profiles.map((profile, index) => (
					<div className="flex justify-between dark:text-white" key={index}>
						<div className="flex gap-1">
							<img
								className="w-16 h-16 aspect-square rounded object-cover"
								src={profile.avatar}
								alt={profile.avatar}
							/>
						</div>
						<div className="flex gap-2">
							<p className="mt-2">{profile.name}</p>
						</div>
						<div
							className="mt-2 ml-5 cursor-pointer"
							onClick={() => modifyWriters(profile)}
						>
							<IoCloseOutline size={20} />
						</div>
					</div>
				))}
			</div>
		</ModalComponent>
	)
}
