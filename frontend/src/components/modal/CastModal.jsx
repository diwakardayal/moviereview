/* eslint-disable react/prop-types */
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai"
import ModalComponent from "./ModalContainer"

export default function CastModal({ casts = [], isModalVisible, onClose, onRemoveClick }) {
	if (!isModalVisible) return null

	if (casts.length === 0) {
		return null
	}

	return (
		<ModalComponent isModalVisible={isModalVisible} onClose={onClose} ignoreContainer={true}>
			<div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] p-2 custom-scroll-bar">
				{casts.map(({ profile, roleAs, leadActor }) => (
					<div
						className="flex justify-between dark:text-white space-x-3"
						key={profile.id}
					>
						<div className="flex gap-1">
							<img
								className="w-16 h-16 aspect-square rounded object-cover"
								src={profile.avatar}
								alt={profile.avatar}
							/>
						</div>
						<div className="w-full flex flex-col">
							<div>
								<p className="font-semibody dark:text-white text-primary">
									{profile.name}
								</p>
							</div>
							<p className="text-sm dark:text-dark-subtle text-light-subtle">
								{roleAs}
							</p>
							{leadActor && (
								<AiOutlineCheck className="text-light-subtle dark:text-dark-subtle mt-1" />
							)}
						</div>
						<button
							className="mt-2 ml-5 cursor-pointer"
							onClick={() => onRemoveClick(profile.name)}
						>
							<AiOutlineClose />
						</button>
					</div>
				))}
			</div>
		</ModalComponent>
	)
}
