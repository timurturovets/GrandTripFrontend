import React, { Component, ReactNode } from 'react'
import { post } from '../Functions/requests'
import { getUserInfo } from '../Functions/getUserInfo'
import { AuthContextConsumer } from '../AuthContext'
import { statusSetter, userInfoSetter } from '../Interfaces/authStatusSetter'

interface SignInPageState {
    clickedLogin: boolean,
    username: string,
    password: string,
    pwVerification: string
    errMessage?: string,
}

const myStyle = { 
    padding: '5%',
    margin: '0 auto',
    marginTop: '10%',
    width: 'fit-content',
    height: 'fit-content',
    border: '2px solid gray',
    borderRadius: '6px'
};

export default class SignInPage extends Component<any, SignInPageState> {
    constructor(props: any) {
        super(props);

        this.state = {
            clickedLogin: false,
            username: "",
            password: "",
            pwVerification: "",
            errMessage: undefined,
        };
    }

    render() {
        const { clickedLogin, errMessage } = this.state;
        /*let backUrl = "/";
        let fromRef = new URLSearchParams(window.location.search).get('from');
        if(fromRef) backUrl = `/${fromRef}`;*/
        return <AuthContextConsumer>
                {({isAuthenticated, setStatus, setInfo}) => 
                    isAuthenticated 
                        ? function(){window.location.href="/";return null;}()
                        : <div>
                            <div /*style={myStyle}*/>
                                {errMessage && <p className="text-danger">{errMessage}</p>}
                                <section className="log-in-section">
                                {clickedLogin 
                                    ? this.renderLoginForm()
                                    : this.renderRegisterForm()
                                }
                                <button onClick={e=>this.onSubmit(e, setStatus, setInfo)} 
                                className="text-center log-in-section__button button">
                                    {clickedLogin ? "Войти" : "Зарегистрироваться"}
                                </button>
                                </section>
                            </div>
                        </div>}
        </AuthContextConsumer>
    }

    onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
        setStatus: typeof statusSetter, setInfo: typeof userInfoSetter) => {
        e.preventDefault();

        const { clickedLogin, username, password, pwVerification } = this.state;
        if(!clickedLogin && password !== pwVerification) {
            this.setState({errMessage: "Пароли не совпадают"});
            return;
        }

        const url = `${process.env.REACT_APP_API_URL}/${clickedLogin ? "sign_in" : "sign_up"}`
        
        await post(url, {username, password}).then(async response => await response.json())
        .then(async response => {
            console.log(response);
            if(response.err) {
                this.setState({errMessage: response.err});
                return;
            }

            if(!response.token) {
                this.setState({ errMessage: "Произошла ошибка. Попробуйте позже."});
                return;
            }

            console.log(response);
            setStatus(true, response.token);
            const info = await getUserInfo();
            if(info) setInfo(info);
        }).catch(err=>console.log(err));
    }

    renderLoginForm1 = () : ReactNode => {
        const { username, password } = this.state;
        return <form>
            <input type="text" className="form-control" 
            onChange={e=>this.setState({username: e.target.value})}
            value={username} placeholder="Логин" />

            <input type="password" className="form-control"
            onChange={e=>this.setState({password:e.target.value})} 
            value={password} placeholder="Пароль" />
        </form>
    }
    renderLoginForm = () : ReactNode => {
        const { username, password } = this.state;
        return <div className="container">
            <h2> 
              <p>Вход</p>
            </h2>
            <div className="log-in-section__subtitle">
              <p>Еще нет аккаунта? 
                <button className="link" onClick={e=>this.setState({clickedLogin: false})}>Регистрация</button></p>
            </div>
            <div className="log-in-section__fields">
              <form action=""> 
                <div className="log-in-section__fields">
                  <input className="field" type="text" placeholder="Имя пользователя" 
                  onChange={e=>this.setState({username: e.target.value})}
                  value={username} />
                  <input className="field" type="text" placeholder="Пароль" 
                  onChange={e=>this.setState({password: e.target.value})}
                  value={password} />
                </div>
              </form>
            </div>
          </div>
    }
    renderRegisterForm1 = () : ReactNode => {
        const { username, password, pwVerification } = this.state;
        return <form>
            <input type="text" className="form-control"
                onChange={e=>this.setState({username: e.target.value})}
                value={username} placeholder="Придумайте оригинальный логин" />

            <input type="password" className="form-control"
                onChange={e=>this.setState({password: e.target.value})} 
                value={password} placeholder="Придумайте надёжный пароль" autoComplete="" />

            {(pwVerification && pwVerification !== password) &&
            <p className="text-danger text-sm m-0">Пароли не совпадают</p>}

            <input type="password" className="form-control"
                onChange={e=>this.setState({pwVerification: e.target.value})}
                value={pwVerification} placeholder="Подтвердите пароль" autoComplete="" />
        </form>
    }

    renderRegisterForm = () : ReactNode => {
        const { username, password, pwVerification } = this.state;
        return <div className="container">
          <h2> 
            <p>Регистрация </p>
          </h2>
          <div className="log-in-section__subtitle">
            <p>Уже есть аккаунт? 
                <button className="link" onClick={e=>this.setState({clickedLogin: true})}>Войти</button></p>
          </div>
          <div className="log-in-section__fields">
            <form action=""> 
              <div className="log-in-section__fields">
                <input className="field" type="text" placeholder="Имя пользователя"
                onChange={e=>this.setState({username: e.target.value})}
                value={username} />

                <input className="field" type="password" placeholder="Пароль"
                onChange={e=>this.setState({password: e.target.value})} 
                value={password} />

                <input className="field" type="password" placeholder="Подтвердите пароль" 
                onChange={e=>this.setState({pwVerification: e.target.value})}
                value={pwVerification}/>

                {(pwVerification && pwVerification !== password) &&
                    <p className="text-danger text-sm m-0">Пароли не совпадают</p>}
              </div>
            </form>
          </div>
        </div>
    }
}