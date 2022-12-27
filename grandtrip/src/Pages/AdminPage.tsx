import React, { Component } from 'react'
import AuthComponent from '../AuthComponent'
import RouteInformation from '../Interfaces/RouteInformation'
import UserInformation from '../Interfaces/UserInformation'
import { get, post } from '../Functions/requests'
import AdminRouteInfo from '../Components/AdminRouteInfo'
import AdminUserInfo from '../Components/AdminUserInfo'

interface AdminPageState {
    isLoadingRoutes: boolean,
    routes: RouteInformation[],
    isLoadingUsers: boolean,
    users: UserInformation[],
    errorMessage?: string
}

const myStyle = {
    width: '70%',
    height: '300px',
    overflow: 'scroll'
};

export default class AdminPage extends Component<any, AdminPageState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isLoadingRoutes: true,
            routes: [],
            isLoadingUsers: true,
            users: [],
            errorMessage: undefined
        };
    }

    async componentDidMount() {
        await Promise.all([
            this.fetchRoutes(),
            this.fetchUsers()
        ]).catch(err=>alert(err));
    }
    
    render() {
        const { isLoadingRoutes, routes, isLoadingUsers, users, errorMessage } = this.state;
        return <AuthComponent role="Admin">
            <h1 className="text-center">Админ-панель</h1>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {isLoadingUsers
                ? <p>Загрузка всех маршрутов и пользователей..</p>
                : <div>
                    <div style={{...myStyle, overflowX: 'hidden'}}>{
                        isLoadingRoutes
                            ? <p>Загрузка маршрутов..</p>
                            : routes.map(r=><AdminRouteInfo key={r.id} 
                                info={r} users={users} onAuthorChanging={this.handleAuthorChanging}/>)
                        }
                    </div>
                    <div style={{...myStyle, overflowX: 'hidden', borderTop: '2px solid black'}}>
                        <button className="btn btn-outline-secondary" onClick={this.showInfo}>?</button>
                        {users.map(u=><AdminUserInfo key={u.id} info={u} 
                            onRoleChanging={this.handleRoleChanging} />)}
                    </div>
                </div>
            }
        </AuthComponent>
    }

    showInfo = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        alert('Права обычного пользователя: редактирование своих маршрутов'+/*);
        alert(*/'\nПрава редактора: редактирование также чужих маршрутов'+/*);
        alert(*/'\nПрава администратора: редактирование чужих маршрутов, доступ к этой странице');
    }

    fetchRoutes = async () => {
        await get(`${process.env.REACT_APP_NEW_API_URL}/api/route/getall`)
            .then(async response => {
                if(response.status === 200) this.setState({ 
                    isLoadingRoutes: false, routes: (await response.json()).routes
                });
            });
    }

    fetchUsers = async () => {
        await get(`${process.env.REACT_APP_NEW_API_URL}/api/user/getall`)
            .then(async response => {
                if(response.status === 200) this.setState({
                    isLoadingUsers: false, users: (await response.json()).users
                });
            });
    }

    handleAuthorChanging = async (route: RouteInformation, user: UserInformation) => {
        const fd = new FormData();
        fd.append('routeId', route.id.toString());
        fd.append('authorId', user.id.toString());
        await post(`${process.env.REACT_APP_NEW_API_URL}/api/admin/changeauthor`, fd)
            .then(async response => {
                if(response.status === 200) {
                    alert(`Маршруту "${route.name}" успешно установлен новый автор: ${user.username}`
                    +`\nПерезагрузите страницу, чтобы увидеть изменения`);
                }
                else alert(`Произошла ошибка при попытке установить автора. ${response.status}`);
            });
    }

    handleRoleChanging = async (user: UserInformation, newRole: string) => {
        const fd = new FormData();
        fd.append('userId', user.id.toString());
        fd.append('role', newRole);
        alert(`${newRole} on ${user.username}`);
        await post(`${process.env.REACT_APP_NEW_API_URL}/api/admin/changerole`, fd)
            .then(async response => {
                if(response.status === 200) alert(`Пользователю ${user.username} успешно установлена новая роль: ${newRole}`
                    +`\nПерезагрузите страницу, чтобы увидеть изменения`)
                else alert(`Произошла ошибка при попытке установить автора. ${response.status}`);
            })
    }
}