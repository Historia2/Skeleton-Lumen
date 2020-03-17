export const prerequisite = (callback) => {
    // const api = 'http://localhost:3000/options.json';
    // const api = 'https://api.myjson.com/bins/1fandu';
    // const api = 'https://api.myjson.com/bins/jwsiu';
    // const api = 'https://map-web-backend.azurewebsites.net/index.php/jwsiu';

    // prod const api = 'https://map-web-backend.azurewebsites.net/index.php/jwsiu';
    // const api = 'https://map-web-backend.azurewebsites.net/index.php/jwsiu_dev'; //dev
    const api = 'https://map-web-backend.azurewebsites.net/backend/json_dev'; //development
    // const api = 'http://127.0.0.2:80/json_dev'; //local

    fetch(api)
    .then(response => response.json())
    .then(result => callback(result));
};
