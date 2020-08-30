import {useState, useEffect, useContext} from 'react'
import firebase from '../../firebase/firebase'
import Tab from '../../c/small/Tab/Tab'
import TabH from '../../c/small/TabH/TabH'
import CardsGrid from '../../c/regular/CardsGrid/CardsGrid'
import { AuthContext } from '../../contexts/AuthContext'
import Loader from '../../c/small/Loader/Loader'

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user,userType} = useContext(AuthContext);

    useEffect(()=>{
        firebase.database().ref(`main/users/${userType}s/${user.uid}/courses`).once("value", courses=>{
            if(courses.val())
            courses.forEach(course=>{
                if(course.val())
                firebase.database().ref('courses').once("value", coursesSH=>{
                    coursesSH.forEach(csh=>{
                        if(course.val() === `${csh.val().id}-${csh.val().title}` && csh.val().exams){
                            csh.val().exams.forEach(exam=>{
                                if(exam.type==='quiz' && (exam.authorId === user.uid || userType==="student")){
                                    setQuizzes(quizzes=>[...quizzes, exam]);
                                }
                            })
                        }
                    })
                })
            })
        }).then(()=>{
            setLoading(false);
        })
    },[])

    if(loading){
        return <Loader/>
    }

    return (
        <Tab active={true} color="white">
            <TabH title="Quizzes" active={true} index={0} left={0}/>
            <CardsGrid title="All Quizzes" data={quizzes} published={true}/>
        </Tab>
    )
}

export default Quizzes
