import { get } from './requests'
import UserInformation from '../Interfaces/UserInformation'

export const getUserInfo = async () : Promise<UserInformation | undefined> => {
    return new Promise(async(resolve, reject) => {
        await get(`${process.env.REACT_APP_NEW_API_URL}/api/user/info`)
            .then(async response => {
                if(response.status === 200) return await response.json();
                throw new Error("Некорректный пользователь");
            })
            .then(({info}) => {
                console.log('getting info result:');
                console.log(info);
                info = {
                    id: info.id,
                    username: info.username,
                    role: info.role,
                    createdRoutesIds: info.createdRoutesIds || [],
                    favouriteRoutesIds: info.favouriteRoutesIds || []
                };
                resolve(info);
            }).catch(err=>reject(err));
            
    });
}