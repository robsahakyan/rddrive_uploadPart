import { useRouter } from 'next/router'
import {VscError} from 'react-icons/vsc'
import styles from './styles/error.module.css'

export const ErrorComponent = ({error}: {error: string}) => {
    const router = useRouter();
    const tryAgainHandler = () => {
        router.reload()
    }

    return (
        <div className={styles.errorPart}>
            <div>
                <VscError className={styles.errorIcon}/>
            </div>
            <div className={styles.errorPgh}>
                Something went wrong
            </div>
            <div className={styles.errorText}>
                {error}
            </div>
            <div >
                <button className={styles.tryAgainButton} onClick={tryAgainHandler}>
                    Try again
                </button>
            </div>
        </div>
    )
}