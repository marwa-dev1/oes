import {useRouter} from 'next/router';
import Link from 'next/link';
import {useState, useEffect, useContext} from 'react';
import style from '../../styles/exam-preview.module.css'
import firebase from '../../firebase/firebase'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {IoIosArrowUp, IoIosArrowDown} from 'react-icons/io'
import {FaRegEye} from 'react-icons/fa'
import Tab from '../../c/small/Tab/Tab';
import TabH from '../../c/small/TabH/TabH';
import { AuthContext } from '../../contexts/AuthContext';

import Loader from '../../c/small/Loader/Loader'

import ErrorPage from 'next/error'
import FitLoaderOrange from '../../c/small/FitLoaderOrange/FitLoaderOrange';


const ExamPreview = () => {
    const router = useRouter();
    const [exam, setExam] = useState(null);
    const {user, userType} = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [avgScore, setAvgScore] = useState(0);
    const getExam = (ex) => {
        setExam(ex);
        let scoreSum=0;
        let total=0;
        if(ex.answers){
          ex.answers.forEach(answer=>{
            scoreSum+=answer.score;
            ++total;
          });
          setAvgScore(scoreSum/total);
        }
    }

    const handleLoader = (v) => {
        setLoading(v)
    }
    
    useEffect(()=>{
      if(userType!=='teacher'){
        router.push('/');
      }
      else setLoading(false);
    },[])

    return (
        <Tab index={0} active={true}>
            <TabH active={true} activeColor="#dbdbdb"/>
        {loading?<Loader/>:
        <div className={style.main}>
            <div className={style.facts_c}>
                <div className={style.facts_inner}>
                    <div>Exam Title: {exam?exam.title:'...'}</div>
                    <div>Course: {exam?exam.course:'...'}</div>
                    <div>Exam Type: {exam?exam.type:'...'}</div>
                    <div>Exam Preview: &nbsp; 
                        {exam?
                        <Link href='/exams/[id]' as={`/exams/${exam.course}-${exam.type}-${exam.id}`}>
                            <button className={style.prvwbtn}>
                                Preview
                            </button>
                        </Link>
                        :<></>}</div>
                    <div>Exams Takers: {exam?exam.answers?exam.answers.length:'0':'...'}</div>
                    <div>Average Grade: {avgScore!==0?avgScore:'...'}</div>
                    <div>Exam Percentage: {exam?exam.per:'...'}</div>
                    <div>Deadline: {exam?exam.deadline:'...'}</div>
                </div>
            </div>
            <div className={style.table_c}>
                <CollapsibleTable sendExam={getExam} uid={user?user.uid:''} setLoader={handleLoader} />
            </div>
        </div>
        }
        </Tab>
    )
}



