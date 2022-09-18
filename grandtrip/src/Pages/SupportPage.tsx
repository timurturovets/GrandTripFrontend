import React, { Component } from 'react'

export default class SupportPage extends Component {
    render() {
        return <div>
<div className="jumbotron text-light bg-dark bg-gradient rounded" style={{padding: "10px;"}}>
                <h2 className="display-4">Поддержка</h2>
                <hr className="my-2" />
                <p className="lead">
                    
                    Как только вы вошли на наш сайт сверху (в шапке сайта) вас встречают четыре раздела: GrandTrip, Маршруты и Поддержка. 
                    
                    В первом вы можете узнать о нашем проекте во всех подробностях.
                    
                    Во втором разделе (главном) вы можете воспользоваться готовыми тематическими маршрутами. Для этого нажмите на стрелку слева, после в выкатившемся окошке выберете интересующее вас время года и тематику маршрута. Если у вас вышло несколько маршрутов, то прочитав описание каждого, вы точно сможете найти лучший, для вас, маршрут!
                    
                    Третий, последний раздел, в котором вы сейчас находитесь – это поддержка, если у вас возникли вопросы по нашему сайту, то, возможно, здесь вам удастся их найти.
                </p>
            </div>

            <div className="container-fluid" style={{margin: "15px;"}}>
                <h3 className="text-center">Частозадаваемые вопросы (FAQ)</h3>
                <p className="p-2">Наш сайт имеет достаточно большой функционал. И если в разделе Маршруты все легко и понятно, то с Конструктором могут возникнуть трудности, ведь его с первого раза освоить не так-то и просто. Поэтому невольно возникают вопросы. Чуть ниже представлены часто задаваемые вопросы, надеемся, что среди них вы сможете найти решение для вашей проблемы!</p>
            </div>

            <div className="text-center" id="FAQaccordion">
                <div className="card">
                    <div className="card-header" id="Question1">
                        <h5 className="m-2 mb-0">
                            <button className="btn btn-light w-100" data-toggle="collapse" data-target="#Answer1" aria-expanded="true" aria-controls="Answer1">
                                Вопрос №1
                            </button>
                        </h5>
                    </div>

                    <div id="Answer1" className="collapse" aria-labelledby="Question1" data-parent="#FAQaccordion">
                        <div className="card-body">
                            Ответ №1
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" id="Question2">
                        <h5 className="m-2 mb-0">
                            <button className="btn btn-light w-100" data-toggle="collapse" data-target="#Answer2" aria-expanded="true" aria-controls="Answer2">
                                Вопрос №2
                            </button>
                        </h5>
                    </div>

                    <div id="Answer2" className="collapse" aria-labelledby="Question2" data-parent="#FAQaccordion">
                        <div className="card-body">
                            Ответ №2
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" id="Question3">
                        <h5 className="m-2 mb-0">
                            <button className="btn btn-light w-100" data-toggle="collapse" data-target="#Answer3" aria-expanded="true" aria-controls="Answer3">
                                Вопрос №3
                            </button>
                        </h5>
                    </div>

                    <div id="Answer3" className="collapse" aria-labelledby="Question3" data-parent="#FAQaccordion">
                        <div className="card-body">
                            Ответ №3
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}