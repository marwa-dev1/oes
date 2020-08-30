import {useContext, createContext, useState} from 'react'
import firebase from '../firebase/firebase'

export const AuthContext = createContext();

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

export const AuthContextProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [name, setname] = useState(null);
    const [surname, setsurname] = useState(null);

    const rs = /@students.oes.edu/;
    const rt = /@oes.edu/;

    firebase.auth().onAuthStateChanged((u)=>{
        setUser(u);
        if(u){
            if(rs.test(u.email)){
                setUserType('student');
                firebase.database().ref(`main/users/students/${u.uid}`).once("value", snapshot=>{
                    setname(snapshot.val().name);
                    if(snapshot.val().surname){
                        setsurname(snapshot.val().surname);
                    }
                    else setsurname(snapshot.val().name)
                });
            }
            if(rt.test(u.email)){
                setUserType('teacher');
                firebase.database().ref(`main/users/teachers/${u.uid}`).once("value", snapshot=>{
                    setname(snapshot.val().name);
                    if(snapshot.val().surname){
                        setsurname(snapshot.val().surname);
                    }
                });
            }
        }
    })

    return (
        <AuthContext.Provider value={{user, userType, name, surname}}>
            {children}
        </AuthContext.Provider>
    )
}

