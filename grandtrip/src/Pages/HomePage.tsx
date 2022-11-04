/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'

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
                      <div className="top-section__buttons"><a className="button" href="roads.html">найти маршрут!</a><a className="button top-section__watch-compilation" href="roads.html"> <img src="img/icons/youtube.svg" /><span>Смотреть подборку</span></a></div>
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
        </div>
  }

  configureAnimations = () => {
      window.requestAnimationFrame(()=>{
        var circles = document.querySelectorAll('.cricle--animated') as NodeListOf<HTMLElement>;

        for (let i = 0; i < circles.length; i++) {
            window.addEventListener('scroll', function() {
                if (checkvisible(circles[i])) {
                    var blur = 140 - (-1 * (scrollY() - posY(circles[i])) / 5) + '%';
                    console.log(blur);
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