import style from './Gate.module.css'
import { TextField } from '@material-ui/core'
import { useState, useEffect } from 'react'
import firebase from '../../../firebase/firebase'
import FitLoader from '../../small/FitLoader/FitLoader'

const Signup = () => {
    const [teacher, setTeacherType] = useState(false);
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [confirmed, setconfirmed] = useState('');
    const [id, setId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [ invalidEmail, setInvalidEmail] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [ invalidConfirmed, setInvalidConfirmed] = useState(false);
    const [ invalidId, setInvalidId] = useState(null);
    const [emptyName, setEmptyName] = useState(null);
    const [halfRegistered, setHalfRegistered] = useState(null);
    const [loginId, setLoginId] = useState(null)
    const [ usedLoginId, setUsedLoginId] = useState(null);
    const [loader, setLoader] = useState(false);
    const [err, setErr] = useState(null);
    const re = /^[a-zA-Z0-9_.+-]+@students.oes\.edu$/;
    const tre = /^[a-zA-Z0-9_.+-]+@oes\.edu$/;

    const handleEmail = (e) => {
        setemail(e.target.value);
        if(teacher){
            if(tre.test(e.target.value)) setInvalidEmail(false);
        }
        else 
        if(re.test(e.target.value)) setInvalidEmail(false);
        setErr(null);
    }

    const handlePassword = (e) => {
        setpassword(e.target.value);
        if(e.target.value.length >=8){
            setInvalidPassword(false);
        }
    }

    const handleConfirmed = (e) => {
        setconfirmed(e.target.value);
        if(e.target.value !== password){
            setInvalidConfirmed(true);
            setLoader(false);
        }
        else setInvalidConfirmed(false);
    }

    const handleId = (e) => {
        setId(e.target.value)
    }

    const handleFirstName = (e) => {
        setFirstName(e.target.value)
    }

    const handleLastName = (e) => {
        setLastName(e.target.value)
    }

    const validateEmail = (e) => {
        const v = e.target.value;
        if(teacher){
            if(tre.test(v)) {
                setInvalidEmail(false);
            }
            else {
                setInvalidEmail(true);
                setLoader(false);
            }
        }
        else {
            if(re.test(v)){
                setInvalidEmail(false);
            }
            else {
                setInvalidEmail(true);
                setLoader(false);
            }
        }
    }

    const validatePassword = (e)=>{
        if(e.target.value.length <8){
            setInvalidPassword(true);
            setLoader(false);
        }
        else setInvalidPassword(false);
    }

    const verifyID = async() => {
        await firebase.database().ref('teacherIDs').orderByValue().equalTo(id).once("value", snapshot=>{
            if(snapshot.val()===null){
                setInvalidId(true)
                setLoader(false);
            }
            else {
                firebase.database().ref('main/users/teachers').orderByChild('loginId').equalTo(id).once("value", s=>{
                    if(s.val()===null){
                        setInvalidId(false);
                        setLoader(false);
                        setLoginId(snapshot.val()[0]);
                        setInvalidEmail(false);
                        setInvalidPassword(false);
                    }
                    else{
                        setUsedLoginId(true);
                        setLoader(false);
                        setInvalidId(true);
                    }
                })
            }
        });
    }

    const register = () => {
        if(email ==="" || password === "" || confirmed === "" || invalidEmail || invalidConfirmed || invalidPassword || firstName==="" || lastName===""){
            setLoader(false);
            if((firstName==="" || lastName==="")){
                setEmptyName(true);
            }
            return;
        }
        else{
            setLoader(true);
            firebase.auth().createUserWithEmailAndPassword(email, password).then(async (u)=>{
                if(teacher && !invalidId){
                    firebase.database().ref(`main/users/teachers`).child(u.user.uid).set({
                        id:u.user.uid,
                        email:u.user.email,
                        name:firstName,
                        surname:lastName,
                        loginId: id
                    });
                }
                else{
                    firebase.database().ref(`main/users/students`).child(u.user.uid).set({
                        id:u.user.uid,
                        email:u.user.email,
                        name:firstName,
                        surname:lastName
                    });
                }
            }).catch(e=>{
                if(e.code==='auth/email-already-in-use'){
                    setErr('A Student With This Email Already Exists');
                } else ('Some Error Occured, Please Try Again Later');
                setLoader(false);
            });
        }
    }

    return (
        <div className={style.inner}>
            <div className={style.fields}>
                <div className={style.field}>
                    {
                        invalidId!==false && halfRegistered!==true?
                        <div className={style.radios}>
                            <div>
                                <h4>User Type?</h4>
                            </div>
                            <div>
                                <h4>Teacher</h4><input type="radio" name="usertype" onChange={()=>setTeacherType(true)} value={teacher}/>
                            </div>
                            <div>
                                <h4>Student</h4><input type="radio" name="usertype" checked={!teacher} onChange={()=>setTeacherType(false)} value={!teacher}/>
                            </div>
                        </div>:<></>
                    }

                    {/* <div className={style.divider}/> */}
                </div>
                {
                    teacher?
                    <div className={style.field}>
                        {
                            invalidId!==false?
                            <>
                            <h4>Enter The ID Assigned To You By Your Department</h4>
                            <TextField classes={{ root: `${style.input} ${style.verifyInput} ${invalidId===true? style.invalidInput:''}` }} onChange={handleId} value={id} 
                            variant="outlined" type="text" label="i.e. HRWDR392304"/>
                            {usedLoginId?<p className={style.err}>This Id has already been used for signup</p>:<></>}
                            <button className={style.signupbtn} onClick={()=>{setLoader(true);verifyID()}}>
                            {
                                    loader?
                                    <FitLoader/>
                                    :
                                    <>Verify ID</>
                            }
                            </button>
                            </>
                            :
                            <>
                            <div className={style.form}>
                                <div>
                                    <div className={style.field}>
                                        <h4>Enter Email</h4>
                                        <TextField classes={{ root: `${style.input} ${invalidEmail? style.invalidInput:''}` }} onChange={handleEmail} value={email} 
                                        onBlur={validateEmail} variant="outlined" type="text" label="example@oes.edu"/>
                                        {invalidEmail?<p className={style.err}>Email Not Valid</p>:<></>}
                                        {err?<p className={style.err}>{err}</p>:<></>}
                                    </div>
                                    <div className={style.field}>
                                        <h4>Enter Password</h4>
                                        <TextField classes={{ root: `${style.input} ${invalidPassword? style.invalidInput:''}` }}
                                        onBlur={validatePassword} onChange={handlePassword} value={password} 
                                        variant="outlined" type="password" label="password"/>
                                        {invalidPassword?<p className={style.err}>Password should be at least 8 characters</p>:<></>}
                                    </div>
                                    <div className={style.field}>
                                        <h4>Confirm Password</h4>
                                        <TextField classes={{ root: `${style.input} ${invalidConfirmed? style.invalidInput:''}` }}
                                        onChange={handleConfirmed} value={confirmed} 
                                        variant="outlined" type="password" label="password"/>
                                        {invalidConfirmed?<p className={style.err}>Passwords don't match</p>:<></>}
                                    </div>
                                </div>
                                <div>
                                    <div className={style.field}>
                                            <h4>Your First Name</h4>
                                            <TextField classes={{ root: `${style.input} ${emptyName? style.invalidInput:''}` }}
                                            onChange={handleFirstName} value={firstName}
                                            variant="outlined" label="First Name"/>
                                        </div>
                                        <div className={style.field}>
                                            <h4>Your Last Name</h4>
                                            <TextField classes={{ root: `${style.input} ${emptyName? style.invalidInput:''}` }}
                                            onChange={handleLastName} value={lastName}
                                            variant="outlined" label="Last Name"/>
                                        </div>
                                </div>
                            </div>
                            <div className={style.signUpBtn}>
                                <button className={style.signupbtn} onClick={()=>{setLoader(true);register()}}>
                                    {
                                        loader?
                                        <FitLoader/>
                                        :
                                        <>Sign Up</>
                                    }
                                </button>
                            </div>
                            </>
                        }
                    </div>
                    :
                    <>
                    <div className={style.form}>
                        <div>
                            <div className={style.field}>
                                <h4>Enter Email</h4>
                                <TextField classes={{ root: `${style.input} ${invalidEmail? style.invalidInput:''}` }} onChange={handleEmail} value={email} 
                                onBlur={validateEmail} variant="outlined" type="text" label="example@students.oes.edu"/>
                                {invalidEmail?<p className={style.err}>Email Not Valid</p>:<></>}
                                {err?<p className={style.err}>{err}</p>:<></>}
                            </div>
                            <div className={style.field}>
                                <h4>Enter Password</h4>
                                <TextField classes={{ root: `${style.input} ${invalidPassword? style.invalidInput:''}` }}
                                onBlur={validatePassword} onChange={handlePassword} value={password} 
                                variant="outlined" type="password" label="password"/>
                                {invalidPassword?<p className={style.err}>Password should be at least 8 characters</p>:<></>}
                            </div>
                            <div className={style.field}>
                                <h4>Confirm Password</h4>
                                <TextField classes={{ root: `${style.input} ${invalidConfirmed? style.invalidInput:''}` }}
                                onChange={handleConfirmed} value={confirmed} 
                                variant="outlined" type="password" label="password"/>
                                {invalidConfirmed?<p className={style.err}>Passwords don't match</p>:<></>}
                            </div>
                        </div>
                        <div>
                        <div className={style.field}>
                                <h4>Your First Name</h4>
                                <TextField classes={{ root: `${style.input} ${emptyName? style.invalidInput:''}` }}
                                onChange={handleFirstName} value={firstName}
                                variant="outlined" label="First Name"/>
                            </div>
                            <div className={style.field}>
                                <h4>Your Last Name</h4>
                                <TextField classes={{ root: `${style.input} ${emptyName? style.invalidInput:''}` }}
                                onChange={handleLastName} value={lastName}
                                variant="outlined" label="Last Name"/>
                            </div>
                        </div>
                    </div>
                    <div className={style.signUpBtn}>
                        <button className={style.signupbtn} onClick={()=>{setLoader(true);register()}}>
                            {
                                loader?
                                <FitLoader/>
                                :
                                <>Sign Up</>
                            }
                        </button>
                    </div>
                    </>
                }
            </div>   
        </div>
    )
}

export default Signup
