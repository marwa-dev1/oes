import firebase from '../../firebase/firebase'
import {useState, useEffect, useContext} from 'react'
import {useRouter} from 'next/router'
import style from '../../styles/SingleExam.module.css'
import Tab from '../../c/small/Tab/Tab'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, DotGroup, Dot } from 'pure-react-carousel';
import Loader from '../../c/small/Loader/Loader'
import TabH from '../../c/small/TabH/TabH'
import {useForm} from 'react-hook-form'
import { AuthContext } from '../../contexts/AuthContext'
import {AiOutlineCheckCircle} from 'react-icons/ai'
import AlertModal from '../../c/small/AlertModal/AlertModal'

const exam = () => {
    const {query} = useRouter();
    const {id} = query;
    const {user, userType} = useContext(AuthContext);
    let tch,std;
    if(userType==='teacher'){
        tch=true;
        std=false;
    }
    else {
        tch=false;
        std=true;
    }
    const fullstring = id.split('-');
    const course = fullstring[0];
    const exId = fullstring[2]+'-'+fullstring[3];
    const { register, handleSubmit, watch, errors} = useForm();
    const [loading, setLoading] = useState(true);
    const [ questions, setQuestions] = useState(null);
    const [title, setTitle] = useState('');
    const [success, setSuccess] = useState(false);
    const [alreadyAnswered, setAlreadyAnswered] = useState(null);
    const [exam, setExam] = useState(null);


    const router = useRouter();

    const [score, setScore] = useState(0);
    const [dbScore, setDBscore] = useState(null);
    const [examTotalScore, setExamTotalScore] = useState(0);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const data = null;

    const calculateResults = (questions, stdAnswers) => {
        let sc = 0;
        for(let i=0; i<questions.length; i++){
            setExamTotalScore(prev=>prev+parseInt(questions[i].data.points));
            Object.entries(stdAnswers).forEach(([key,val],j)=>{
                if(questions[i].id === key.split('_')[1]){
                    let ca = questions[i].data.ca;
                    let points = parseInt(questions[i].data.points);
                    let stdAns = val;
                    if(ca===stdAns){
                        sc+=points;
                        setScore(prev=>prev+points);
                    }
                }
            })
        }
        return sc;
    }


    const onSubmit = async (answers) => {
        setLoading(true);
        setShowAlertModal(false);
        await firebase.database().ref(`courses`).once("value", snapshot0=>{
            snapshot0.forEach(c0=>{
                if(c0.val().title===course){
                    c0.child('exams').ref.once("value", snapshot1=>{
                        snapshot1.forEach(c1=>{
                            if(c1.val().id===exId){
                                let sc = calculateResults(c1.val().questions, answers);
                                let lastAnswer;
                                if(c1.val().answers){
                                    lastAnswer = c1.val().answers.length;
                                }
                                else lastAnswer = 0;
                                c1.child('answers').child(lastAnswer).ref.set({
                                    id: user.uid,
                                    score:sc,
                                    data: Object.entries(answers).map(([key,val],i)=>{
                                        return{
                                            relativeIndex: i,
                                            q_id: key.split('_')[1],
                                            ans:val,
                                        }
                                    })
                                }).then(()=>{
                                    setLoading(false);
                                    setSuccess(true);
                                    let date = new Date();
                                    date = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
                                    firebase.database().ref(`main/users/teachers/${c1.val().authorId}/notifications`).push({
                                        notificationText:`Student with the ID: ${user.uid} has submitted his/her answer to exam: ${c1.val().title}`,
                                        date: date,
                                        checked: false
                                    })
                                    // setTimeout(()=>{
                                    //     router.push('/');
                                    // },1300)
                                })
                            }
                        })
                    })
                }
            })
        })
    }

    useEffect(()=>{
        async function getqs() {
            await firebase.database().ref(`courses`).once("value", snapshot0=>{
                snapshot0.forEach(c0=>{
                    if(c0.val().title===course){
                        c0.child('exams').ref.once("value", sn=>{
                            sn.forEach(c1=>{
                                if(c1.val().id===exId){
                                    if(c1.val().answers){
                                            c1.child('answers').ref.orderByChild('id').equalTo(user.uid).once("value", snapshot1=>{
                                            if(snapshot1.val()){
                                                Object.values(snapshot1.val()).map(e=>{
                                                    setDBscore(e.score);
                                                })
                                                for(let i=0; i<c1.val().questions.length; i++){
                                                    setExamTotalScore(prev=>prev+parseInt(c1.val().questions[i].data.points));
                                                }
                                                setAlreadyAnswered(true);
                                            }
                                            else setAlreadyAnswered(false);
                                        })
                                    }
                                    else setAlreadyAnswered(false);
                                    setTitle(c1.val().title);
                                    setQuestions(c1.val().questions);
                                }
                            })
        
                        })
                    }
                })
            })
        }
        getqs();
    }, []);

    useEffect(()=>{
        if(alreadyAnswered!==null){
            setLoading(false);
        }
    }, [alreadyAnswered])

    if(loading){
        return <Loader/>
    }

    return (
        <>
        {
            showAlertModal?
            <AlertModal title="Submit Confirmation"
            message="You are about to submit your exam answers, you cannot edit them afterwards.
            Your results will be displayed immediately!
            Are you sure you want to confirm?"
            btntxts={['Cancel', 'Confirm']}
            fnBtn1={()=>setShowAlertModal(false)}
            fnBtn2={handleSubmit(onSubmit)}
            />
            :<></>
        }
        <Tab active={true} color="white">
        <TabH left={0} zindex={4} title={title} active={true} />
        {
        success?
            <div className={style.success_c}>
                <div className={style.success_icon}><AiOutlineCheckCircle color="green" size={60}/></div>
                <div className={style.success_text}>
                    <h2>SUCCESS</h2>
                    <p>Your Score is: {score} out of {examTotalScore}</p>
                    <p>Percentage: {parseFloat((score/examTotalScore)*100).toFixed(2)}%</p>
                </div>
            </div>
            :
            alreadyAnswered?
            <div className={style.success_c}>
                <AiOutlineCheckCircle color="green" size={60}/>
                <h2>You Have Already Answered This Exam</h2>
                <h3>Your Score Is {dbScore} Out of {examTotalScore}</h3>
                <h4>You can review more about your exam in MyExams tab in the top right menu</h4>
            </div>
            :
            <>
        {
        <div className={style.main}>
            <div className={style.title_s}/>
            {
                questions?
                <CarouselProvider
                naturalSlideWidth={1200}
                naturalSlideHeight={500}
                totalSlides={questions.length}
                >
                <Slider>
                <form onSubmit={(e)=>{e.preventDefault()}} >
                {
                questions.map(({id, data},i)=>
                <Slide index={i} key={id}>
                    <div key={id} className={style.single_q}>
                        <div className={style.title}>
                            <h4>{i+1}. {data.title}. ({data.points}p)</h4>
                        </div>
                        {
                            data[`tf_${id}`]==="true"?
                            <div className={style.tf}>
                                <span>True</span> <input disabled={tch?true:false} ref={register} value='true' variant="outlined" type="radio" name={`tf_${id}`}/>
                                <span>False</span> <input disabled={tch?true:false}  ref={register} value='false' variant="outlined" type="radio" name={`tf_${id}`}/>
                            </div>:
                            <div className={style.mcq}>
                                <div><input disabled={tch?true:false} type="radio" value='A' ref={register} name={`c_${id}`}/><span>{data.ans_a}</span></div>
                                <div><input disabled={tch?true:false} type="radio" value='B' ref={register} name={`c_${id}`}/><span>{data.ans_b}</span></div>
                                <div><input disabled={tch?true:false} type="radio" value='C' ref={register} name={`c_${id}`}/><span>{data.ans_c}</span></div>
                                <div><input disabled={tch?true:false} type="radio" value='D' ref={register} name={`c_${id}`}/><span>{data.ans_d}</span></div>
                            </div>
                        }
                    </div>
                    {
                        i===questions.length-1?
                        <button disabled={tch?true:false} className={style.submit_btn} type="submit" onClick={()=>{setShowAlertModal(true)}}> Submit </button>:<></>
                    }
                </Slide>
                )}
                </form>
                </Slider>
                <div className={style.btns}>
                <ButtonBack className={style.btn} >Back</ButtonBack>
                <ButtonNext className={style.btn} >Next</ButtonNext>
                </div>
                <div className={style.qsNumbers}>
                    <DotGroup dotNumbers className={style.numbers_container} />
                </div>
                </CarouselProvider>
                :<></>
            }
        </div>
            }</>
        }
        </Tab>
        </>
    )
}




export default exam
