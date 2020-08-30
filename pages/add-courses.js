import style from '../styles/add-courses.module.css'
import Tab from '../c/small/Tab/Tab'
import TabH from '../c/small/TabH/TabH'
import { useState, useEffect, useContext } from 'react'
import firebase from '../firebase/firebase'
import Loader from '../c/small/Loader/Loader'
import {AiOutlineCheckCircle} from 'react-icons/ai'
import { AuthContext } from '../contexts/AuthContext'
import { useRouter } from 'next/router'


const addCourses = () => {
    const [ checkedarr, setcheckedarr ] = useState(null);
    const [ courses, setCourses ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ success, setSuccess ] = useState(false);
    const router = useRouter();
    const {user, userType} = useContext(AuthContext);

    const check = (i) => {
        let tempcheckarr = checkedarr;
        tempcheckarr[i] = !tempcheckarr[i];
        setcheckedarr([...tempcheckarr]);
    }

    const confirmTcourses = () => {
        let cToBeSent = [];
        for(let i=0; i<courses.length; i++){
            if(checkedarr[i]===true){
                cToBeSent.push(courses[i].id+'-'+courses[i].title);
            }
        }
        if(cToBeSent.length>0){
            setLoading(true);
            firebase.database().ref(`main/users/${userType}s/${user.uid}`).child('courses').set(cToBeSent).then(()=>{
                firebase.database().ref(`courses`).once("value", ss=>{
                    ss.forEach(e=>{
                        let i =0;
                        while(i<cToBeSent.length){
                            if(cToBeSent[i]){
                                const cId = cToBeSent[i].split('-')[0];
                                if(e.val().id === cId){
                                    let last;
                                    if(userType==='teacher'){
                                        if(e.val().teachers){
                                            last = e.val().teachers.length;
                                        }
                                        else last = 0;
                                    }
                                    else{
                                        if(e.val().students){
                                            last = e.val().students.length;
                                        }
                                        else last = 0;
                                    }
                                    e.child(`${userType}s`).child(last).ref.set(user.uid);
                                }
                            }
                            i++;
                        }
                    })
            }).then(()=>{
                setLoading(false);
                setSuccess(true);
                setTimeout(()=>{
                    window.location.reload()
                },1300)
            })
        })
        }
    }

    useEffect(()=>{
        firebase.database().ref(`main/users/${userType}s/${user.uid}`).child('courses').once("value", s=>{
            if(s.val()){
                router.push('/');
            }
            else{
                firebase.database().ref('courses').once("value", snapshot=>{
                    setCourses(snapshot.val());
                    setcheckedarr(new Array(snapshot.val().length).fill(false));
                }).then(()=>{
                    setLoading(false);
                }).catch(e=>{
                    console.log('Some Error Occured');
                })
            }
        })
    },[])

    return (
        <Tab active={true} color="white">
            {
                success?
                <div className={style.success_c}>
                    <AiOutlineCheckCircle size={60} color="green"/>
                    <h2 style={{color:'green'}}>SUCCESS</h2>
                </div>
                :<>
                {
                    loading?
                    <Loader/>:
                    <>
                    <TabH left={0} zindex={4} title={'Add Courses'} active={true} />
                    <h2 className={style.main_title}>You Must Select Your Courses First<br/> Click on the course(s) and then confirm</h2>
                    <div className={style.main}>
                        {
                            courses.map((e,i)=>
                                <div key={e.id} className={style.card} onClick={()=>check(i)}>
                                    {
                                        checkedarr[i]?
                                        <div className={style.checked}>
                                            <AiOutlineCheckCircle color="green" size={24}/>
                                        </div>:<></>
                                    }
                                    <div className={style.image_s}>
                                        <img src={`/courses/${e.title}.png`}/>
                                    </div> 
                                    <div className={style.title_s}> 
                                        <h4>{e.title}</h4>
                                    </div>
                                </div>
                            )
                        }
                        <button className={style.btn} onClick={confirmTcourses}>
                            Confirm
                        </button>
                    </div>
                    </>
                }</>
            }

        </Tab>
    )
}

export default addCourses
