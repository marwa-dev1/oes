import style from './TabH.module.css'
import zIndex from '@material-ui/core/styles/zIndex'

const TabH = ({left, title, active, zindex, activeColor}) => {
    let color = "rgb(219, 219, 219)"
    let zIndex = zindex;
    let height = 30;
    if(active){
        color = activeColor?activeColor:"white"
        zIndex = 5;
        height = 31.5
    }
    return (
        <div className={style.main} style={{left: 200+left, backgroundColor:color, zIndex:zIndex, height: height}}>
            <p> {title} </p>
        </div>
    )
}

export default TabH
