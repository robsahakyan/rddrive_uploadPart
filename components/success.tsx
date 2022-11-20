import styles from './styles/success.module.css'
import { MdDone } from 'react-icons/md'
import { useRouter } from 'next/router'

export const Success = () => {
    const router = useRouter();

    const startAgainHandler = () => {
        return router.reload();
    }

    return (
        <div className={styles.successPart}>
            <div className={styles.successPgh}>
                Your file(s) was/were successfully uploaded
            </div>
            <div className={styles.doneParent}>
                <MdDone className={styles.doneIcon}/>
            </div>
            <button className={styles.buttonTry} onClick={startAgainHandler}>
                Upload again
            </button>
        </div>    
    )
}