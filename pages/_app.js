import {useState, useContext, useEffect} from 'react'
import '../styles/globals.css'
import Layout from '../c/layout/Layout'
import Gate from '../c/regular/Gate/Gate'
import Popup from '../c/small/Popup/Popup';
import {AuthContextProvider} from '../contexts/AuthContext';
import firebase from '../firebase/firebase'
import Loader from '../c/small/Loader/Loader';
import {useRouter} from 'next/router'
import 'pure-react-carousel/dist/react-carousel.es.css';
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.set(0.35)); 
Router.events.on('routeChangeComplete', () => NProgress.set(1.0)); 
Router.events.on('routeChangeError', () => NProgress.done());


function MyApp({ Component, pageProps }) {
  const [logged, setLogged] = useState(null);
  const router = useRouter();
  useEffect(()=>{
    const getuser = async () =>{
    await  firebase.auth().onAuthStateChanged(u=>{
        if(u){
          setLogged(true);
        }
        else {
          setLogged(false);
          router.push('/');
        }
      })
    }
    getuser();
  },[logged])


  return (
      <AuthContextProvider>
        {
          logged===true? 
          <Layout>
            <Component {...pageProps} />
          </Layout>:
          logged===false?
          <Gate/>:
          logged===null?
          <Loader/>:<></>
        }
      </AuthContextProvider>
  )
}

export default MyApp
