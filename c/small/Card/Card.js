import style from './Card.module.css'
import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import {BsQuestionCircleFill,BsFillPeopleFill} from 'react-icons/bs'
import {FaPercentage, FaHourglassHalf, FaChalkboardTeacher} from 'react-icons/fa'
import {MdDateRange} from 'react-icons/md'
import {GrDocumentTime} from 'react-icons/gr'
import {FcBusinessman} from 'react-icons/fc'

const Card = ({
    id, author, title, img, per, type, course, date, deadline, answers, questionsLen, published
}) => {
    const {userType} = useContext(AuthContext);
    let tch;
    let std;
    let path;
    if(userType==='teacher'){
        tch=true;
        std=false;
        if(published){
            path='exam-preview';
        }
        else path='create-exam'
    } else {
        tch=false; 
        std=true;
        path='exams'
    }

    return (
        <Link href={published?`/${path}/[id]`:{
            pathname: `/${path}`,
            query: { exName: title, course: course, type: type, per: per, deadline:deadline, dbId:id, published:'false'  },
          }} as={published?`/${path}/${course}-${type}-${id}`:null}>
            <div className={style.main}>
                <div className={style.badge}>
                    {course}
                </div>
                <div className={style.img_s}>
                    <img src={img} />
                </div>
                <div className={style.right_s}>
                    <div className={style.title}>
                        <h3>{title}</h3>
                    </div>
                    <div className={style.right_first}>
                        {tch?
                        <>
                        <h4><BsQuestionCircleFill size={15} color="red"/> &nbsp; Total Questions:{questionsLen}</h4>
                        <h4><BsFillPeopleFill size={15}  color="darkblue" /> &nbsp;    Takers: {answers?answers.length:'none yet'}</h4>
                        </>
                        :
                        <>
                            <div className={style.flexer_between}>
                                <h4><FaChalkboardTeacher size={13} color="green"/> &nbsp; Course: {course}</h4>
                                <h4><FcBusinessman size={13}/> Teacher: {author}</h4>
                            </div>
                            <div className={style.flexer_between}>
                                <h4><GrDocumentTime size={13} color="darkblue"/> Type: {type}</h4>
                                <h4><BsQuestionCircleFill size={13} color="red"/> Total Questions {questionsLen}</h4>
                            </div>
                        </>
                        }
                    </div>
                    <div className={style.divider}/>
                    <div className={style.right_last}>
                        <h4><FaPercentage size={13} color="orange"/> &nbsp; Percentage: {per}</h4>
                        <h4><MdDateRange size={13} color="brown"/> &nbsp; Published On:{date}</h4>
                        <h4><FaHourglassHalf size={13} color="red"/> &nbsp; Deadline On:{deadline}</h4>
                    </div>
                </div>
            </div>

        </Link>
    )
}

export default Card
