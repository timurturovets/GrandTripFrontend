import React, { Component } from 'react'

export default class Footer extends Component {
    render() {
        return <footer className="footer">
        <div className="container">
          <div className="footer__links">
            <div className="footer__group1">
              <div className="footer__column">
                <div>Страницы</div><a className="link" href="index.html">Главная</a><a className="link" href="roads.html">Маршруты</a><a className="link" href="support.html">Поддержка</a><a className="link" href="log-in.html">Вход</a><a className="link" href="registration.html">Регистрация</a>
              </div>
              <div className="footer__column">
                <div>Наши контакты</div><a className="link" href="mail@grandtrip.com">mail@grandtrip.com</a><a className="link" href="support.html">Поддержка</a>
              </div>
            </div>
            <div className="footer__column footer__last-column"><a className="logo" href="index.html">GRANDTRIP</a><a className="link" href="index.html"> <img src="img/icons/vk-icon.svg" /><span>@grandtrip</span></a><a className="link" href="roads.html"> <img src="img/icons/instagram-icon.svg" /><span>@grandtrip</span></a><a className="link" href="support.html"> <img src="img/icons/telegram-icon.svg" /><span>наш бот</span></a></div>
          </div>
          <div className="footer__note link">GranndTrip Ⓒ 2021 - 2022 | Все права защищены</div>
        </div>
      </footer>
    }
}