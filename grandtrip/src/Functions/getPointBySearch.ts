import { get } from './requests'

export default function getPointBySearch(query: string) {
    return get(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' + query + '.json', 
        { access_token: 'pk.eyJ1IjoiYnl0ZWljIiwiYSI6ImNrdHh6bTRzNTFnbmUyb21ycnRyNjlwbHYifQ.6nc0vKKePD5XLytqJBcjAA' }
        );
}