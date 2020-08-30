import style from './Gate.module.css'
import Login from './Login'
import Signup from './Signup'
import { useState } from 'react'
import Header from '../../layout/Header/Header'
const Gate = () => {
    const [option, setOption] = useState('login');
    return (
        <>
        <Header logged={false}/>
        <div className={style.main}>
            <div className={style.card}>
                <div className={style.options}>
                    <div className={style.option} onClick={()=>setOption('login')}>
                        Login
                    </div>
                    <div className={style.option} onClick={()=>setOption('signup')}>
                        Sign Up
                    </div>
                </div>
                <div className={style.form_container} style={{width:option==='login'?400:800, transition:'all .15s ease-out'}}>
                {
                    option==='login'?
                    <Login/>
                    :
                    <Signup/>
                }
                </div>
            </div>
        </div>
        </>
    )
}

export default Gate
