import Head from 'next/head'
import style from '../styles/Home.module.css'
import Dashboard from '../c/regular/Dashboard/Dashboard';
import StdDashboard from '../c/regular/StdDashboard/StdDashboard';
import { useContext } from 'react';
import {AuthContext} from '../contexts/AuthContext'
import firebase from '../firebase/firebase'

export default function Home() {
  const {user, userType} = useContext(AuthContext);
  return (
    <div className={style.container}>
      <Head>
        <title>OES</title>
        <link rel="icon" href="/online-test.png" />
      </Head>
      {
        userType==='teacher'?
        <Dashboard/>
        :
        <StdDashboard/>
      }
    </div>
  )
}
