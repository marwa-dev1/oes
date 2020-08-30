import style from './Tab.module.css'

const Tab = ({children, active, color}) => {
    return (
        <>{
            active?
            <div className={style.main} style={{backgroundColor:color}}>
                {children}
            </div>:<></>
        }</>
    )
}

export default Tab
