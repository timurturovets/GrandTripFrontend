import React, { Component } from 'react'

export default class HomePage extends Component {
    render() {
        return <div className="d-flex flex-column">
        <div className="card text-center m-lg-5">
            <img src="wwwroot/sobor.png" className="card-img-top" alt="" />
            {/*<h3 className="card-header">1. Что сюда написать?</h3>
            <p className="card-text">
                2. А сюда?
    </p>*/}
        </div>
        <div>
            <div className="d-flex flex-row">
                <div style={{borderRight: "3px solid black", flex: 1}}>
                    <div className="card text-center m-lg-5">
                        <img src="wwwroot/sobor.png" className="card-img-top" alt=""/>

                        <h3 className="card-header">Для кого?</h3>
                        <div className="card-body">
                            <p className="card-text">
                                Этот сайт для Вас, если Вы уже осмотрели все наиболее известные места в Санкт-Петербурге и не знаете, куда сходить, либо Вы только приехали в город и хотите с ним познакомиться.
                            </p>
                        </div>
                    </div>
                </div>
                <div style={{flex: "1"}}></div>
            </div>
            <div className="d-flex flex-row">
                <div style={{borderRight: "3px solid black", flex: 1}}></div>
                <div style={{flex: 1}}>
                    <div className="card text-center m-lg-5">
                        <img src="wwwroot/sobor.png" className="card-img-top" alt=""/>

                        <h3 className="card-header">Удивительные возможности</h3>
                        <div className="card-body">
                            <p className="card-text">
                                Подберем маршрут в зависимости от того, где Вы, когда Вы и сколько времени Вы готовы уделить.
                            </p>
                            <a className="btn btn-primary" href="routes.html">Ознакомиться с маршрутами</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-row">
                <div style={{borderRight: "3px solid black", flex: 1}}>
                    <div className="card text-center m-lg-5">
                        <img src="wwwroot/sobor.png" className="card-img-top" alt=""/>

                        <h3 className="card-header">Чётко и ясно</h3>
                        <div className="card-body">
                            <p className="card-text">
                                Узнайте больше о каждом пункте маршрута. Подробная информация о локации и интересные факты.
                            </p>

                            <a className="btn btn-primary" href="random.html">Открыть случайный маршрут</a>
                        </div>
                    </div>
                </div>
                <div style={{flex: 1}}></div>
            </div>
            <div className="d-flex flex-row">
                <div style={{borderRight: "3px solid black", flex: 1}}></div>
                <div style={{flex: 1}}>
                    <div className="card text-center m-lg-5">
                        <img src="wwwroot/sobor.png" className="card-img-top" alt=""/>

                        <h3 className="card-header">Не оставим в беде!</h3>
                        <div className="card-body">
                            <p className="card-text">
                                У нашего сайта отличная страница поддержки, на которой вы можете прочитать некоторые инструкции, найти ответы на самые частозадаваемые вопросы, а так же задать их в нашем Telegram-боте, если вдруг вы не нашли ответ в разделе частозадаваемых вопросов.
                            </p>

                            <a href="support.html" className="btn btn-primary">Страница поддержки</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    }
}