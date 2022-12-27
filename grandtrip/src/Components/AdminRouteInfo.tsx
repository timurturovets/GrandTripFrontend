import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import RouteInformation from '../Interfaces/RouteInformation'
import UserInformation from '../Interfaces/UserInformation'

interface AdminRouteInfoProps {
    info: RouteInformation,
    users: UserInformation[]
    onAuthorChanging: (route: RouteInformation, user: UserInformation) => void,
}

interface AdminRouteInfoState {
    newAuthorId: string | undefined
}

const myStyle = {
    border: '2px solid black',
    borderRadius: '5px',
    marginBottom: '5px',
    width: 'fit-content'
};

export default class AdminRouteInfo extends Component<AdminRouteInfoProps, AdminRouteInfoState> {
    constructor(props: AdminRouteInfoProps) {
        super(props);

        this.state = {
            newAuthorId: undefined
        };
    }
    render() {
        const { info, users } = this.props;

        const { name, author } = info;

        return <div style={myStyle}>
            <h4><b>{name}</b></h4>
            <div className="d-flex flex-row">
                <p className="m-0 mt-1">Автор: </p>
                <select className="form-select form-select-sm"
                onChange={this.handleAuthorChanging}>
                    <option selected disabled>Выберите автора</option>
                    {users.map(user => 
                    <option disabled={user.username === author} key={user.username} value={user.id}>
                        {user.username} {user.username === author && "(текущий автор)"}
                    </option>)}
                </select>
                <button onClick={this.handleSaving} className="btn btn-outline-success btn-sm">
                    Сохранить</button>
            </div>
            <Link to={`/constructor?edit=${info.id}`} style={{width: '100%'}}
                className="btn btn-outline-primary btn-sm">
                Редактировать в конструкторе</Link>
        </div>
    }

    handleAuthorChanging = (e: React.ChangeEvent<HTMLSelectElement>) => this.setState({newAuthorId:e.target.value});

    handleSaving = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { info, users, onAuthorChanging } = this.props;
        const { newAuthorId } = this.state;
        
        const user = users.find(u => u.id === parseInt(newAuthorId!))!;

        onAuthorChanging(info, user);
    }
}