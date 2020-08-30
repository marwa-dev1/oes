import style from './AlertModal.module.css'
import {motion, AnimatePresence} from 'framer-motion'

const AlertModal = ({title, message, btntxts, fnBtn1, fnBtn2}) => {
    return (
        <AnimatePresence>
            <motion.div 
                key="modal"
                initial={{opacity:0}}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                exit={{opacity:0, transition:{duration: .4}}}
                className={style.main}
                >
                <motion.div 
                    initial={{scale:0}}
                    animate={{ scale: 1 }}
                    opacity={{scale:0}}
                    transition={{ duration: 0.3 }}
                    className={style.modal}
                >
                    <div className={style.title_s}>
                        <p>{title}</p>
                    </div>
                    <div className={style.content_s}>
                        <div className={style.message}>
                            <p>{message}</p>
                        </div>
                        <div className={style.btns}>
                            <button className={style.btn} onClick={fnBtn1}>
                                {btntxts[0]}
                            </button>
                            <button className={style.btn} onClick={fnBtn2}>
                                {btntxts[1]}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default AlertModal
