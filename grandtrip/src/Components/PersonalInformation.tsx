import React, { Component } from 'react'
import UserInformation from '../Interfaces/UserInformation'

interface PersonalInformationProps {
    info: UserInformation
}

interface PersonalInformationState {
    username: string,
    oldPassword?: string,
    newPassword?: string
}
export default class PersonalInformation extends Component<PersonalInformationProps, PersonalInformationState> {
    constructor(props: PersonalInformationProps) {
        super(props);

        this.state = {
            username: props.info.username,
        }
    }

    render() {
        const { username } = this.state;
        return <div>
            <h3>Ваш никнейм: </h3>
            <input type="text" className="form-control" value={username} />
            <h3>Сменить пароль: </h3>
            <input type="text" className="form-control" placeholder="Старый пароль" />
            
        </div>
    }

    handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ username: e.target.value });
    }

    handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();


    }
}