const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function createData(number, studentName, totalquestions, totalquestionsAnswered, grade, date, questions, asa) {
  return {
    number,
    studentName,
    totalquestions,
    totalquestionsAnswered,
    grade,
    date,
    details: 
    [
    ...asa.map((e,i)=>{
        if(number===e.sid){
        return { question: e.q, studentAnswer: e.sa, correctAnswer: e.a, correct:e.correct }
        } else return null
    })]
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  const greenIt = {
    color: "green"
  };
  const redIt = {
    color: "red"
  };
  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.number}
        </TableCell>
        <TableCell align="right">{row.studentName}</TableCell>
        <TableCell align="right">{row.totalquestions}</TableCell>
        <TableCell align="right">{row.totalquestionsAnswered}</TableCell>
        <TableCell align="right">{row.grade}</TableCell>
        <TableCell align="right">{row.date}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Exam Summary
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Student Answer</TableCell>
                    <TableCell>Correct Answer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.details.map((detailrow,i) => (
                      detailrow?(
                    <TableRow key={detailrow.question}>
                      <TableCell component="th" scope="row">
                        <p><b>Q{(i)%row.totalquestions+1}. {detailrow.question}</b></p>
                      </TableCell>
                      <TableCell>{detailrow.studentAnswer}</TableCell>
                      <TableCell>{detailrow.correctAnswer}</TableCell>
                    </TableRow>
                      ):<TableRow key={Math.random()*i} style={{display:'none'}}/>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}




export function CollapsibleTable({sendExam, uid, setLoader}) {
    const router = useRouter();
    const {query:{id}} = router;
    const [decompURL, setDecompURL] = useState(id.split('-'));
    const [course, setCourse] = useState(decompURL[0]);
    const [examId, setExamId] = useState(decompURL[2]+'-'+decompURL[3]);
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState(null);
    const [rows, setRows] = useState([]);
    const [students, setStudents] = useState([]);
    const [startFetching, setStartFetching] = useState(false);
    const [doneFetching, setDoneFetching] = useState(false);
    const [activate, setActivate] = useState(false);
    const [ansVSsAns, setAnsVSsAns] = useState([]);

useEffect(()=>{
    if(!doneFetching)
        firebase.database().ref('courses').once("value", snapshot0=>{
            snapshot0.forEach(c0=>{
                if(c0.val().title===course){
                    c0.child('exams').ref.once("value", snapshot1=>{
                        snapshot1.forEach(c1=>{
                            if(c1.val().id===examId){
                                if(c1.val().authorId === uid){
                                    setExam(c1.val());
                                    sendExam(c1.val());
                                    let qs = c1.val().questions;
                                    c1.child('answers').ref.once("value", snapshot2=>{
                                        setAnswers(snapshot2.val());
                                        snapshot2.forEach(c2=>{
                                            let i = 0;
                                            while(i<qs.length){
                                                c2.val().data.forEach(c3=>{
                                                    if( qs[i].id===c3.q_id ){
                                                      let correct;
                                                      if(c3.ans===qs[i].data.ca){
                                                        correct=true;
                                                      }
                                                      else correct=false;
                                                        setAnsVSsAns(ansVSsAns=>[...ansVSsAns, {
                                                           sid:c2.val().id, q:`${qs[i].data.title}. (${qs[i].data.points} pnts)`,
                                                           sa:c3.ans? c3.ans!=='true'&&c3.ans!=='false'?`${c3.ans}) ${qs[i].data[`ans_${c3.ans.toLowerCase()}`]}`:c3.ans:'',
                                                           a:qs[i].data.ca!=='true'&&qs[i].data.ca!=='false'?`${qs[i].data.ca}) ${qs[i].data[`ans_${qs[i].data.ca.toLowerCase()}`]}`:qs[i].data.ca,
                                                           correct:correct
                                                        }]);
                                                    }
                                                })
                                                i++;
                                            }
                                        })
                                        snapshot2.ref.once("value", s=>{
                                            s.forEach(c4=>{
                                                firebase.database().ref(`main/users/students/${c4.val().id}`).once("value", snapshot5=>{
                                                    setStudents(students=>[...students, snapshot5.val()])
                                                })
                                            })
                                        })
                                    })
                        }else router.push('/');
                    }
                })
            }).then(()=>{
                setStartFetching(true);
            })
            }
        })
    })
    return ()=>{
        
    }
},[])

    useEffect(()=>{
        if(startFetching && !doneFetching)
            if(answers && answers.length!==0 && students.length!==0 && answers.length === students.length ){
                answers.forEach((e,i)=>{
                    let questionsAnswered = 0;
                    e.data.forEach((q,i)=>{
                        if(q.ans !==''){
                            questionsAnswered++;
                        }
                    })
                    setRows(rows=>[...rows, createData(e.id, students[i]?students[i].name:'', exam.questions.length,  questionsAnswered, e.score?e.score:'', exam.date, exam.questions, ansVSsAns)]);
                })
                setDoneFetching(true);
            }
    },[students, answers]);


  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Student ID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Total Questions</TableCell>
            <TableCell align="right">Questions Answered</TableCell>
            <TableCell align="right">Grade</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows&&answers? rows.map((row) => (
            <Row key={row.number} row={row} />
          )):
          <FitLoaderOrange/>
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExamPreview
