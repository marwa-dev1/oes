import style from '../../styles/course.module.css'
import {useState, useEffect, useContext} from 'react'
import firebase from '../../firebase/firebase'
import {useRouter} from 'next/router'
import Loader from '../../c/small/Loader/Loader'
import CardsGrid from '../../c/regular/CardsGrid/CardsGrid'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import FitLoader from '../../c/small/FitLoader/FitLoader'
import Tab from '../../c/small/Tab/Tab'
import TabH from '../../c/small/TabH/TabH'
import { AuthContext } from '../../contexts/AuthContext'
import FitLoaderOrange from '../../c/small/FitLoaderOrange/FitLoaderOrange'

const course = () => {
    const [exams, setExams] = useState([]);
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const {user, userType} = useContext(AuthContext);
    //url query: title-id
    const {query:{id}} = useRouter();
    const cTitle = id.split('-')[0];
    const cId = id.split('-')[1];

    useEffect(()=>{
        setLoading(true);
        setStudents([]);
        setExams([]);
        firebase.database().ref(`courses`).once("value", snapshot=>{
            snapshot.forEach(course=>{
                if(course.val().id===cId && ((userType==='teacher' && course.val().teachers.includes(user.uid)) || userType ==='student')){
                    setCourse(course.val());
                    setExams(course.val().exams);
                    course.child('students').forEach(student=>{
                        firebase.database().ref(`main/users/students/${student.val()}`).once("value", stdSnapshot=>{
                            if(stdSnapshot.val() && stdSnapshot.val().courses.includes(`${cId}-${cTitle}`)){
                                setStudents(students=>[...students, stdSnapshot.val()]);
                            }
                        })
                    })
                }
            })
        }).then(()=>{
            setLoading(false);
        })
    },[id])

    if(loading){
        return <Loader/>
    }

    return (
        <Tab index={0} active={true} color="white">
            <TabH active={true} color="white" title={cId+'-'+cTitle} />
            {userType==='teacher'?
            <div className={style.main}>
                <div className={style.table_w}>
                    <div className={style.table_c}>
                    <h2>Students:</h2>
                    {
                        <TableContainer component={Paper} classes={{root:style.shadow}}>
                        <Table classes={{root:style.shadow}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Surname</TableCell>
                                <TableCell>Total Grade</TableCell>
                                <TableCell>Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {   
                                students.length!==0?
                                students.map((student,i)=>{
                                    return(
                                        <TableRow key={student.id}>
                                            <TableCell>{student.id}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>{student.surname?student.surname:''}</TableCell>
                                            <TableCell>Yet to be calculated</TableCell>
                                            <TableCell>{student.email?student.email:''}</TableCell>
                                        </TableRow>
                                    )
                                }):
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell align="center">
                                            <FitLoaderOrange />
                                        </TableCell>
                                        <TableCell/>
                                        <TableCell/>
                                    </TableRow>
                            }
                        </TableBody>
                        </Table>
                    </TableContainer>
                    }
                    </div>
                </div>
            </div>
            :<></>
            }
            <CardsGrid title="Exams" data={exams} published={true}/>
        </Tab>
    )
}

export default course
