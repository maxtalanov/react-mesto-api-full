import React from "react";
import { Redirect, Switch, Route, useHistory } from "react-router-dom";

import Main from '../components/Main';
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import * as ApiAuth from "../utils/ApiAuth";

import successIcon from "../images/successful.svg";
import errorIcon from "../images/failed.svg";

import { directoryHTTP } from "../utils/constants";


function App() {
  //console.log(props, 'Компонент APP');
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards , setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email , setEmail] = React.useState('')
  const [registerOk, setRegisterOk] = React.useState(false);
  const [registerError, setRegisterError] = React.useState(false)
  const history =  useHistory();

  React.useEffect(() => {
    tokenCheck();
  }, []);

  React.useEffect(() => {
    if (loggedIn) {
      history.push('/profile');
    }
  }, [history, loggedIn]);

    //Карточки инит
  React.useEffect(()=> {
    getCards()
  }, []);

  //Информация о пользователе
  React.useEffect(() => {
    infoUser();
  },[]);

  const getCards = () => {
    api.getIntalCards(cards)
      .then(cards =>{
        setCards(cards);
      })
      .catch((err) => {
        console.log('Код ошибки:', err); // выведем ошибку в консоль
        console.log(`Проверьте причину в справочнике по адресу: ${directoryHTTP}`);
      });
  }

  const infoUser = () => {
    api.getInfoUser(currentUser)
      .then(currentUser => {
        setEmail(currentUser.email)
        setCurrentUser(currentUser)
      })
      .catch((err) => {
        console.log('Код ошибки:', err); // выведем ошибку в консоль
        console.log(`Проверьте причину в справочнике по адресу: ${directoryHTTP}`)
      });
  }

  // Проверка токена на сервере
  const tokenCheck = () => {

    ApiAuth
      .getContent()
      .then((data) => {
        setLoggedIn(true);
      })
      .catch((err) => {
        setRegisterError(true);

        console.log('Код ошибки:', err);
        console.log(`Справочник ошибок ${directoryHTTP}`)
      });
  };

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({})
    setRegisterError(false);
    setRegisterOk(false)
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log('Код ошибки:', err); // выведем ошибку в консоль
        console.log(`Проверьте причину в справочнике по адресу: ${directoryHTTP}`)
      });
  }

  function handleCardDelete(card) {
    api.removeCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id ? c : ''));
      })
      .catch((err) => {
        console.log('Код ошибки:', err); // выведем ошибку в консоль
        console.log(`Проверьте причину в справочнике по адресу: ${directoryHTTP}`)
      });
  }

  function handleCardClick(card){
    setSelectedCard(card);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleUpdateUser(editDataUser) {
      //console.log(editDataUser, '')
    api.editYourProfile(editDataUser)
      .then(newDataUser => {
        setCurrentUser(newDataUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.log('Код ошибки:', err); // выведем ошибку в консоль
        console.log(`Проверьте причину в справочнике по адресу: ${directoryHTTP}`)
      })
  }

  function handleUpdateAvatar(editAvatar) {
    api.upAvatar(editAvatar)
      .then(newDataUser => {
        setCurrentUser(newDataUser);
        closeAllPopups();
      })
      .catch((err) => {
      console.log('Код ошибки:', err); // выведем ошибку в консоль
      console.log(`Проверьте причину в справочнике по адресу: ${directoryHTTP}`)
    })
  }

  function handleAddCard(addNewCardData) {
    api.addNewCard(addNewCardData)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log('Код ошибки:', err); // выведем ошибку в консоль
        console.log(`Проверьте причину в справочнике по адресу: ${directoryHTTP}`)
      })
  }

  function closePopupRegisterOk() {
    closeAllPopups()
    history.push('sign-in');
  }

  const onLogin = (data) => {
    // console.log(`Попытка авторизации, log: ${data}`)

    return ApiAuth
      .authorize(data)
      .then(({ token }) => {
        setLoggedIn(true);
        setEmail(data.email);
        infoUser();
        getCards()
        history.push('/profile')
      })
      .catch((err) => {
        console.log('Код ошибки:', err);
        console.log(`Справочник ошибок ${directoryHTTP}`)
        setEmail('');
      });
  }

  const onRegister = (data) => {
    return ApiAuth
      .register(data)
      .then((res) => {
        setRegisterOk(true);
      })
      .catch((err) => {
        setRegisterError(true);

        console.log('Код ошибки:', err);
        console.log(`Справочник ошибок ${directoryHTTP}`)
      });
  }

  const onLogout = () => {
    ApiAuth
      .userExit()
      .then(message => {
        setLoggedIn(false);
        setEmail('');
        setCurrentUser('');
        setCards([]);
        console.log(message)
      })
      .catch((err) => {
        setRegisterError(true);

        console.log('Код ошибки:', err);
        console.log(`Справочник ошибок ${directoryHTTP}`)
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Switch>
          <ProtectedRoute exact
            profileEditOnClick={handleEditProfileClick}
            addPlacrOnClick={handleAddPlaceClick}
            avatarEditOnClick={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            component={Main}
            path={"/profile"}
            isLoggedIn={loggedIn}
            onLogout={onLogout}
            emailShow={email}
          />

          <Route path="/sign-in">
            <Login onLogin={onLogin} />
          </Route>
          <Route path="/sign-up">
            <Register onRegister={onRegister} />
            <InfoTooltip
              src={successIcon}
              title={'Вы успешно зарегистрировались!'}
              isOpen={registerOk}
              onClose={closePopupRegisterOk}
            />
            <InfoTooltip
              src={errorIcon}
              title={'Что-то пошло не так! Попробуйте ещё раз.'}
              isOpen={registerError}
              onClose={closeAllPopups}
            />
          </Route>

          <Route path="/">
            {loggedIn ? <Redirect to="/profile"/> : <Redirect to="/sign-in"/>}
          </Route>
        </Switch>

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <EditAvatarPopup  isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddCard}/>

        <PopupWithForm name="delete" title="Вы уверены?" inputBtnSelector="create" inpitValue="Да">
        </PopupWithForm>

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
