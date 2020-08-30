import Card from '../../small/Card/Card'
import style from './CardsGrid.module.css'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
const CardsGrid = ({title, data, published}) => {
    const {user,userType} = useContext(AuthContext);
    const setImage = (course) =>{
        switch(course){
            case 'calculus':
                return '/courses/calculus.png';
            case 'linear':
                return '/courses/linear.png';
            case 'software':
                return '/courses/software.png';
            default:
                return '/courses/default.svg';
        }
    }
    return (
        <div className={style.main}>
            <h2>{title}</h2>
            <div className={style.cards_c}>
                { 
                data?
                data.map((e,i)=>{
                    if((user && user.uid === e.authorId) || !published || (userType && userType==='student'))
                    return(
                        <Card
                            id={e.id}
                            author={e.author}
                            title={e.title}
                            img={setImage(e.course)}
                            per={e.per}
                            type={e.type}
                            course={e.course}
                            date={e.date}
                            deadline={e.deadline}
                            answers={e.answers}
                            questionsLen={e.questions.length}
                            published={published}
                            key={i}
                        />
                    )
                })
                :<></>
                }

            </div>
        </div>
    )
}

export default CardsGrid
