import axios from 'axios';
import { HTTP_CONFIG } from 'services';

export const requestData = (api, paramter, callback) => {
    axios.post((api), paramter, HTTP_CONFIG)
    .then(({data, ...response}) => {
        let result = {
            ...data.data.data[0]
        };

        if(result.item === null){
            // result.title += " (No Data)";
            result.item = [];
        }
        callback(response.status, result);
    }).catch(err => {
        console.log(err);
        // callback(err.response.status, null)
    });
};
