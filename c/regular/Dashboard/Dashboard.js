import { useState, useEffect, useContext } from 'react';
import TabH from '../../small/TabH/TabH';
import Tab from '../../small/Tab/Tab';
import CardsGrid from '../CardsGrid/CardsGrid';
import style from './Dashboard.module.css'
import firebase from '../../../firebase/firebase'
import { AuthContext } from '../../../contexts/AuthContext';
import Loader from '../../small/Loader/Loader';
import Link from 'next/link';


const Dashboard = () => {
  const [tabs, setTabs] = useState([true, false, false, false]);
  const [showLoader, setShowLoader] = useState(true);
  const [publishedExams, setPublishedExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const {user,userType} = useContext(AuthContext);



  useEffect(()=>{
           firebase.database().ref('courses').once("value",  snapshot=>{
             snapshot.forEach(e=>{
                 e.child('exams').forEach(el=>{
                    if(el.val().authorId===user.uid){
                        setPublishedExams(publishedExams=> [
                            ...publishedExams,
                              el.val()
                          ]);
                    }
                })
            })
          }).then(()=>{
            setShowLoader(false);
          })
      
      firebase.database().ref('courses').once("value", s=>{
            s.forEach(e=>{
                if(e.val().teachers && e.val().teachers.includes(user.uid)){
                    setCourses(courses=>[...courses, e.val()]);
                }
            })
        })
  }, [])


    return (
        <>
        {
            showLoader?
            <Loader/>
            :
            <div>
                <div onClick={()=>setTabs([true, false, false, false])}>
                    <TabH left={0} zindex={4} title="Exams" active={tabs[0]} />
                </div>
                <div onClick={()=>setTabs([false, true, false, false])}>
                    <TabH left={190} zindex={3} title="Courses" active={tabs[1]} />
                </div>
                <Tab active={tabs[0]} color="white" >
                    <CardsGrid title="Published Exams" data={publishedExams} published={true}/>
                </Tab>
                <Tab active={tabs[1]} color="white" >
                <div className={style.main_courses}>
                        {
                            courses?
                            courses.map((e,i)=>
                            <Link
                            href='/courses/[id]'
                            as={`/courses/${e.title}-${e.id}`}
                            key={e.id}
                            >
                                <div key={e.id} className={style.card}>
                                    <div className={style.image_s}>
                                        <img src={`/courses/${e.title}.png`}/>
                                    </div> 
                                    <div className={style.title_s}> 
                                        <h4>{e.title}</h4>
                                    </div>
                                </div>
                            </Link>
                            ):<></>
                        }
                    </div>
                </Tab>
            </div>
        }
        </>
    )
}

export default Dashboard
