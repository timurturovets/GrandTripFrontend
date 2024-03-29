import React, { Component } from 'react'
import UserInformation from '../Interfaces/UserInformation'

interface AdminUserInfoProps {
    info: UserInformation
    onRoleChanging: (user: UserInformation, newRole: string) => void
    onDeleting: (user: UserInformation) => void
}

interface AdminUserInfoState {
    newRole: string | undefined
}

const myStyle = {
    border: '2px solid black',
    borderRadius: '5px',
    marginBottom: '5px',
    width: 'fit-content'
};

export default class AdminUserInfo extends Component<AdminUserInfoProps, AdminUserInfoState> {
    constructor(props: AdminUserInfoProps) {
        super(props);

        this.state = {
            newRole: undefined
        };
    }
    render() {
        const { info } = this.props;

        return <div style={myStyle}>
            <b>{info.username}</b>
            <div className="d-flex flex-row">
                <p>Роль: </p>
                <select className="form-select form-select-lg"
                    onChange={e=>this.setState({newRole: e.target.value})}>
                    <option disabled selected>Выберите роль</option>
                    <option disabled={info.role==="Default"} value="Default">Обычный пользователь {info.role==="Default" && "(текущая роль)"}</option>
                    <option disabled={info.role==="Editor"} value="Editor">Редактор {info.role==="Editor" && "(текущая роль)"}</option>
                    <option disabled={info.role==="Admin"} value="Admin">Администратор {info.role==="Admin" && "(текущая роль)"}</option>
                </select>
                <button className="btn btn-outline-success" onClick={this.handleSave}>Сохранить</button>
                <br />
                <button className="btn btn-outline-danger" onClick={this.handleDelete}>Удалить</button>
            </div>
            <select onChange={e=>window.location.href=`/constructor?edit=${e.target.value}`}>
                <option defaultChecked >Созданных маршрутов: {info.createdRoutesIds.length}</option>
                {info.createdRoutesIds.map(i => <option key={i} value={i}>
                    ID {i}
                </option>)}
            </select>
            </div>
    }

    handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        
        const { info, onRoleChanging } = this.props;
        const { newRole } = this.state;

        if(!newRole) {
            alert('Вы не изменили роль');
            return;
        }
        if(info.username === "teletraan") {
            alert('Меня-то не трогай!');
            return;
        }
        onRoleChanging(info, newRole);
    }

    handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const { onDeleting, info } = this.props;

        if(!window.confirm(`Удалить пользователя ${info.username}?`)) return;

        if(info.username === "teletraan") {
            alert('Меня-то не трогай!');
            return;
        }
        onDeleting(info);
    }
}