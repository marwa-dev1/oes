import {useState, useCallback, useEffect} from 'react'
import style from './ExPreview.module.css'
import { useContext } from 'react'
import { ExamTContext } from '../../../contexts/ExamT'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, DotGroup, Dot } from 'pure-react-carousel';


const ExPreview = ({close, show}) => {
    const {questions} = useContext(ExamTContext);
    return (
        <div className={style.main} style={show?{}:{display:'none'}}>
            <button className={`${style.closebtn} ${style.btn}`} onClick={()=>close(false)}> 
                Close
            </button>
            <CarouselProvider
            naturalSlideWidth={1200}
            naturalSlideHeight={500}
            totalSlides={questions.length}
            >
            <Slider>
                {
                questions.map(({id, data},i)=>
                    <Slide index={i} key={id}>
                        <div key={id} className={style.single_q}>
                            <div className={style.title}>
                                <h4>{i+1}. {data.title}. ({data.points}p)</h4>
                            </div>
                            {
                                data[`tf_${id}`]==="true"?
                                <div className={style.tf}>
                                    <span>True</span> <input variant="outlined" type="radio" name={`tf_${id}`}/>
                                    <span>False</span> <input variant="outlined" type="radio" name={`tf_${id}`}/>
                                </div>:
                                <div className={style.mcq}>
                                    <div><input type="radio" name={`c_${id}`}/><span>{data.ans_a}</span></div>
                                    <div><input type="radio" name={`c_${id}`}/><span>{data.ans_b}</span></div>
                                    <div><input type="radio" name={`c_${id}`}/><span>{data.ans_c}</span></div>
                                    <div><input type="radio" name={`c_${id}`}/><span>{data.ans_d}</span></div>
                                </div>
                            }
                        </div>
                    </Slide>
                    )}
            </Slider>
            <div className={style.btns}>
            <ButtonBack className={style.btn} >Back</ButtonBack>
            <ButtonNext className={style.btn} >Next</ButtonNext>
            </div>
            <div className={style.qsNumbers}>
                <DotGroup dotNumbers className={style.numbers_container} />
            </div>
            </CarouselProvider>
        </div>
    )
}

export default ExPreview
