import Link from 'next/link'
import { useState, useEffect, useContext } from 'react';
import TabH from '../../small/TabH/TabH';
import Tab from '../../small/Tab/Tab';
import CardsGrid from '../CardsGrid/CardsGrid';
import style from './StdDashboard.module.css'
import { AuthContext } from '../../../contexts/AuthContext';
import firebase from '../../../firebase/firebase'


const StdDashboard = () => {
    const [tabs, setTabs] = useState([true, false, false, false]);
    const {user, userType} = useContext(AuthContext);
    const [courses, setCourses] = useState([]);

    useEffect(()=>{
        firebase.database().ref('courses').once("value", s=>{
            s.forEach(e=>{
                if(e.val().students && e.val().students.includes(user.uid)){
                    setCourses(courses=>[...courses, e.val()]);
                }
            })
        })
    },[])

    return (
        <div>
            <div onClick={()=>setTabs([true, false, false, false])}>
                <TabH left={0} zindex={4} title="Courses" active={tabs[0]} />
            </div>
            <Tab active={tabs[0]} color="white" >
                <div className={style.main_courses}>
                        {
                            courses?
                            courses.map((e,i)=>
                            <Link key={e.id} href='/courses/[id]' as={`/courses/${e.title}-${e.id}`}>
                                <div key={e.id} className={style.card}>
                                    <div className={style.image_s}>
                                        <img src={`/courses/${e.title}.png`}/>
                                    </div> 
                                    <div className={style.title_s}> 
                                        <h4>{e.id.toUpperCase()}: {e.title}</h4>
                                    </div>
                                </div>
                            </Link>
                            ):<></>
                        }
                </div>
            </Tab>
        </div>
    )
}

export default StdDashboard
