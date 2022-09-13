for (let l of document.getElementsByClassName("options")) {
    l.style.marginTop = "5px";
}
/*document.getElementById("btn-render-route").addEventListener("click", e => {
    render_route(JSON.stringify({ "name": "route name", "desc": "route desc", "dotsList": [{ "id": 0, "name": "12", "PositionX": 59.96254384538685, "PositionY": 30.301116334001744, "link": "", "desc": "desc12" }, { "id": 2, "name": "14", "PositionX": 59.96073879019001, "PositionY": 30.32118722549387, "link": "", "desc": "desc14" }, { "id": 3, "name": "15", "PositionX": 59.956526612268874, "PositionY": 30.314496928329845, "link": "", "desc": "desc15" }, { "id": 4, "name": "16", "PositionX": 59.94930448998919, "PositionY": 30.318270942114648, "link": "", "desc": "desc16" }, { "id": 5, "name": "nigger could you stfu", "PositionX": 59.95214194000358, "PositionY": 30.303346433056447, "link": "https://leafletjs.com/reference.html", "desc": "pls" }] }));
});*/
/*let button1 = document.getElementById("fasst").addEventListener("click", () => {

let js = "<script type=\"text/javascript\" charset=\"utf-8\" async src=\"https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Ad99ba10f854657acacd0c9f1d0bbc3b919ac3490ad8222344fc7578c79dfae09&amp;width=500&amp;height=400&amp;lang=ru_RU&amp;scroll=true\"></script>";
document.getElementById("main-container").innerHTML = js;
window.location.reload(true);
});
*/


// let toggler = document.getElementsByClassName("caret");

// for (let i = 0; i < toggler.length; i++) {
//     toggler[i].addEventListener("click", function(e) {
//         this.parentElement.querySelector(".nested").classList.toggle("active");
//         this.classList.toggle("caret-down");
//     });
// }


// let button = document.getElementById("sidenav-button"),
//     sidenav = document.getElementById("MySideNav"),
//     mainCont = document.getElementById("main-container");

// button.style.marginTop = `${window.innerHeight/3}px`;
// button.addEventListener("click", OpenNav);

// function OpenNav() {
//     button.removeEventListener("click", OpenNav);
//     button.addEventListener("click", CloseNav);
//     let width = 0;
//     window.requestAnimationFrame(moveFurther);
//     button.innerText = "<-";

//     function moveFurther() {
//         if (width == 45) {
//             sidenav.style.width = "45%";
//             button.style.marginLeft = "45%";
//             return;
//         } else {
//             sidenav.style.width = `${width}%`;
//             button.style.marginLeft = `${width}%`;
//             width += 4.5;
//             window.requestAnimationFrame(moveFurther);
//         }
//     }
// }

// function CloseNav() {
//     button.removeEventListener("click", CloseNav);
//     button.addEventListener("click", OpenNav);
//     let width = 45;
//     window.requestAnimationFrame(moveBack);
//     button.innerText = "->";

//     function moveBack() {
//         if (width == 0) {
//             sidenav.style.width = "0%";
//             button.style.marginLeft = "0%";
//             return;
//         } else {
//             sidenav.style.width = `${width}%`;
//             button.style.marginLeft = `${width}%`;
//             width -= 4.5;
//             window.requestAnimationFrame(moveBack);
//         }
//     }
// }