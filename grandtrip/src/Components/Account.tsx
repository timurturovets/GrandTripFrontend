import React, { Component } from 'react'
import { AuthContextConsumer } from '../AuthContext'
import RouteInformation from '../Interfaces/RouteInformation'
import { get } from '../Functions/requests'
import UserInformation from '../Interfaces/UserInformation'
import { Link } from 'react-router-dom'

interface AccountState {
    isLoading: boolean,
    createdRoutes: RouteInformation[]
}
export default class Account extends Component<any, AccountState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: true,
            createdRoutes: []
        };
    }

    render() {
        const { isLoading, createdRoutes } = this.state;

        console.log('createdRoutes: ');
        console.log(createdRoutes);
        return <AuthContextConsumer>{({info})=>
        <div>
            {isLoading && function(t){t.fetchRoutes(info!);return null;}(this)}
            <h1 className="text-center">{info?.username}</h1>
            <div style={{marginLeft: '10%'}}>
            <h3>Созданные вами маршруты</h3>
            {isLoading 
                ? <p>Загрузка...</p> 
                : createdRoutes.length < 1 ? <p>Вы не создали ни одного маршрута.</p>
                : <div style={{overflow: 'scroll', overflowX:'hidden', 
                border: '3px solid black', borderRadius: '5px',
                height:'200px', width: '50%'}}>
                    {createdRoutes.map(r => <div key={r.id}>
                        <hr style={{margin: 0, color: 'black', width: '2px'}}/>
                        <h5><b className="m-0 h-3">{r.name}</b></h5>
                        <h6><p className="m-0">Тематика: {r.theme}, сезон: {r.season}, 
                        точек: {r.dots.length}, линий: {r.lines.length}</p></h6>
                        <Link to={`/constructor?edit=${r.id}`} 
                        className="button button--bordered sidebar__bottom-button">
                                Редактировать маршрут</Link>
                </div>)}
                </div>
            }
            <button className="btn btn-danger" onClick={this.handleLogOff}>Выйти из аккаунта</button>
            </div>
        </div>}</AuthContextConsumer>
    }

    fetchRoutes = async (info: UserInformation) => {
        const ids = info.createdRoutesIds;
        const query = {
            ids: JSON.stringify(ids)/*: ids.reduce(
                (p,c) => p + `${c}&ids=`
                , "ids").slice(0, ids.length*2-1)*/
            }       
        //console.log(query.ids);            
        console.log(query);
        await get(`${process.env.REACT_APP_NEW_API_URL}/api/route/created`, query)
            .then(async response => {
                if(response.status === 400) alert('Произошла ошибка при загрузке созданных маршрутов. Перезайдите на страницу');
                const result = await response.json();
                console.log('received result:');
                console.log(result);
                this.setState({ isLoading: false, createdRoutes: result.routes });
            })
    }

    handleLogOff = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        localStorage.clear();
        window.location.reload();
    }
}