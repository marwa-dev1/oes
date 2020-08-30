import Link from 'next/link'
import style from './SmenuSection.module.css'
import {IoIosArrowUp, IoIosArrowDown} from 'react-icons/io'
import SlideToggle from 'react-slide-toggle'
import { useState } from 'react'
import uniqid from 'uniqid';

const SmenuSection = ({topics, subtopics, links}) => {
    const [switchers, setSwitchers] = useState(new Array(topics.length).fill(true));


    const toggler = (i) => {
        const switchersTemp = switchers;
        switchersTemp[i] = !switchersTemp[i];
        setSwitchers(switchersTemp);
    }



    return (
        <div className={style.s}>
            {topics.map((e,i)=>{
                return(
                    <SlideToggle
                        key={'t-'+uniqid()}
                        onExpanding={()=>toggler(i)}
                        onCollapsing={()=>toggler(i)}
                        render={({ toggle, setCollapsibleElement }) => (
                                <div className={style.s}>
                                    <div className={style.s_title} onClick={toggle}>
                                        <p>{e}</p>
                                        {
                                            subtopics &&subtopics[i]?
                                            switchers[i]?
                                            <IoIosArrowUp color="white"/>:
                                            <IoIosArrowDown color="white"/>
                                            :<></>
                                        }
                                    </div>
                                    <div className={style.s_topics} ref={setCollapsibleElement}>
                                    {
                                        subtopics&&subtopics[i]?
                                        subtopics[i].map((e,j)=>{
                                        if(i==0){
                                            return <Link href={links&&links[i]?links[i][j].href:''} as={links&&links[i]?links[i][j].as:''} key={j}>
                                                <p key={'st-'+ uniqid()} >{e}</p>
                                            </Link>
                                        }
                                        else
                                        return <Link href={links&&links[i]?links[i][j]:''} key={j}>
                                            <p key={'st-'+ uniqid()} >{e}</p>
                                        </Link>
                                        }):<></>
                                    }
                                    </div>
                                </div>
                        )}
                    />
                )
            })}
        </div>
    )
}

export default SmenuSection
