import styles from '@/styles/alert.module.css'
import {Button} from '@mui/joy'

//mode can be 'dev' or 'postseason'

export default function Alert(mode){
    function handleClose(id){
        let e = document.querySelector(id)
        e.remove();
    }

    return(
        <div className={styles.alertContainer} id={`${mode}-alert`}>
            <h4>{mode === 'postseason' ? 'Postseason' : 'Dev'} Mode</h4>
            <p>{mode.toUppercase()} MODE Enabled</p>
            {mode === 'postseason' ? (
                <p>Previous records and forms are available, but new records cannot be added.</p>
            ) : (
                <p>The app will use dev-specific APIs.</p>
            )}
            <Button onClick={()=>handleClose(`${mode}-alert`)}>Okay</Button>
        </div>
    )
}