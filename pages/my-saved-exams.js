import style from '../styles/my-saved-exams.module.css'
import {useState, useEffect, useContext} from 'react'
import Tab from '../c/small/Tab/Tab'
import { AuthContext } from '../contexts/AuthContext';
import firebase from '../firebase/firebase'
import Loader from '../c/small/Loader/Loader';
import CardsGrid from '../c/regular/CardsGrid/CardsGrid';

const mySavedExams = () => {
    const [savedExams, setSavedExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user,userType} = useContext(AuthContext);
    
    useEffect(()=>{
        if(userType!=='student'){
            firebase.database().ref(`main/users/teachers/${user.uid}/unpublished-exams`).once("value", unpublishedExams=>{
                unpublishedExams.forEach(course=>{
                    course.forEach(exam=>{
                        setSavedExams(savedExams=>[...savedExams,exam.val()])
                    })
                })
            }).then(()=>{
                setLoading(false);
            })
        }
    },[])

    if(loading){
        return <Loader/>
    }

    return (
        <Tab index={0} active={true} color="white">
            <CardsGrid title="Saved Exams" data={savedExams} published={false}/>
        </Tab>
    )
}

export default mySavedExams
