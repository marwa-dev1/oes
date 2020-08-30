import style from './Gate.module.css'
import { TextField } from '@material-ui/core'
import { useState, useContext } from 'react'
import firebase from '../../../firebase/firebase'
import { AuthContext } from '../../../contexts/AuthContext'
import FitLoader from '../../small/FitLoader/FitLoader'
const Login = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [ invalidEmail, setInvalidEmail] = useState(false);
    const [ err, setErr ] = useState('');
    const auth = useContext(AuthContext);
    const [loader, setLoader] = useState(false);

    const handleEmail = (e) => {
        setemail(e.target.value);
        setInvalidEmail(false);
        setErr('');
    }

    const handlePassword = (e) => {
        setpassword(e.target.value);
        setErr('');
    }

    const validateEmail = (e) => {
        const re = /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(oes)\.edu$/;
        if(re.test(e.target.value)) setInvalidEmail(false);
        else setInvalidEmail(true);
    }

    const login = () =>{
        if(email===''||password===''||invalidEmail===''){
            setLoader(false);
            return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).then((u)=>{
        }).catch((error) => {
            setLoader(false);
            setErr('Check Email and/or password!');
        });
    }

    return (
        <div className={style.inner}>
            <div className={style.fields}>
                <div className={style.field}>
                    <h4>Enter Email</h4>
                    <TextField classes={{ root: `${style.input} ${invalidEmail? style.invalidInput:''}` }} value={email} 
                    onChange={handleEmail}
                    onBlur={validateEmail}
                    variant="outlined" type="text" label="Email"/>
                </div>
                <div className={style.field}>
                    <h4>Enter Password</h4>
                    <TextField classes={{ root: style.input }} variant="outlined" 
                    type="password" label="password"
                    onChange={handlePassword}
                    />
                </div>
                {err?<p className={style.err}>{err}</p>:<></>}
                <div className={style.field}>
                    <button className={style.signupbtn} onClick={()=>{setLoader(true); login()}}> 
                    {
                        loader?
                        <FitLoader/>
                        :
                        <>Login</>
                    }
                    </button>
                </div>
            </div>              
        </div>
    )
}

export default Login
