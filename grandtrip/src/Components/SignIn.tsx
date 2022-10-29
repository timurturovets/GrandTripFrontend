import React, { Component, ReactNode } from 'react'
import { post } from '../Functions/requests'
import { AuthContextConsumer } from '../AuthContext'

interface SignInState {
    clickedLogin: boolean,
    username: string,
    password: string,
    pwVerification: string
    errMessage?: string
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

export default class SignIn extends Component<any, SignInState> {
    constructor(props: any) {
        super(props);

        this.state = {
            clickedLogin: false,
            username: "",
            password: "",
            pwVerification: "",
            errMessage: undefined
        };
    }
    render() {
        const { clickedLogin, errMessage } = this.state;
        return <AuthContextConsumer>
                {({isAuthenticated}) => 
                    <div>
                        <div style={myStyle}>
                            {errMessage && <p className="text-danger">{errMessage}</p>}
                            {clickedLogin 
                                ? this.renderLoginForm()
                                : this.renderRegisterForm()
                            }
                            <button onClick={e=>this.onSubmit(e)} className="btn btn-success">
                                {clickedLogin ? "Войти" : "Зарегистрироваться"}
                            </button>
                            <button onClick={e=>this.setState({clickedLogin: !this.state.clickedLogin})} 
                                className="btn btn-primary">
                                {clickedLogin ? "Ещё нет аккаунта?" : "Уже есть аккаунт?"}
                            </button>
                        </div>
                    </div>}
        </AuthContextConsumer>
    }

    onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { clickedLogin, username, password } = this.state;
        const url = `${process.env.REACT_APP_API_URL}/${clickedLogin ? "sign_in" : "sign_up"}`
        
        await post(url, {username, password}).then(async response => await response.json())
        .then(async response => {
            console.log(response);
        }).catch(err=>console.log(err));
    }

    renderLoginForm = () : ReactNode => {
        const { username, password } = this.state;
        return <div>
            <input type="text" className="form-control" 
            onChange={e=>this.setState({username: e.target.value})}
            value={username} placeholder="Логин" />
            <input type="password" className="form-control"
            onChange={e=>this.setState({password:e.target.value})} 
            value={password} placeholder="Пароль" />
        </div>
    }

    renderRegisterForm = () : ReactNode => {
        const { username, password, pwVerification } = this.state;
        return <div>
            <input type="text" className="form-control"
                onChange={e=>this.setState({username: e.target.value})}
                value={username} placeholder="Придумайте оригинальный логин" />
            <input type="password" className="form-control"
                onChange={e=>this.setState({password: e.target.value})} 
                value={password} placeholder="Придумайте надёжный пароль" />
            <input type="password" className="form-control"
                onChange={e=>this.setState({pwVerification: e.target.value})}
                value={pwVerification} placeholder="Подтвердите пароль" />
        </div>
    }
}