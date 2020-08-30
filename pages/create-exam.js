import {useRouter} from 'next/router'
import style from '../styles/create-exam.module.css'
import ExamForm from '../c/big/ExamForm/ExamForm'
import { ExamTProvider } from '../contexts/ExamT'
import {AiFillEye} from 'react-icons/ai'
import uniqid from 'uniqid'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import Loader from '../c/small/Loader/Loader'
import DefaultErrorPage from 'next/error'


const createExam = ({query}) => {
    const id = uniqid('new-ex');
    const router = useRouter();
    const {userType} = useContext(AuthContext);
    if(userType==='student'){
        return <DefaultErrorPage statusCode={404}/>
    }
    else
    return (
        <div className={style.main}>
            <ExamTProvider>
                <ExamForm essentials={query} id={id}/>
            </ExamTProvider>
        </div>
    )
}

export async function getServerSideProps(context){
    const {query} = context;
    return {
        props: {query}
    }
}

export default createExam
