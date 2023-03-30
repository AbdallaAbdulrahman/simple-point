import {httpService} from './httpService';

export const getUsers = () => {
   return httpService.get('api/admin/users/');
}

export const getBusinesspeople = () => {
   return httpService.get('api/admin/businesses');
 }

export const getUserById = ({id}) => {
   return httpService.get(`users/:${id}`);
}

export const deleteUser = ({ id }) => {
   return httpService.deleteDetail('api/admin/user/delete/' + id)
}

export const updateUser = ({ id, company, name, phone, email }) => {
   return httpService.put('api/profile/update', {id, company, name, phone, email})
}

export const updateUserCompany = ({ id, company, name, phone, email }) => {
   return httpService.put('api/profile/company', {id, company, name, phone, email})
}

export const updateUserName = ({ id, company, name, phone, email }) => {
   return httpService.put('api/profile/name', {id, company, name, phone, email})
}

export const updateUserPhone = ({ id, company, name, phone, email }) => {
   return httpService.put('api/profile/phone', {id, company, name, phone, email})
}

export const updateUserMail = ({ id, company, name, phone, email }) => {
   return httpService.put('api/profile/mail', {id, company, name, phone, email})
}

export const updateUserPasswd = ({ id, current_passwd, passwd }) => {
   return httpService.put('api/profile/passwd', {id, current_passwd, passwd})
}

export const createUser = ({ company, name, phone, email, password, role }) => {
   //   console.log(login, password);
 return httpService.post('api/admin/user/create', {
  name,
  company,
  phone,
  email,
  password,
  role
 })
}