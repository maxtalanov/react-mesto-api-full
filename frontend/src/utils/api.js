const onError = res => res.ok  ? res.json() : Promise.reject(`Ошибка: ${res.status} - ${res.statusText}.`);
console.log(localStorage.getItem('jwt'));
export class Api {
  constructor(config) {
    this._url = config.baseUrl;
    this._headers = config.headers;
    this._cookie = config.credentials;
  }

  //1. Мето получения информации о пользователе
  getInfoUser() {
    return fetch(`${this._url}/users/me`, {
      credentials: 'include',
      method: "GET",
      headers: this._headers
    }).then(onError)
  }

  //2. Метод получения масива карточек
  getIntalCards() {
    return fetch(`${this._url}/cards`, {
      credentials: 'include',
      method: "GET",
      headers: this._headers
    }).then(onError)
  }

  //3. Метод редактирования профиля
  editYourProfile(editDataUser) {
    //console.log(editDataUser, 'API 3');
    return fetch(`${this._url}/users/me`, {
      credentials: 'include',
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: editDataUser.name,
        about: editDataUser.about
      })
    }).then(onError)
  }

  //4. Метод добавления новой карточки
  addNewCard(data) {
    //console.log(data, 'API 4');
    return fetch(`${this._url}/cards`, {
      credentials: 'include',
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(data)
    }).then(onError)
  }

  //5. Метод удаления карточки
  removeCard(id) {
     // console.log(id)
    return fetch(`${this._url}/cards/${id}`, {
      credentials: 'include',
      method: "DELETE",
      headers: this._headers
    }).then(onError)
  }

  //6. Метод: Постановка лайка
  addLike(id) {
    // console.log(`api 6 => Передача ID:${id} лайка на сервер`);
    return fetch(`${this._url}/cards/likes/${id}`, {
      credentials: 'include',
      method: "PUT",
      headers: this._headers
    }).then(onError)
  }

  //7. Метод: Cнятие лайка
  removeLike(id) {
    // console.log('api 6');
    return fetch(`${this._url}/cards/likes/${id}`, {
      credentials: 'include',
      method: "DELETE",
      headers: this._headers
    }).then(onError)
  }

  //8. Метод Изменения аватара
  upAvatar(editDataUser) {
    // console.log(editDataUser, 'api 8');
    return fetch(`${this._url}/users/me/avatar`, {
      credentials: 'include',
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: editDataUser.avatar})
    }).then(onError)
  }

  //9. Метод: постановки и снятия лайка
  changeLikeCardStatus(cardID, like) {
    console.log(cardID, like);
    console.log('token', this._headers);
    // Обычная реализация: 2 разных метода для удаления и постановки лайка.
    return fetch(`${this._url}/cards/${cardID}/likes`, {
      credentials: 'include',
      method: like ? 'PUT' : 'DELETE',
      headers: this._headers,
    }).then(onError)
  }
}

const jwt = localStorage.getItem('jwt');
const api = new Api({
  baseUrl: 'https://api.mesto-new.nomoredomains.club',
  // baseUrl: 'http://api.mesto-new.nomoredomains.club',
  // baseUrl: 'http://localhost:3000'',
  credentials: 'include',
  headers: {
    authorization: `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  }
});

export default api;
