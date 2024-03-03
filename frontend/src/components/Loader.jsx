import { TailSpin } from "react-loader-spinner"

export default function Loader() {
	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
			<TailSpin
				visible={true}
				height="80"
				width="80"
				color="#232323"
				ariaLabel="tail-spin-loading"
				radius="1"
				wrapperStyle={{}}
				wrapperClass=""
				className=""
			/>
		</div>
	)
}
