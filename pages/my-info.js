import style from '../styles/my-info.module.css'
import firebase from '../firebase/firebase'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../c/small/Loader/Loader';

const myInfo = () => {
    const [loading, setLoading] = useState(true);
    const {user, userType, name, surname} = useContext(AuthContext);
    const [userObj, setUserObj] = useState({})

    useEffect(()=>{
        firebase.database().ref(`main/users/${userType}s/${user.uid}`).once("value", userSnapshot=>{
            setUserObj(userSnapshot.val());
        }).then(()=>{
            setLoading(false);
        })
    },[])

    if(loading){
        return <Loader/>
    }
    return (
        <div className={style.main}>
            <h2 className={style.title}>My Info</h2>
                    <div className={style.single_info}>
                        <div className={style.section_title}>
                            <h3>Full Name</h3>
                        </div>
                        <div className={style.section_info}>
                            <h5>{userObj.name + ' ' +userObj.surname}</h5>
                        </div>
                    </div>
                    <div className={style.single_info}>
                        <div className={style.section_title}>
                            <h3>ID</h3>
                        </div>
                        <div className={style.section_info}>
                            <h5>{userObj.id}</h5>
                        </div>
                    </div>
                    <div className={style.single_info}>
                        <div className={style.section_title}>
                            <h3>Email</h3>
                        </div>
                        <div className={style.section_info}>
                            <h5>{userObj.email}</h5>
                        </div>
                    </div>
                    <div className={style.single_info}>
                        <div className={style.section_title}>
                            <h3>Courses</h3>
                        </div>
                        <div className={style.section_info}>
                            <h5>{userObj.courses.map((e,i)=>{
                                if(i===userObj.courses.length-1)
                                return e
                                else return `${e}, `
                            })}</h5>
                        </div>
                    </div>
        </div>
    )
}

export default myInfo
