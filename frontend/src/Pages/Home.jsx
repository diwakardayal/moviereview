import HeroSlider from "../components/user/HeroSlider"
import TopRatedMovies from "../components/TopRatedMovies"

export default function Home() {
	return (
		<div className="dark:bg-primary bg-white min-h-screen">
			<div className="max-w-screen-xl mx-auto px-2 xl:p-0 ">
				<HeroSlider />

				<div className="space-y-3 py-8">
					<TopRatedMovies />
				</div>
			</div>
		</div>
	)
}
