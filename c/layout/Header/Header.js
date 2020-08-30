import {useRouter} from 'next/router'
import Link from 'next/link'
import style from './Header.module.css'
import { useState, useEffect, useContext } from 'react';
import {IoIosNotifications} from 'react-icons/io'
import {BsFillGrid3X3GapFill, BsSearch, BsInfoCircle, BsNewspaper} from 'react-icons/bs'
import {AiFillRightSquare} from 'react-icons/ai';
import {FiFileText} from 'react-icons/fi'
import {MdGrade} from 'react-icons/md'
import {GiExitDoor} from 'react-icons/gi'
import Notification from '../../small/Notification/Notification';
import firebase from '../../../firebase/firebase'
import { AuthContext } from '../../../contexts/AuthContext';

const Header = ({logged}) => {
    const [note, setNote] = useState(false);
    const {user, userType, name, surname} = useContext(AuthContext);
    const [noteExists, setNoteExists] = useState(false);

    const showCrimson = () => {
        setNoteExists(true);
    }

    let tch,std;
    if(userType==='teacher'){
        tch=true;
        std=false;
    }
    else{
        tch=false;
        std=true;
    }
    const router = useRouter();
    const dropmenu = (v)=>{
        setNote(v);
    }
    const [ collapse, setcollapse ] = useState(true);
    const collapseControl = () => {
        setcollapse(!collapse);
    }
    const slidemenu = ()=>{}

    const logout = () => {
        firebase.auth().signOut()
    }


    return (
        <div className={style.main}>
            <Link href="/">
                <div className={style.logo_s}>
                    <img src='/online-test.png' width="43" height="43"/>
                    OES
                </div>
            </Link>
            {
            logged?
                <div className={style.right_s} onBlur={()=>dropmenu(false)} tabIndex={0}>
                    <div className={style.search}>
                        <BsSearch/>
                        <input className={style.search_i} placeholder="Search" type="text" />
                    </div>
                    <div className={style.notebell} onClick={()=>dropmenu(!note)}>
                        <IoIosNotifications color="white" size={28}  className={style.notification} /> 
                        <div className={style.newnote} style={{visibility: noteExists?'visible':'hidden'}}/>
                        {note?<Notification displayCrimson={showCrimson} />:<Notification hide={true} displayCrimson={showCrimson}/>}
                    </div>
                    <div className={style.profile_img}>
                        <img src="/user/profile-a-male.png" width="30" height="30"/>
                        <div className={style.profile_info}>
                            {user?name+' '+surname:'...'}
                            <br/>
                            ----------
                            <br/>
                            {user?userType:'...'}
                        </div>
                    </div>
                    <div style={{width:25}}/>
                    {/* <BsFillGrid3X3GapFill color="white" size={25} onClick={slidemenu} /> */}
                    <div className={style.sliding_menu} style={collapse?{right:-185}:{right:0}} onBlur={()=>setcollapse(true)}>
                        <div className={style.toggler} onClick={collapseControl} style={collapse?{right:15}:{right:140}}>
                            {collapse?<BsFillGrid3X3GapFill size={25} color="white"/>:<AiFillRightSquare size={25} color="white"/>}
                        </div>
                            <Link href="/my-info">
                                <div className={style.element}>
                                    <BsInfoCircle size={15} />
                                    &nbsp;
                                    <a>My Info</a>
                                </div>
                            </Link>
                                {
                                    tch?
                                    <Link href="/my-saved-exams">
                                        <div className={style.element}>
                                            <FiFileText size={15}/>
                                            &nbsp;
                                            <a>My Saved Exams</a>
                                        </div>
                                    </Link>
                                    :
                                    <Link href="/my-exams">
                                        <div className={style.element}>
                                            <FiFileText size={15}/>
                                            &nbsp;
                                            <a>My Exams</a>
                                        </div>
                                    </Link>
                                }
                                {/* {
                                    tch?
                                    <Link href="">
                                        <div className={style.element}>
                                            <MdGrade size={15}/>
                                            &nbsp;
                                            <a>My Students</a>
                                        </div>
                                    </Link>
                                    :
                                    <Link href="">
                                        <div className={style.element}>
                                            <MdGrade size={15}/>
                                            &nbsp;
                                            <a>My Grades</a>
                                        </div>
                                    </Link>
                                } */}
                                <div className={style.element} data-="logout" onClick={logout}>
                                    <GiExitDoor size={15}/>
                                     &nbsp;
                                    <a >Logout</a>
                                </div>
                    </div>
                </div>
            :<div></div>
            }
        </div>
    )
}

export default Header
