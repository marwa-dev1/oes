import { useState, useEffect, useContext } from 'react';
import style from './Question.module.css'
import {useForm} from 'react-hook-form'
import { ExamTContext } from '../../../contexts/ExamT';
import uniqid from 'uniqid'
import { TextField, Button, Input } from '@material-ui/core'
import {motion, AnimatePresence} from 'framer-motion'

const Question = ({saveEnabler, i, id, index, q}) => {
    const { register, handleSubmit, watch, getValues, errors } = useForm();
    const [tf, setTf] = useState(q?q.data[`tf_${id}`]==='true'?true:false:false);
    const {questions, saveData, removeQ} = useContext(ExamTContext);
    const [title, setTitle] = useState(q.data.title);
    // const saveValues = watch();
    let allvals = questions[index]?questions[index].data:null;

    const onSubmit = (data) => {
        const qtemplate = {
            id: id,
            title: data.title,
            choices:[data.ans_a, data.ans_b, data.ans_c, data.ans_d],
            correctAns: data.ca,
            tf:data.truefalse,
            points:data.points
        }
    };


    useEffect(()=>{
        allvals = watch();
        saveData(id, allvals);
    }, [allvals])    

    return (
        <motion.div className={style.main}>
            <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
            <div className={style.txt}>
                <h4>Write the question title</h4>
                <TextField multiline variant="outlined" name="title" type="text" defaultValue={q?q.data.title:''} inputRef={register}/>
            </div>
            <div className={style.tf}>
                <h4>Is it a true/false question?</h4>
                <span>Yes</span> <input variant="outlined" type="radio" value={true} defaultChecked={q?q.data[`tf_${id}`]==='true'?true:false:tf} onClick={()=>setTf(true)} name={`tf_${id}`} ref={register}/>
                <span>No</span> <input variant="outlined" type="radio" value={false} defaultChecked={q?q.data[`tf_${id}`]==='true'?false:true:!tf} onClick={()=>setTf(false)} name={`tf_${id}`} ref={register}/>
            </div>
            <AnimatePresence initial={false}>
                {
                    !tf?
                    <motion.div 
                        initial={{height:0, opacity: 0}} 
                        animate={{height:'100%', opacity:1,  transition:{ease:"linear"}}}
                        exit={{opacity: 0, height:0, transition:{ease:"linear"}}} 
                        key="options" className={style.choices}
                    >
                        <div> <p>A) </p> <TextField multiline defaultValue={q?q.data.ans_a:''} variant="outlined" type="text" name="ans_a" inputRef={register}/></div> 
                        <div> <p>B) </p> <TextField multiline defaultValue={q?q.data.ans_b:''} variant="outlined" type="text" name="ans_b" inputRef={register}/></div> 
                        <div> <p>C) </p> <TextField multiline defaultValue={q?q.data.ans_c:''} variant="outlined" type="text" name="ans_c" inputRef={register}/></div> 
                        <div> <p>D) </p> <TextField multiline defaultValue={q?q.data.ans_d:''} variant="outlined" type="text" name="ans_d" inputRef={register}/></div> 
                    </motion.div>
                    :<></>          
                }
            </AnimatePresence>
                <div className={style.otherInfo}>
                    <div className={style.points}>
                        <h4>Points for this question: </h4>
                        <TextField className={style.pointInput} defaultValue={q?q.data.points:''} variant="outlined" type="number" name="points" placeholder="10,20,30..." inputRef={register}/>
                    </div>
                    <div className={style.correctAns}>
                        <h4>The correct answer is:</h4>
                        {tf?
                            <select name="ca" defaultValue={q?q.data.ca:'0'} ref={register}>
                                <option value="0">Choose ...</option>
                                <option value={true}>True</option>
                                <option value={false}>False</option>
                            </select>:
                            <select name="ca" defaultValue={q?q.data.ca:'0'} ref={register}>
                                <option value="0">Choose ...</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        }
                    </div>
                </div>
            </form>
            <div className={style.delete}>
                <Button variant="outlined" className={style.deletebtn}  onClick={()=>removeQ(id)}>Delete</Button>
            </div>
        </motion.div >
    )
}

export default Question
