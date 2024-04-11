/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { BsFillSunFill } from "react-icons/bs"
import { useTheme } from "../hooks"

export default function Header({ onAddMovieClick }) {
	const [show, setShow] = useState(false)
	const { toggleTheme } = useTheme()

	return (
		<div className="flex items-center justify-between relative">
			<input
				type="text"
				className="border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary dark:text-white transition bg-transparent rounded text-lg p-1 outline-none"
				placeholder="Search Movies..."
			/>

			<div className="flex items-center space-x-3">
				<button onClick={toggleTheme}>
					<BsFillSunFill className="dark:text-dark-subtle " size={24} />
				</button>
				<button
					className="dark:text-dark-subtle flex items-center space-x-2 border-secondary dark:border-dark-subtle  hover:border-primary text-secondary hover:opacity-80 transition font-semibodl border-2 rounded text-lg px-3 py-1"
					onClick={() => setShow(true)}
				>
					<span>Create</span>
					<AiOutlinePlus />
				</button>

				<CreateOptions
					isVisible={show}
					onClose={() => setShow(false)}
					onAddMovieClick={onAddMovieClick}
				/>
			</div>
		</div>
	)
}

const CreateOptions = ({ isVisible, onClose, onAddMovieClick }) => {
	const container = useRef()
	const containerID = "options-container"

	useEffect(() => {
		const handleClose = e => {
			if (!isVisible) return
			const { parentElement, id } = e.target

			if (parentElement.id === containerID || id === containerID) return

			if (container.current) {
				if (!container.current.classList.contains("animate-show-in"))
					container.current.classList.add("animate-show-out")
			}
		}

		document.addEventListener("click", handleClose)
		return () => {
			document.removeEventListener("click", handleClose)
		}
	}, [isVisible])

	if (!isVisible) return null

	return (
		<div
			id={containerID}
			ref={container}
			className="absolute right-0 top-12 flex flex-col space-y-3 p-5 dark:bg-secondary bg-white drop-shadow-lg rounded animate-show-in"
			onAnimationEnd={e => {
				if (e.target.classList.contains("animate-show-out")) onClose()
				e.target.classList.remove("animate-show-in")
			}}
		>
			<Option onClick={onAddMovieClick}>Add Movie</Option>
			<Option>Add Actor</Option>
		</div>
	)
}

const Option = ({ children, onClick }) => {
	return (
		<button
			className="dark:text-white text-secondary hover:opacity-80 transition"
			onClick={onClick}
		>
			{children}
		</button>
	)
}
