import React, { Component, ReactNode } from 'react'

interface SignInState {
    clickedLogin: boolean,
    userName: string,
    password: string,
    pwVerification: string
}

export default class SignIn extends Component<any, SignInState> {
    constructor(props: any) {
        super(props);

        this.state = {
            clickedLogin: false,
            userName: "",
            password: "",
            pwVerification: ""
        };
    }
    render() {
        const { clickedLogin } = this.state;
        return <div style={{width: "70%", textAlign: "center"}}>
            {clickedLogin 
                ? this.renderLoginForm()
                : this.renderRegisterForm()
            }
            <button onClick={e=>this.onSubmit(e)} className="btn btn-success">
                {!clickedLogin ?
                 "Зарегистрироваться"
                 :"Войти"}
            </button>
        </div>
    }

    onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { clickedLogin, userName, password } = this.state;
        const url = `${process.env.REACT_APP_API_URL}/${clickedLogin ? "sign_in" : "sign_up"}?`
        +`userName=${userName}&password=${password}`;
        
        console.log(`Url: ${url}`);
        await fetch(url).then(async r => {
            
        }).catch(e=>console.log(e));
    }

    renderLoginForm = () : ReactNode => {
        const { userName, password } = this.state;
        return <div>
            <input type="text" className="form-control" 
            onChange={e=>this.setState({userName: e.target.value})}
            value={userName} placeholder="Логин" />
            <input type="password" className="form-control"
            onChange={e=>this.setState({password:e.target.value})} 
            value={password} placeholder="Пароль" />
        </div>
    }

    renderRegisterForm = () : ReactNode => {
        const { userName, password, pwVerification } = this.state;
        return <div>
            <input type="text" className="form-control"
            onChange={e=>this.setState({userName: e.target.value})}
            value={userName} placeholder="Придумайте оригинальный логин" />
            <input type="password" className="form-control"
            onChange={e=>this.setState({password: e.target.value})} 
            value={password} placeholder="Придумайте надёжный пароль" />
            <input type="password" className="form-control"
            onChange={e=>this.setState({pwVerification: e.target.value})}
            value={pwVerification} placeholder="Подтвердите пароль" />
        </div>
    }
}