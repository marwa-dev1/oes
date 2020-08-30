import style from './Notification.module.css'
import { useState, useEffect, useContext } from 'react'
import firebase from '../../../firebase/firebase'
import { AuthContext } from '../../../contexts/AuthContext';
import FitLoader from '../FitLoader/FitLoader'

const Notification = ({displayCrimson, hide}) => {
    const [notifications, setNotifications] = useState([]);
    const {user, userType} = useContext(AuthContext);
    const [empty, setEmpty] = useState(false);

    let tch, std;
    if(userType==='teacher'){
        tch= true;
        std=false
    }
    else{
        tch=false;
        std=true;
    }

    useEffect(()=>{
        firebase.database().ref(`main/users/${userType}s/${user.uid}/notifications`).once("value", snapshot=>{
            if(snapshot.val()){
                const notarr = [];
                snapshot.forEach(e=>{
                    notarr.push(e.val());
                    displayCrimson();
                })
                for(let i=notarr.length-1; i>=0; i-- ){
                    setNotifications(notifications=>[...notifications, notarr[i]]);
                }
            }
            else setEmpty(true);
        })
    },[])

    return (
        <div className={style.main} style={hide?{display:'none'}:{}}>
            <div className={style.innerMain}>
            {
                notifications.length>0?
                notifications.map((e,i)=>
                        <div key={i}>
                        {   
                            !e.checked?
                            <div key={i} className={style.single}>
                                <div className={style.date}>{e.date}</div>
                                <div>{e.notificationText}</div>
                            </div>:<></>
                        }
                        </div>
                    
                ):
                empty?
                <div className={style.single}>
                    <div> No New Notifications </div>
                </div>
                :
                <FitLoader/>
            }
            </div>
        </div>
    )
}

export default Notification
