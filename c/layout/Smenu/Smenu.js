import {useRouter} from 'next/router'
import Link from 'next/link'
import style from './Smenu.module.css'
import { IoIosArrowUp,IoIosArrowDown } from 'react-icons/io'
import { GoDiffAdded } from 'react-icons/go'
import {FaHome} from 'react-icons/fa'
import SlideToggle from 'react-slide-toggle'
import { useState, useEffect, useContext } from 'react'
import Popup from '../../small/Popup/Popup'
import { AnimatePresence, motion } from 'framer-motion'
import SmenuSection from '../../small/SmenuSection/SmenuSection'
import { AuthContext } from '../../../contexts/AuthContext'
import FitLoader from '../../small/FitLoader/FitLoader'
import firebase from '../../../firebase/firebase'

const Smenu = () => {
    const {user, userType} = useContext(AuthContext);
    const [ needCourses, setNeedCourses] = useState(null);
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const close = () => {
        setShowPopup(false);
    }

    const [ showPopup, setShowPopup] = useState(false);

    const popup = () => {
        setShowPopup(true);
    }

    useEffect(() => {
            firebase.database().ref(`main/users/${userType}s`).child(user.uid).once("value", snapshot=>{
                if(!snapshot.val().courses){
                    setNeedCourses(true);
                    router.push('/add-courses')
                }
                else {
                    setCourses(snapshot.val().courses)
                }
                }).then(()=>{
                    setLoading(false);
                }).catch(e=>console.log('Some Error Accured'))
      }, [])

    return (
        <div className={style.main}>
            <Link href="/">
                <button className={style.newexam_btn}>
                    HOME <FaHome color="white" size={16}/>
                </button>
            </Link>
        {
            loading?
            <FitLoader/>
            :
            courses?
            <>
            <Popup close={close} show={showPopup?true:false}/>
            {
                userType==='teacher'?
                <>
                <Link href="">
                    <button className={style.newexam_btn} onClick={popup}>
                        NEW EXAM <GoDiffAdded color="white" size={16}/>
                    </button>
                </Link>
                </>
                :<></>
            }
            <SmenuSection topics={['Courses','Exams']} subtopics={[courses.map(e=>e),['Quizzes','Midterms','Finals']]} 
            links={[courses.map(e=>
                {
                    return{
                        href:'/courses/[id]',
                        as:`/courses/${e.split('-')[1]}-${e.split('-')[0]}`
                    }
                }
                ),['/exam-type/quizzes','/exam-type/mt','/exam-type/finals']]} />
            </>
            : <SmenuSection topics={['Add Your Courses']} subtopics={null} links={['/add-courses']}/>
            
        }
        </div>
    )
}

export default Smenu
