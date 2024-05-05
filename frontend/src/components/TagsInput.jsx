/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"

export default function TagsInput({ name, onChange, initialTags = null }) {
	const [tag, setTag] = useState("")
	const [tags, setTags] = useState(initialTags || [])

	const input = useRef()
	const tagsInput = useRef()

	function handleOnChange({ target }) {
		const { value } = target

		setTag(value)
	}

	function handleKeyDown({ key }) {
		if (key === "," || key === "Enter") {
			if (!tag) return

			if (tags.includes(tag)) return setTag("")
			setTags([...tags, tag])
			setTag("")
			onChange([...tags, tag])
		}

		if (key === "Backspace" && tags.length) {
			const newTags = tags.filter((_, index) => index !== tags.length - 1)
			setTags([...newTags])
		}
	}

	function removeTag(tag) {
		const newTags = tags.filter(t => t !== tag)
		setTags([...newTags])
	}

	function handleOnFocus() {
		tagsInput.current.classList.remove("dark:border-dark-subtle", "border-light-subtle")
		tagsInput.current.classList.add("dark:border-white", "border-primary")
	}

	function handleOnBlur() {
		tagsInput.current.classList.add("dark:border-dark-subtle", "border-light-subtle")
		tagsInput.current.classList.remove("dark:border-white", "border-primary")
	}

	useEffect(() => {
		input.current?.scrollIntoView()
	}, [tag])

	return (
		<div>
			<div
				className="border-2 bg-transparent dark:border-dark-subtle border-light-subtle px-2 h-10 rounded w-full text-white flex items-center space-x-2 overflow-x-auto custom-scroll-bar transition"
				onKeyDown={handleKeyDown}
				ref={tagsInput}
			>
				{tags.map(t => (
					<Tag onClick={() => removeTag(t)} key={t}>
						{t}
					</Tag>
				))}
				<input
					name={name}
					ref={input}
					type="text"
					className="h-full flex-grow bg-transparent outline-none dark:text-white text-black"
					placeholder="Tag one, Tag two"
					value={tag}
					onChange={handleOnChange}
					onFocus={handleOnFocus}
					onBlur={handleOnBlur}
				/>
			</div>
		</div>
	)
}

function Tag({ children, onClick }) {
	return (
		<span className="dark:bg-white bg-primary dark:text-primary text-white items-center text-sm px-1 whitespace-nowrap">
			{children}
			<button type="button" onClick={onClick}>
				<AiOutlineClose size={12} />
			</button>
		</span>
	)
}
