import Image from "next/image"
import LoadingGif from '../public/assets/images/Loading_icon.gif'

export const Loader = () => {
    return (
        <div>
            <Image src={LoadingGif} alt='loading' />
        </div>
    )
}