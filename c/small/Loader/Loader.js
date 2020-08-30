import style from './Loader.module.css'

const Loader = () => {
    return (
        <div className={style.main}>
            <div className={style.inner}>
                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
        </div>
    )
}

export default Loader
