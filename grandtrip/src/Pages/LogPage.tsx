import React, { Component } from 'react'
import { get } from '../Functions/requests'

interface LogPageState {
    isLoading: boolean,
    result: string
}
export default class LogPage extends Component<any, LogPageState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: true, 
            result: ""
        }
    }
    async componentDidMount() {
        await get(`${process.env.REACT_APP_API_URL}/log`).then(async response=> {
            const logs = await response.text();
            console.log(logs);
            this.setState({
                isLoading: false,
                result: logs
            });
        }).catch(err=>this.setState({isLoading: false, result: `Ошибка: ${err}`}));
    }

    render() {
        const { isLoading, result } = this.state;
        const arr = result.split('\n');
        return isLoading 
        ? <h1>Загрузка..</h1> 
        : <p>{(result && arr.map(x=><div>{x}<br /></div>)) || "Логи пусты"}</p>
    }
}