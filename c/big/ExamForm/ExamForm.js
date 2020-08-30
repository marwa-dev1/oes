import { useState, useEffect, useCallback, useContext } from 'react';
import style from './ExamForm.module.css'
import {useForm} from 'react-hook-form'
import Question from '../../small/Question/Question';
import uniqid from 'uniqid'
import { ExamTContext } from '../../../contexts/ExamT'
import { IoIosAdd, IoIosAddCircle } from 'react-icons/io';
import {AiFillEye} from 'react-icons/ai'
import { AnimatePresence, motion } from 'framer-motion';
import TabH from '../../small/TabH/TabH';
import { useRouter } from 'next/router';
import ExPreview from '../../regular/ExPreview/ExPreview';
import firebase from '../../../firebase/firebase'
import { AuthContext } from '../../../contexts/AuthContext';
import AlertModal from '../../small/AlertModal/AlertModal';
import Loader from '../../small/Loader/Loader';

const db = process.browser ? firebase.database() : undefined;

const ExamForm = (props) => {
    const router = useRouter();
    const {user, userType, name, surname} = useContext(AuthContext);

    const {essentials:{exName,course,type,per,deadline, dbId, published}, id} = props;

    const exam = useContext(ExamTContext);
    const [preview, setPreview] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showsavedmsg, setShowSavedMsg] = useState(false);
    const [msg, setmsg] = useState('');
    const [loading, setLoading] = useState(false);


    const showSaved = (txt) => {
        setShowSavedMsg(true);
        setmsg(txt);
        setTimeout(()=>{
            setShowSavedMsg(false);
            setmsg('');
        }, 2000)
    }

    const saveUnpublishedExam = () => {
        if(exam.questions.length===0){
            alert("Exam Has No Questions");
            return;
        }
        showSaved('Saving...');
        let date = new Date();
        date = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
        const e = {
            id:dbId?dbId:id,
            title:exName,
            course: course,
            type:type,
            per:per,
            date:date,
            deadline:deadline,
            questions: exam.questions
        }
        db.ref(`main/users/teachers/${user.uid}/unpublished-exams/${course}`).child(dbId?dbId:id).set(e).then(r=>{
            showSaved('Saved');
        }).catch(e=>{
            showSavedErr('Error');
        });
    }

    const handlePreview = (v) => {
        setPreview(v);
    }

    const publish = () => {
        if(exam.questions.length===0){
            alert("Exam Has No Questions");
            return;
        }
        for(let i=0; i<exam.questions.length;i++){
            if(exam.questions[i].data.ca==="0"||exam.questions[i].data.points===""){
                alert("One of your questions doesn't have correct answer and/or points set!");
                return;
            }
        }
        let date = new Date();
        setLoading(true);
        date = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
        const examObj = {
            id:dbId?dbId:id,
            course: course,
            title:exName,
            type:type,
            per:per,
            date: date,
            questions: exam.questions,
            author: name+' '+surname,
            authorId: user.uid,
            deadline:deadline,
        }
        db.ref(`courses`).once("value", snapshot=>{
            snapshot.forEach(e=>{
                if(e.val().title===course){
                    e.val().students.forEach(student=>{
                        db.ref(`main/users/students/${student}`).once("value", stdSnapshot=>{
                            if(stdSnapshot.val())
                                if(stdSnapshot.val().courses.includes(`${e.val().id}-${e.val().title}`)){
                                    stdSnapshot.child('notifications').ref.push({
                                        notificationText:`Teacher: ${name+' '+surname} has published his/her ${type} exam: ${exName}.
                                        DEADLINE IS: ${deadline}
                                        `,
                                        date: date,
                                        checked: false
                                    })
                                }
                        })
                    })
                    let last;
                    if(e.val().exams){
                        last = e.val().exams.length;
                    } else last = 0;
                    e.child('exams').child(last).ref.set(examObj).then(()=>{
                        db.ref(`main/users/teachers/${user.uid}/unpublished-exams/${course}`).child(dbId?dbId:id).remove();
                    }).catch(e=>console.log('Some Error Accured'))
                }
            })
        }).then(()=>{
            setShowAlertModal(false);
            router.push('/');
        }).catch(e=>console.log('Some Error Accured'))
    }

    const addQ = () => {
        const id = uniqid();
        exam.setQuestions((questions) => [
          ...questions,
          {
            id: id,
            data:{}
          }
        ]);
      };

      useEffect(()=>{
        if(dbId && published==='false'){
            firebase.database().ref(`main/users/teachers/${user.uid}/unpublished-exams/${course}/${dbId}`).once("value", unpublishedExam=>{
                exam.setQuestions(questions=>[
                    ...questions,
                    ...unpublishedExam.val().questions
                ])
            }).then(()=>{
                setLoading(false);
            })
        }
    },[])

    const addqcs = `${style.addqbtn} ${style.tooltip}`;

      if(loading){
          return <Loader/>
      }

    return (
        <>
        {
            showAlertModal?
            <AlertModal title="Publish Confirmation"
            message="You are about to publish the exam to your students, you cannot edit the exam after that.
            Are you sure you want to confirm?"
            btntxts={['Cancel', 'Confirm']}
            fnBtn1={()=>setShowAlertModal(false)}
            fnBtn2={publish}
            />
            :<></>
        }
        <ExPreview close={handlePreview} show={preview}/>
        <div className={style.main} style={preview||showAlertModal?{display:'none'}:{}}>
            <TabH left={0} title={exName} active={true} />

            <div className={style.title_c}>
                <div className={style.title}>
                    Add Questions To Your Exam: <span>{exName}</span> - <span>{course}</span>
                </div>
                <div className={style.btns}>
                    
                    <button className={style.topbtn} onClick={()=>handlePreview(true)}>
                        PREVIEW &nbsp; <AiFillEye color="white" size={20}/>
                    </button>
                    <button className={style.topbtn} onClick={saveUnpublishedExam} role="button" disabled={showsavedmsg}>
                        {showsavedmsg?msg:<>Save</>}
                    </button>
                    <button className={style.topbtn} onClick={()=>{setShowAlertModal(true)}}>
                        Publish
                    </button>
                </div>
            </div>
            <button onClick={addQ} className={addqcs}>
                <span className={style.tooltiptext}>New Question</span>
                <IoIosAddCircle className={style.addicon} size={65} color="#0089d6"/>
            </button>
            <div className={style.qs_c}>
                <AnimatePresence>
                    {exam.questions.map((q,j) => {
                        return (
                            <motion.div             
                                initial={{scale:0}}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                exit={{scale:0}}
                                className={style.q_c}
                                key={q.id}
                            >
                                <Question  key={q.id} i={exam.questions.length + 1} index={j} id={q.id} q={q} />
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </div>
        </>
    )
}

export default ExamForm
