import style from './Tail.module.css'
import {IoMdSettings} from 'react-icons/io'

const Tail = () => {
    return (
        <div className={style.main}>
            <div className={style.icons_s}>
                <IoMdSettings size={19}/>
                <p>Settings</p>
            </div>

            <div className={style.rr}>
                <p> All rights reserved R</p>
            </div>
        </div>
    )
}

export default Tail
