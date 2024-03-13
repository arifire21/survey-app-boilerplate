import styles from '../app/match-survey/match.module.css'
import { Input } from "@mui/joy"

export default function CounterButton(count){

    return(
        <div className={styles.container}>
            <button
                type="button"
                className={styles.leftButton}
                onClick={() => setCount(count == 0 ? 0 : (count - 1))}>
                -
            </button>
            <Input
            readOnly
            value={count}
            className={styles.counterInput}
            sx={{ '& input': { textAlign: 'center' }}}/>
            <button
                type="button"
                className={styles.rightButton}
                onClick={() => setCount(count + 1)}>
                +
            </button>
        </div>
    )
}