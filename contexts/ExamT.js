import {useState, useContext, createContext} from 'react'

export const ExamTContext = createContext()


export const ExamTProvider = ({children}) => {
    const [ questions, setQuestions ] = useState([]);
    const removeQ = (id) => setQuestions(questions=> questions.filter(q=> q.id !== id));
    const saveData = (id, data) => {
        const questionsCopy = questions;
        questionsCopy.forEach(e=>{
            if(e.id===id){
                e.data = data;
            }
            setQuestions(questions=>questionsCopy);
        })
    }
    return (
        <ExamTContext.Provider
            value={{
                questions, setQuestions, saveData, removeQ
            }}
        >
            {children}
        </ExamTContext.Provider>
    )
}

