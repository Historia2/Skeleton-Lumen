import axios from 'axios';
import {HOSTNAME, HTTP_CONFIG, MAP_DEV} from './config';
import $ from 'jquery';

export const isAuthenticated = () => {
    const status = (localStorage.getItem('token') !== null) && (typeof window.db.get('expire') !== "undefined" ? window.db.get('expire') : false);
    if(!status) logout();
    return status;
};

export const resetPassword = ({ enc, password, url },callback) => {
  const $api = `https://adms-account-charlie.ibid.astra.co.id/MAP/users/ResetPassword/apa`;
  // const $api = "http://localhost/Ibid_ADMS_ServiceAccount/index.php/MAP/users/ResetPassword/apa";
  const $body = {
    enc: enc,
    password: password,
    url: url
  };

  // $.ajax({
  //   method: "POST",
  //   contentType: "application/json", // this
  //   dataType: "json", // and this
  //   headers: {
  //       "Access-Control-Allow-Origin": "*",
  //   },
  //   url: $api,
  //   data: $body
  // })
  //   .done(function( msg ) {
  //     alert( "Data Saved: " + msg );
  // });

  axios.post($api, $body, HTTP_CONFIG)
  .then(response => {
    const { data } = response;
    if(!data.ok){
      callback({ status: false, message: data.message });
    } else {
      callback({ status: true, message: 'success' });
    }
  }).catch(err => {
      console.log(err);
      callback({ status: false, message: 'Server Error' });
  })
}

export const CheckLoginMapLocal = (username, password, remember) => {
    const $body = {
        email: username,
        password: password
    };
    return axios.post(MAP_DEV.login_user,$body,HTTP_CONFIG)
        .then((response) => {
            let uniqueMapId = '421563788';

            let data = response.data.data;
            let status = response.data.status;
            console.log(status,'statusdata');
            if (status === 1) {
                let token = data.token;
                login({
                    token,
                    user: {
                        UserId: data.id + uniqueMapId,
                        plainUserId: data.id,
                        Name: data.first_name,
                        username: data.email,
                        subsType: "Regular",
                        EndDate: data.subscription_due,
                        sisaHari: data.subscription_expiration,
                        Company: data.company ? data.company : "Personal user",
                        Verified:data.verified,
                        company_address:data.address
                    }
                }, remember, password);
                return true;
            }
            return false;
        }).catch((e) => {
            console.log(e);
            return false;
    })
};

export const registerToMap = (user, password) => {
    let userData = user.user;
    axios.post(MAP_DEV.register_and_active_user,{
        email:userData.email,
        password:password,
        first_name:userData.Name,
        last_name:' ',
        company:userData.Company,
        subscription_due:userData.EndDate,
        subscription_expiration:userData.sisaHari,
        subscription_status:3,
        token:user.token,
    },HTTP_CONFIG)
        .then((response) => {
            // console.log(response,'response');
        }).catch(() => {

    })
};

export const authenticate = async ({ username, password, remember }, callback) => {
    let loginToBackend = await CheckLoginMapLocal(username,password,remember);
    console.log(loginToBackend,'loginToBackends');
    if( loginToBackend ) {
        return callback({ status: true, message: 'login success' });
    } else {
        const $api = `${HOSTNAME}/api/users/authenticate`;
        const $body = {
            username: username,
            password: password
        };
        axios.post($api, $body, HTTP_CONFIG)
            .then( async response => {
                const { data } = response;
                if (data.ok) {
                    await registerToMap(data,password);
                    await CheckLoginMapLocal(username,password,remember);
                    return callback({ status: true, message: 'sucess' });
                }
                return callback({ status: false, message: 'Login Fail, User not found!' });
            }).catch(err => {
            console.log(err);
            return callback({ status: true, message: 'Server Error' });
        })
    }
};

export const logout = () => {
    axios.defaults.headers.common['Authorization'] = '';
    // localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('company');
    localStorage.removeItem('subsType');
    localStorage.removeItem('subsDate');
    localStorage.removeItem('subsTime');
    localStorage.removeItem('plainUserId');
    localStorage.removeItem('company_address');
};

export const login = ({
    token,
    user: {
        UserId = 0,
        plainUserId = 0,
        Name = "user.name",
        username = "user.email",
        subsType = "Regular",
        EndDate = "0000-00-00",
        sisaHari = " - ",
        Company = "Personal User",
        Verified = 0,
        company_address = ''
    }
}, remember = false, password) => {
    // eslint-disable-next-line
    window.db.set("expire", true, 86400000);
    localStorage.setItem('token', token);
    localStorage.setItem('id', UserId);
    localStorage.setItem('plainUserId', plainUserId);
    localStorage.setItem('username', Name);
    localStorage.setItem('email', username);
    localStorage.setItem('company', Company);
    localStorage.setItem('subsType', subsType);
    localStorage.setItem('subsDate', EndDate);
    localStorage.setItem('subsTime', sisaHari);
    localStorage.setItem('verified', Verified);
    localStorage.setItem('company_address', company_address);

    if(remember) {
        localStorage.setItem('saved_username', username);
        localStorage.setItem('saved_password', password);
    } else {
        localStorage.removeItem('saved_username');
        localStorage.removeItem('saved_password');
    }
}
