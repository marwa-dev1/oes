import Link from 'next/link'
import {useRouter} from 'next/router'
import style from './Popup.module.css'
import { TextField, Select } from '@material-ui/core'
import {AiFillCloseCircle} from 'react-icons/ai'
import {motion, AnimatePresence} from 'framer-motion'
import { useState, useEffect, useContext } from 'react'
import firebase from '../../../firebase/firebase'
import { AuthContext } from '../../../contexts/AuthContext'
import FitLoader from '../FitLoader/FitLoader'

const Popup = ({close, show}) => {
    const [exname, setExname] = useState('');
    const [excourse, setExcourse] = useState('0');
    const [extype, setExtype] = useState('0');
    const [exper, setExper] = useState('');

    const {user} = useContext(AuthContext);
    const [ tcourses, setTcourses ] = useState([]);
    const [loading, setLoading] = useState(true);

    let date = new Date();
    let monthAhead = parseInt(date.getMonth()) + 2;
    let year = parseInt(date.getFullYear());
    if(monthAhead===1){
        year+=1;
    }
    date = date.getDate() + '-' + monthAhead + '-' + year;
    const [dl, setDl] = useState(date);
    const router = useRouter();

    const createUnpublishedExam = () => {
        if(exname===''||excourse==='0'||extype==='0'||exper===''){
            alert('You must fill all the form fields');
            return;
        }
        const splitter = dl.split('-');
        if(
            splitter[0].length>2||splitter[1].length>2||splitter[2].length>4
        ){
            alert('Check the date formate');
            return;
        }
        router.push({
            pathname: '/create-exam',
            query: { exName: exname, course: excourse, type: extype, per: exper, deadline:dl  },
          })
        close();
    }

    useEffect(()=>{
        firebase.database().ref(`main/users/teachers/${user.uid}`).child('courses').once("value", s=>{
            setTcourses(s.val());
        }).then(()=>{
            setLoading(false);
        })
    },[])

    const cancel = () => {
        setExcourse('0');setExname('');setExper('');setExtype('0');
        close();
    }

    return (
        <AnimatePresence>
        {show?(
            <motion.div 
                key="modal"
                initial={{opacity:0}}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                exit={{opacity:0, transition:{duration: .4}}}
                className={style.main}
            >
                <motion.div 
                    initial={{scale:0}}
                    animate={{ scale: 1 }}
                    opacity={{scale:0}}
                    transition={{ duration: 0.3 }}
                    className={style.card}  
                >
                    <div className={style.header}>
                        <p className={style.mainTitle}>
                            Create New Exam
                        </p>
                    </div>
                    <div className={style.closeC} onClick={cancel}>
                        <AiFillCloseCircle color="red" className={style.closeicon} size={18} />
                    </div>
                    <h4 className={style.inputT}>
                        Exam Name:
                    </h4>
                    <TextField value={exname} onChange={(e)=>setExname(e.target.value)} classes={{ root: style.input }}
                     type="text" variant="outlined" label="Exam Name"/>
                    <div className={style.flexerbetween}>
                        <div className={style.course}>
                            <h4 className={style.inputT}>
                                Course
                            </h4>
                            {
                                loading?
                                <FitLoader/>
                                :
                                <select value={excourse} onChange={(e)=>setExcourse(e.target.value)}>
                                <option value="0">Choose</option>
                                {tcourses.map(e=>
                                <>
                                <option value={e.split('-')[1]}>{e.split('-')[1]}</option>
                                </>
                                )}
                                </select>
                            }
                        </div>
                        <div className={style.exam_type}>
                            <h4 className={style.inputT}>
                                Exam Type:
                            </h4>
                            <select value={extype} onChange={(e)=>setExtype(e.target.value)}>
                                <option value="0">Choose</option>
                                <option value="mt">Midterm</option>
                                <option value="final">Final</option>
                                <option value="quiz">Quiz</option>
                            </select>
                        </div>
                    </div>
                    <div className={style.flexerbetween}>
                        <div className={style.percentage}>
                            <h4 className={style.inputT}>
                                Exam percentage
                            </h4>
                            <TextField value={exper} onChange={(e)=>setExper(e.target.value)} classes={{ root: style.input }} 
                            type="number" variant="outlined" label="Out of 100%"/>
                        </div>
                        <div className={style.percentage}>
                            <h4 className={style.inputT}>
                                Deadline
                            </h4>
                            <TextField value={dl} onChange={(e)=>setDl(e.target.value)} classes={{ root: style.input }} 
                            type="text" variant="outlined" label="dd-mm-yyyy"/>
                        </div>
                    </div>
                    <div className={style.create}>
                            <button className={style.createbtn} onClick={createUnpublishedExam}>
                                Create
                            </button>
                    </div>
                </motion.div>
            </motion.div>
            ):<></>
        }
        </AnimatePresence>
    )
}

export default Popup
