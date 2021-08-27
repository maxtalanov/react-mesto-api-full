const checkResponse = res => res.ok  ? res.json() : Promise.reject(`Ошибка: ${res.status} - ${res.statusText}.`);
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': true,
};

// export const BASE_URL = 'https://auth.nomoreparties.club';
//export const BASE_URL = 'http://api.mesto-yp.nomoredomains.club';
export const BASE_URL = 'http://localhost:3000';


  // 1. Регистрация пользователя.
export const register = ({email, password}) => {
  // console.log(`ApiAuth (func 1) | key: ${password}, user: ${email}`);
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers,
    body: JSON.stringify({email, password})
  }).then(checkResponse)
}

  // 2. Авторизация пользователя.
export const authorize = ({email, password}) => {
  // console.log(`ApiAuth (func 2)| key: ${password}, user: ${email}`);
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, password })
  }).then(checkResponse)
}

  // 3. Проверка токена.
export const getContent = (jwt) => {
  // console.log(`ApiAuth (func 3)| token: ${jwt}`);
  return fetch(`${BASE_URL}/users/me`, {
    credentials: 'include',
    method: "GET",
    headers: {
      ...headers,
      //'Authorization': `Bearer ${jwt}`
    }
  }).then(checkResponse)
}
