import axios from 'axios';
import { HOSTNAME, HTTP_CONFIG } from 'services';
import {MAP_DEV} from "../../../../services";

export const createProfile = (callback) => {
    const api = MAP_DEV.service.profiles.create;
    const body = {
        "key": "default",
        "value": "[[],[]]",
        'user_id':localStorage.getItem('id')
    };
    axios.post(api, body, HTTP_CONFIG)
    .then(({data, ...response}) => {
        callback(true);
    }).catch(e => console.log(e));

};

export const readProfile = (callback) => {
    const api = MAP_DEV.service.profiles.get;
    axios.post(api,{
        user_id:localStorage.getItem('id')
    }, HTTP_CONFIG)
    .then(({data, ...response}) => {
        data = data.data;
        const rawWidgets = data.length > 0 ? data[0].value : null ;
        const widgets = rawWidgets !== null ? ( Array.isArray(JSON.parse(rawWidgets)) ? JSON.parse(rawWidgets) : JSON.parse(JSON.parse(rawWidgets))) : [];
        callback(widgets);
    }).catch(e => console.log(e));
};

export const updateProfile = (parameter, callback) => {
    const api = MAP_DEV.service.profiles.update;
    const body = {
        "key": "default",
        "value": JSON.stringify(parameter),
        'user_id':localStorage.getItem('id')
    };
    axios.patch(api, body, HTTP_CONFIG)
    .then(({data, ...response}) => {
        callback(true);
    }).catch(e => console.log(e));
};


export const requestData = (paramter, callback) => {
    const api = MAP_DEV.service.insight.get;
    axios.post(api, paramter, HTTP_CONFIG)
    .then(({data, ...response}) => {
        // const series = data
        callback(data.data.data);
    }).catch(e => console.log(e));
}
