import Header from './Header/Header'
import Smenu from './Smenu/Smenu'
import Tail from './Tail/Tail'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

const Layout = ({children}) => {
    const auth = useContext(AuthContext);
    return (
        <>
            <Header logged={true}/>
            <Smenu/>
                {children}
            <Tail/> 
        </>
    )
}

export default Layout
