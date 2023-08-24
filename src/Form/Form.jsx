import React, { useState, useEffect, useRef } from "react";
import FormStyle from './Form.module.css';


const CustomForm = ({ GeneralDatasWea, GeneralDatasGeo }) => {
    
    const [dataInput, setdataInput] = useState('');
    const [statusMess, setStatusMess] = useState('');
    
    const refGeo = useRef();
    const refWea = useRef();
    
    const key = '77f3ea25f28d9bc367293732de0873d8';
    const endPoint = 'https://api.openweathermap.org/data/3.0/onecall?';
    const geoCoding = `http://api.openweathermap.org/geo/1.0/direct?q=${dataInput}&limit=1&appid=${key}&lang=ru&units=metric`;
   

    const handleChange = (e) => {
        setdataInput(e.target.value);
        }
       
            const heandleWeahter = (e) => {
                if(e.target === refWea.current) {
                    refWea.current.style.fontWeight = 700;
                }else if(e.target !== refWea.current && e.target.tagName === 'SECTION'){
                    refWea.current.style.fontWeight = 400;
                }

                if(e.target === refWea.current && dataInput){
                    
                    fetch(geoCoding)
                    .then(response => response.json())
                    .then(data => {
                      
                        fetch(`${endPoint}lat=${data[0].lat}&lon=${data[0].lon}&appid=${key}&lang=ru&units=metric`)
                        .then(response => response.json())
                        .then(data => {
                           
                            if(data.cod === '200'){
                                setStatusMess('По выбранному городу...');
                                refWea.current.style.fontWeight = 700;
                                GeneralDatasWea(data)
                            }else{
                                setStatusMess('Город не найден...');
                            }
                            
                    })
                })
                    
                }else if(e.target === refWea.current && !dataInput && e.target.tagName === 'SECTION'){
                    setStatusMess('↑ ↑ ↑ - Заполните поле - ↑ ↑ ↑');
                    refWea.current.style.fontWeight = 400;
                }
            }
            
        const error = () => {
            alert('Введите город или населённый пункт. Воспользуйтесь кнопкой "Прогноз по городу"');
            refGeo.current.style.fontWeight = 400;
        }
        
         const success = (position) => {
            fetch(`${endPoint}lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${key}&lang=ru&units=metric`)
            .then(response => response.json())
            .then(data => {
                GeneralDatasGeo(data)
                })
            }
    
                const heandlerGeo = (e) => {
                    if(e.target === refGeo.current) {
                        refGeo.current.style.fontWeight = 700;
                    }else if(e.target !== refGeo.current && e.target.tagName === 'SECTION'){
                        refGeo.current.style.fontWeight = 400;
                    }
                    
                    if(e.target === refGeo.current){
                    if (!navigator.geolocation) {
                        setStatusMess('Geolocation не поддерживается вашим браузером');
                    }else{
                        setStatusMess('По геопозиции...');
                        navigator.geolocation.getCurrentPosition(success, error)
                    }
                }
                }
    
    return (
        <>
            <h1 className={FormStyle.text}>Прогноз погоды</h1>
            <input type="text" className={FormStyle.modification} placeholder="Введите город на русском языке" onChange={handleChange} />
            <p className={FormStyle.message}>{statusMess}</p>
            <div className={FormStyle.buttonsReqPosition}>
                <button className={FormStyle.buttonPoss}><section ref={refWea} onClick={heandleWeahter}>Прогноз по городу</section></button>
                <button className={FormStyle.buttonPoss}><section ref={refGeo} onClick={heandlerGeo}>Прогноз по GEO</section></button>
            </div>
        </>
    )
}

export default CustomForm; 