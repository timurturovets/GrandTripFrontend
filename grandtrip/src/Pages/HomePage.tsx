/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class HomePage extends Component {
    componentDidMount() {
      this.configureAnimations();
    }
    render() {
        return <div>
                <section className="top-section">
                  <div className="container">
                    <div className="top-section__content">
                      <h1>Добро пожаловать в <span className="logo">GRANDTRIP</span></h1>
                      <p>Готовые идеи для Вашей прогулки</p>
                      <div className="top-section__buttons">
                        <Link to="/routes" className="button">найти маршрут!</Link>
                        <Link to="/routes" className="button top-section__watch-compilation"> 
                          <img src="img/icons/youtube.svg" /><span>Смотреть подборку</span>
                        </Link>
                      </div>
                    </div>
                    <div className="top-section__background">
                      <div className="top-section__images">
                        <div className="top-section__images-container">
                          <div className="line"><img className="top-section__bg-img" src="img/image 4.jpg" /><img className="top-section__bg-img" src="img/image 2.jpg" /><img className="top-section__bg-img" src="img/image 3.jpg" /></div>
                          <div className="line"><img className="top-section__bg-img" src="img/image 1.jpg" /><img className="top-section__bg-img" src="img/image 3.jpg" /><img className="top-section__bg-img" src="img/image 2.jpg" /></div>
                          <div className="line"><img className="top-section__bg-img" src="img/image 3.jpg" /><img className="top-section__bg-img" src="img/image 2.jpg" /><img className="top-section__bg-img" src="img/image 2.jpg" /><img className="top-section__bg-img" src="img/image 1.jpg" /></div>
                          <div className="line"><img className="top-section__bg-img" src="img/image 4.jpg" /><img className="top-section__bg-img" src="img/image 3.jpg" /></div>
                          <div className="line"><img className="top-section__bg-img" src="img/image 3.jpg" /><img className="top-section__bg-img" src="img/image 2.jpg" /><img className="top-section__bg-img" src="img/image 1.jpg" /></div>
                        </div>
                      </div>
                    </div>
                  </div><a className="top-section__scroll-button"><img src="img/icons/arrow.svg" alt="" /></a>
                </section>
                <section className="line-section">
                  <div className="container"><svg id="text-container" viewBox="0 -20 1000 240" xmlns="http://www.w3.org/2000/svg"> <path id="text-curve" d="M0 100s269.931 86.612 520 0c250.069-86.612 480 0 480 0" fill="none"></path> 
                  <text y="40" fontSize="40px"> <textPath id="text-path" href="#text-curve" startOffset="700"> • Создаем маршруты, а не клише • Создаем маршруты, а не клише • Создаем маршруты, а не клише •
                  </textPath> </text></svg>
                  </div>
                </section>
                <section className="features-section">
                  <div className="container">
                    <div className="features-section__image"></div>
                    <div className="features-section__text textblock">
                      <h2>Удивительные возможности в деле</h2>
                      <p>Сохраняйте понравившиеся локации и маршруты и делитесь ими с друзьями в социальных сетях и мессенджерах. Отмечайте карте избранные места и обязательно попробуйте создать свой собственный маршрут!</p><a className="button" href="roads.html">найти маршрут!</a>
                    </div>
                    <div className="circle cricle--animated circle--color1 features-section__circle"></div>
                    <div className="circle cricle--animated circle--color2 features-section__circle"></div>
                  </div>
                </section>
                <section className="steps-section">
                  <div className="container">
                    <div className="steps-section__steps">
                      <div className="steps-section__element">
                        <div className="steps-section__step step">
                          <div className="step__title">
                            <h3>Зарегистрируйтесь</h3><span className="step__num">1</span>
                          </div>
                          <p>Так Вы сможете сохранять понравившиеся локации и отмечать их на карте, а также создавать свои собственные маршруты: для себя или общественного пользования </p>
                        </div>
                      </div>
                      <div className="steps-section__element">
                        <div className="steps-section__step step">
                          <div className="step__title">
                            <h3>Оценка Ваших предпочтений</h3><span className="step__num">2</span>
                          </div>
                          <p>Пройдите короткий тест на оценку Ваших интересов. Так мы сможем посоветовать Вам наиболее подходящие маршруты.</p>
                        </div>
                      </div>
                      <div className="steps-section__element">
                        <div className="steps-section__step step">
                          <div className="step__title">
                            <h3>Выберите лучший из предложенных</h3><span className="step__num">3</span>
                          </div>
                          <p>Составим подборку маршрутов по Вашим предпочтениям. Вы можете ознакомиться со всеми и сохранить</p>
                        </div>
                      </div>
                    </div>
                    <div className="circle cricle--animated circle--color1"></div>
                    <div className="circle cricle--animated circle--color2"></div>
                  </div>
                </section>
                <section className="about-us-section">
                  <div className="container">
                    <div className="about-us-section__image">
                      <div className="circle circle--color2 cricle--animated"></div><img className="about-us-section__kai-logo" src="img/icons/kai-logo.svg" />
                    </div>
                    <div className="about-us-section__text textblock">
                      <h2>О Нас</h2>
                      <p>Мы — команда из СУНЦ КНИТУ-КАИ. Этот сайт мы создали в сентябре 2021 на конференции «Университетская гимназия», организатор СПбГУ. В проект вложено много сил талантливых ребят, поэтому мы надеемся, что он сможет принести вам пользу.<br />GrandTrip - проект с открытым исходным кодом.
                        </p><a className="button" href="https://github.com/timurturovets/GrandTripFrontend">фронтенд</a> <a className="button" href="https://github.com/timurturovets/GrandTripAPI">бэкенд</a>
                    </div>
                  </div>
                </section>
                <section className="ideas-section">
                  <div className="container">
                    <div className="ideas-section__text textblock">
                      <h2>Ваши идеи смотрятся классно</h2>
                      <p>Создайте свой собственный маршрут, отправьте его на обработку - после проверки он будет виден для всех. Или сохраните его для себя и друзей! Мы открыты к новым идеям. Пишите нам на почту: <b>grandtrip@mail.ru</b>, или <a onClick={e=>function(){e.preventDefault();alert('Телеграм-бот в разработке.')}()}>в наш телеграм-бот</a>.</p><Link className="button" to="/constructor">создать маршрут</Link>
                    </div>
                    <div className="ideas-section__image"><img src="img/road.png" /></div>
                  </div>
                </section>
                    <section className="log-in-section">
                      <div className="container">
                        <h2> 
                          <p><Link className="link" to="sign-in">Регистрация</Link></p>
                        </h2>{/*<span className="log-in-section__subtitle">
                          <p>
                            <Link className="link" to="sign-in">Войти</Link></p></span>*/}
                      </div>
                    </section>
                </div>
  }

  configureAnimations = () => {
      window.requestAnimationFrame(()=>{
        var circles = document.querySelectorAll('.cricle--animated') as NodeListOf<HTMLElement>;

        for (let i = 0; i < circles.length; i++) {
            window.addEventListener('scroll', function() {
                if (checkvisible(circles[i])) {
                    var blur = 140 - (-1 * (scrollY() - posY(circles[i])) / 5) + '%';
                    circles[i].style.setProperty('--a', blur);
                }
            });
        }

        function posY(elm: HTMLElement) {
            var test: HTMLElement | null = elm,
                top = 0;

            while (!!test && test.tagName.toLowerCase() !== "body") {
                top += test.offsetTop;
                test = test.offsetParent as HTMLElement | null;
            }

            return top;
        }

        function viewPortHeight() {
            var de = document.documentElement;

            if (!!window.innerWidth) {
                return window.innerHeight;
            } else if (de && !isNaN(de.clientHeight)) {
                return de.clientHeight;
            }

            return 0;
        }

        function scrollY() {
            if (window.pageYOffset) {
                return window.pageYOffset;
            }
            return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        }

        function checkvisible(elm: HTMLElement) {
            var vpH = viewPortHeight(), // Viewport Height
                st = scrollY(), // Scroll Top
                y = posY(elm);

            return (y < (vpH + st));
        }
        var textpath = document.querySelector("#text-path");
        var textcontainer = document.querySelector("#text-container");
        if (!textcontainer) return;
        //var boddy = document.querySelector("body")

        var scrollSelf = textcontainer.scrollTop + 800;

        window.addEventListener('scroll', function() {
          if (!textpath) return;
            textpath.setAttribute('startOffset', `${scrollSelf - document.documentElement.scrollTop}`);
            let lineSection = document.querySelector(".line-section") as HTMLElement | null;
            if(!lineSection) return;
            lineSection.style.bottom = -(document.documentElement.scrollTop - (scrollSelf - 800)) / 5 + 'px';
        });

        var r = document.querySelector(".top-section__images-container") as HTMLElement | null;

        window.addEventListener('scroll', function() {
          if(!r) return;
            r.style.setProperty('--scroll-bias', document.documentElement.scrollTop / 3 + 'px');
        });
      });
  }
}