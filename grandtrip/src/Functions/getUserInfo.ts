import { get } from './requests'
import UserInformation from '../Interfaces/UserInformation'

export const getUserInfo = async () : Promise<UserInformation | undefined> => {
    let info: UserInformation | undefined = undefined;
    await get(`${process.env.REACT_APP_API_URL}/user_info`).then(async response => await response.json())
        .then(result => {
            info = {
                id: result.id,
                username: result.username,
                role: result.role,
                createdRoutesIds: result.createdRoutesIds,
                favouriteRoutesIds: result.favouriteRoutesIds
            };
        }).catch(err=>console.log(err));
    return info;
}