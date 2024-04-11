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
				{profiles.map(({ name, avatar }, index) => (
					<div className="flex justify-between dark:text-white" key={index}>
						<div className="flex gap-2">
							<img
								className="w-16 h-16 aspect-square rounded object-cover"
								src={avatar}
								alt={avatar}
							/>
							<p className="mt-2">{name}</p>
						</div>
						<div className="mt-2 ml-5 cursor-pointer" onClick={() => modifyWriters(name)}>
							<IoCloseOutline size={20} />
						</div>
					</div>
				))}
			</div>
		</ModalComponent>
	)
}
