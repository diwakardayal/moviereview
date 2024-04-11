/* eslint-disable react/prop-types */
export default function ModalComponent({ isModalVisible, ignoreContainer, children, onClose }) {
	function handleClick(e) {
		if (e.target.id === "modal-container") {
			onClose()
		}
	}

	function renderChildren() {
		if (ignoreContainer) return children
		return (
			<div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] p-2 custom-scroll-bar">
				{children}
			</div>
		)
	}
	if (!isModalVisible) return null
	return (
		<div
			id="modal-container"
			onClick={handleClick}
			className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
		>
			{renderChildren()}
		</div>
	)
}
