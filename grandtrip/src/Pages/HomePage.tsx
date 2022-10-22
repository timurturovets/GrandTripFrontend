import React, { Component } from 'react'
import { Link } from 'react-router-dom'
export default class HomePage extends Component {
    render() {
        return <div className="d-flex flex-row">
        {/*<div className="card text-center m-lg-5">
            <img src="wwwroot/bg-spb1.jpg" className="card-img-top" alt="" />
            <h3 className="card-header">1. Что сюда написать?</h3>
            <p className="card-text">
                2. А сюда?
            </p>
        </div>*/}
        <div className="d-flex flex-row">
            <div style={{flex: 1}} className="d-flex flex-column">
                <div style={{flex: 1}}>
                    <div className="card text-center m-lg-5">
                        <img src="wwwroot/bg-spb2.jpg" className="card-img-top" alt=""/>

                        <h2 className="card-header display-2">Для кого?</h2>
                        <div className="card-body">
                            <h4 className="card-text">
                            Если вы уже обошли все достопримечательности города или только приехали, то  этот сайт именно для вас.
                            </h4>
                        </div>
                    </div>
                </div>
                <div style={{flex: 1}}>
                    <div className="card text-center m-lg-5">
                        <img src="wwwroot/bg-kzn1.jpg" className="card-img-top" alt=""/>

                        <h3 className="card-header display-3">Удивительные возможности</h3>
                        <div className="card-body">
                            <h4 className="card-text">
                            С лёгкостью найдёте интересные (уникальные) маршруты по городу, учитывая ваши интересы и возможности
                            </h4>
                            <Link to="/routes" className="btn btn-primary">Ознакомиться с маршрутами</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{flex: 1}} className="d-flex flex-column">
                    <div style={{flex: 1}} className="card text-center m-lg-5">
                        <img src="wwwroot/bg-spb3.jpg" className="card-img-top" alt=""/>

                        <h3 className="card-header display-3">Чётко и ясно</h3>
                        <div className="card-body">
                            <h4 className="card-text">
                            Вы можете узнать больше о каждом маршруте благодаря подробным, уникальным описаниям и интересным фактам
                            </h4>

                            <Link className="btn btn-primary" to="/">Открыть случайный маршрут</Link>
                        </div>
                    </div>

                <div style={{flex: 1}}>
                    <div className="card text-center m-lg-5">
                        <img src="wwwroot/bg-kzn2.jpg" className="card-img-top" alt=""/>

                        <h3 className="card-header display-3">Не оставим в беде!</h3>
                        <div className="card-body">
                            <h4 className="card-text">
                                Если у вас возникнут вопросы, перейдите на страницу с поддержкой. Вы сможете найти ответы на часто задаваемые вопросы или написать нам.
                            </h4>
                            <Link to="/support" className="btn btn-primary">Страница поддержки</Link>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    }
}