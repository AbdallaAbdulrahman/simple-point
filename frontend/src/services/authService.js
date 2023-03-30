import {httpService} from './httpService';
import config from 'config/config';
import axios from 'axios';

export const signUp = ({ company, name, phone, email, password }) => {
   //   console.log(login, password);
 return httpService.post('api/register', {
  name,
  company,
  phone,
  email,
  password
 })
}

export const logIn = ({ email, password }) => {
 return httpService.post('api/login', {
    email,
    password
 })
  // let apiEndpoint = 'auth/sign/in';
  // let payload = {
  //   login,
  //   password
  // }
  // return axios.post(config.baseUrl+apiEndpoint, payload).then((response)=>{
  //     return response;
  // }).catch((err)=>{
  //     console.log(err);
  // })
}

export const logOut = () => {
  return httpService.get('api/logout');
}

export const recoverReset = ({ email }) => {
  return httpService.post('api/recover/password', {
    email
  });
}

export const verifyExpiresResetPassToken = ({ userId, token }) => {
  return httpService.post('api/reset/password/verify-token', {
    userId,
    token
  });
}

export const passwordReset = ({ userId, hash, token, password }) => {
  return httpService.post('api/reset/password', {
    userId,
    hash,
    token,
    password
  });
}

export const verifyEmail = ({ userId, hash }) => {
  return httpService.post('api/verify-email', {
    userId,
    hash
  });
}
