import style from '../styles/my-exams.module.css'
import firebase from '../firebase/firebase'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../c/small/Loader/Loader';
import Tab from '../c/small/Tab/Tab';
import SlideToggle from 'react-slide-toggle';
import {IoIosArrowUp, IoIosArrowDown} from 'react-icons/io'

const myExams = () => {
    const [loading, setLoading] = useState(true);
    const {user, userType, name, surname} = useContext(AuthContext);
    const [userObj, setUserObj] = useState({});
    const [exams, setExams] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [anstxt, setAnsTxt] = useState([]);
    const [scores, setScores] = useState([]);
    const [open , setOpen] = useState(false);

    const toggler = () => {
        setOpen(!open);
    }

    useEffect(()=>{
        firebase.database().ref('courses').once("value",  snapshot=>{
          snapshot.forEach(course=>{
              course.child('exams').forEach(exam=>{
                  if(exam.val().answers){
                      exam.val().answers.forEach(answer=>{
                          // Getting the exam the user took
                          if(answer.id===user.uid){
                            setExams(exams=> [
                                ...exams,
                                  exam.val()
                              ]);
                            if(answer.score){
                                setScores(scores=>[...scores, answer.score]);
                            } else setScores(scores=> [...scores,  'Not Calculated Yet']);
                         // Getting the answers of the user in that exam
                              exam.val().answers.forEach(answer=>{
                                  if(answer.id===user.uid){
                                    //   setAnswers(answers => [...answers, answer.data]);
                                      let singleExamAnswers = [];
                                      exam.val().questions.forEach((q,i)=>{
                                        if(q.id === answer.data[i].q_id){
                                            let ca = q.data.ca.toLowerCase();
                                            let std_a = answer.data[i].ans.toLowerCase();
                                            let a_obj = null;
                                            if(std_a==='true'||std_a==='false'){
                                                a_obj = {std_a:std_a, ca:q.data.ca}
                                            }
                                            else a_obj = {std_a:q.data[`ans_${std_a}`], ca:q.data[`ans_${ca}`]}
                                        singleExamAnswers.push(a_obj);
                                        }
                                    })
                                    setAnswers(answers => [...answers, singleExamAnswers]);
                                  }
                              })

                          }
                      })
                  }
             })
         })
       }).then(()=>{
         setLoading(false);
       })
    },[])


    if(loading || exams.length===0){
        return <Loader/>
    }

    return (
        <Tab index={0} color="white" active={true}>
            <div className={style.main}>
                {
                    exams.map((exam, i)=>{
                        let totalScore = 0;
                        exam.questions.forEach(question=>{
                            totalScore+= parseInt(question.data.points);
                        })
                        return(
                            <div className={style.single_exam} key={exam.id}>
                            <div className={style.section}>
                                <div className={style.field}>
                                    <h3 className={style.title}>
                                        Exam Title
                                    </h3>
                                    <div className={style.field_content}>
                                        {exam.title}
                                    </div>
                                </div>
                                <div className={style.field}>
                                    <h3 className={style.title}>
                                        Exam Percentage
                                    </h3>
                                    <div className={style.field_content}>
                                        {exam.per}
                                    </div>
                                </div>
                                <div className={style.field}>
                                    <h3 className={style.title}>
                                        Exam Questions
                                    </h3>
                                    <div className={style.field_content}>
                                        {exam.questions.length}
                                    </div>
                                </div>
                            </div>
                            <div className={style.section}>
                                <div className={style.field}>
                                    <h3 className={style.title}>
                                        Exam Type
                                    </h3>
                                    <div className={style.field_content}>
                                        {exam.type}
                                    </div>
                                </div>
                                <div className={style.field}>
                                    <h3 className={style.title}>
                                        Exam Teacher
                                    </h3>
                                    <div className={style.field_content}>
                                        {exam.author}
                                    </div>
                                </div>
                                <div className={style.field}>
                                    <div className={style.innerFields}>
                                        <div >
                                            <h3 className={style.title}>
                                                Your Score
                                            </h3>
                                            <div className={style.field_content}>
                                                {scores[i]}
                                            </div>
                                        </div>
                                        <div >
                                            <h3 className={style.title}>
                                                Out of
                                            </h3>
                                            <div className={style.field_content}>
                                                {totalScore}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={style.section}>
                                <div className={style.field}>
                                    <h3 className={style.title}>
                                        Publish Date
                                    </h3>
                                    <div className={style.field_content}>
                                        {exam.date}
                                    </div>
                                </div>
                                <div className={style.field}>
                                    <h3 className={style.title}>
                                        Exam Deadline
                                    </h3>
                                    <div className={style.field_content}>
                                        {exam.deadline}
                                    </div>
                                </div>
                                <div className={style.field}>
                                    <h3 className={style.title}>
                                        Exam Course
                                    </h3>
                                    <div className={style.field_content}>
                                        {exam.course}
                                    </div>
                                </div>
                            </div>
                                <SlideToggle
                                    key={exams.id}
                                    onExpanding={toggler}
                                    onCollapsing={toggler}
                                    collapsed
                                    render={({ toggle, setCollapsibleElement }) => (
                                            <div className={`${style.question_answers_c}`}>
                                                <h3 className={style.qatitle} onClick={toggle}>
                                                    <p>Questions And Answers</p>
                                                    {
                                                        open?
                                                        <IoIosArrowUp color="black" size={25}/>:
                                                        <IoIosArrowDown color="black" size={25}/>
                                                    }
                                                </h3>
                                                <div ref={setCollapsibleElement}>
                                                    <div className={style.single_q_a}>
                                                        <p>QUESTIONS</p>
                                                        <p>YOUR ANSWER</p>
                                                        <p>CORRECT ANSWER</p>
                                                    </div>
                                                {
                                                    exam.questions.map((q,j)=>{
                                                        return(
                                                            <div className={style.single_q_a} key={q.id}>
                                                                <p><b>Q{j+1}.</b> {q.data.title} ({q.data.points} pnts.)</p>
                                                                <p><b>{answers[i][j]?answers[i][j].std_a:''}</b></p>
                                                                <p><b>{answers[i][j]?answers[i][j].ca:''}</b></p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                </div>
                                            </div>
                                    )}
                                />
                            
                        </div> 
                        )
                    })
                }     
            </div>
        </Tab>
    )
}

export default myExams
