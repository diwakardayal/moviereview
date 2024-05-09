/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useState, useEffect, useRef, forwardRef } from "react"
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai"
import { Link } from "react-router-dom"
import { useNotification } from "../../hooks"
import { getLatestUploads } from "../../services/movie"

let count = 0
let intervalId

let newTime = 0
let lastTime = 0

export default function HeroSlider() {
	const [currentSlide, setCurrentSlide] = useState({})
	const [clonedSlide, setClonedSlide] = useState({})
	const [slides, setSlides] = useState([])
	const [upNext, setUpNext] = useState([])
	const [isVisible, setIsVisible] = useState(true)
	const slideRef = useRef()
	const clonedSlideRef = useRef()

	const { updateNotification } = useNotification()

	async function fetchLatestUploads(signal) {
		const { error, movies } = await getLatestUploads(signal)
		if (error) return updateNotification("error", error)

		setSlides([...movies])
		setCurrentSlide(movies[0])
	}

	function startSlideShow() {
		intervalId = setInterval(() => {
			newTime = Date.now()
			const delta = newTime - lastTime
			if (delta < 4000) return clearInterval(intervalId)
			handleOnNextClick()
		}, 3500)
	}

	function pauseSlideShow() {
		clearInterval(intervalId)
	}

	function updateUpNext(currentIndex) {
		if (!slides.length) return

		const upNextCount = currentIndex + 1
		const end = upNextCount + 3

		let newSlides = [...slides]
		newSlides = newSlides.slice(upNextCount, end)

		if (!newSlides.length) {
			newSlides = [...slides].slice(0, 3)
		}

		setUpNext([...newSlides])
	}

	//0,1,2,3,4
	function handleOnNextClick() {
		lastTime = Date.now()
		pauseSlideShow()
		setClonedSlide(slides[count])
		count = (count + 1) % slides.length
		setCurrentSlide(slides[count])

		clonedSlideRef.current.classList.add("slide-out-to-left")
		slideRef.current.classList.add("slide-in-from-right")
		updateUpNext(count)
	}

	function handleOnPrevClick() {
		pauseSlideShow()
		setClonedSlide(slides[count])
		count = (count + slides.length - 1) % slides.length

		setCurrentSlide(slides[count])
		clonedSlideRef.current.classList.add("slide-out-to-right")
		slideRef.current.classList.add("slide-in-from-left")
		updateUpNext(count)
	}

	function handleAnimationEnd() {
		const classes = [
			"slide-out-to-left",
			"slide-in-from-right",
			"slide-out-to-right",
			"slide-in-from-left",
		]
		slideRef.current.classList.remove(...classes)
		clonedSlideRef.current.classList.remove(...classes)
		setClonedSlide({})
		startSlideShow()
	}

	function handleOnVisibilityChange() {
		const visibility = document.visibilityState
		if (visibility === "hidden") setIsVisible(false)
		if (visibility === "visible") setIsVisible(true)
	}

	useEffect(() => {
		const ac = new AbortController()
		fetchLatestUploads(ac.signal)
		document.addEventListener("visibilitychange", handleOnVisibilityChange)

		return () => {
			pauseSlideShow()
			document.removeEventListener("visibilitychange", handleOnVisibilityChange)
			ac.abort()
		}
	}, [])

	useEffect(() => {
		if (slides.length && isVisible) {
			startSlideShow()
			updateUpNext(count)
		} else pauseSlideShow()
	}, [slides.length, isVisible])

	return (
		<div className="w-full flex">
			{/* Slide show section */}
			<div className="md:w-4/5 w-full aspect-video relative overflow-hidden">
				{/* current slide */}
				<Slide
					ref={slideRef}
					title={currentSlide.title}
					src={currentSlide.poster}
					id={currentSlide.id}
				/>

				{/* cloned slide */}
				<Slide
					ref={clonedSlideRef}
					onAnimationEnd={handleAnimationEnd}
					className="absolute inset-0"
					src={clonedSlide.poster}
					title={clonedSlide.title}
					id={currentSlide.id}
				/>

				<SlideShowController
					onNextClick={handleOnNextClick}
					onPrevClick={handleOnPrevClick}
				/>
			</div>

			{/* Up Next Section */}
			<div className="w-1/5 md:block hidden space-y-3 px-3">
				<h1 className="font-semibold text-2xl text-primary dark:text-white">Up Next</h1>
				{upNext.map(({ poster, id }) => {
					return (
						<img
							key={id}
							src={poster}
							alt={poster}
							className="aspect-video object-cover rounded"
						/>
					)
				})}
			</div>
		</div>
	)
}

const SlideShowController = ({ onNextClick, onPrevClick }) => {
	const btnClass = "bg-primary rounded border-2 text-white text-xl p-2 outline-none"
	return (
		<div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
			<button onClick={onPrevClick} className={btnClass} type="button">
				<AiOutlineDoubleLeft />
			</button>
			<button onClick={onNextClick} className={btnClass} type="button">
				<AiOutlineDoubleRight />
			</button>
		</div>
	)
}

const Slide = forwardRef((props, ref) => {
	const { title, id, src, className = "", ...rest } = props
	return (
		<Link
			to={"/movie/" + id}
			ref={ref}
			className={"w-full cursor-pointer block " + className}
			{...rest}
		>
			{src ? <img className="aspect-video object-cover" src={src} alt="" /> : null}
			{title ? (
				<div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white via-transparent dark:from-primary dark:via-transparent">
					<h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
						{title}
					</h1>
				</div>
			) : null}
		</Link>
	)
})
