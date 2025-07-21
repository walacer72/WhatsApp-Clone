import { useState, useEffect } from 'react';
import './newChat.css';
import {ArrowBackIcon} from '@mui/material';
import Api from '../Api';

export const NewChat = ({ chatList, user, show, setShow }) => {

  const [contactList, setContactList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      if (user !== null) {
        // FAÇO A REQUISIÇÃO E ENVIO MEU ID PARA COMPARAR COM OS IDs DOS MEU USUARIOS ARMAZENADOS NO BANCO DE DADOS
        let resultsContacts = await Api.getContactList(user.id);

        // SALVO NA STATE O RETORNO DO RESULTADO COM OS USUARIOS !== DO MEU ID
        setContactList(resultsContacts);
      }
    }
    getList();

  }, [user]);

  const addNewChat = async (user2) => {
    await Api.addNewChat(user, user2)
    setShow(false);
  }


  return (
    <div
      style={{ left: show ? '0px' : '-415px' }}
      class="newChat">

      <div class="newChat-head">
        <div
          onClick={() => setShow(false)}
          class="newChat--backbutton">
          <ArrowBackIcon style={{ color: '#fff' }} />
        </div>
        <div class="newChat--headtitle">Nova Conversa</div>
      </div>

      <div class="newChat-list">

        {contactList.map((item, key) => (

          <div
            onClick={() => addNewChat(item)}
            key={key} class="newChat-item">
            <img
              src={item.avatar}
              className='newChat--avatar'
            />
            <div class="newChat--name">{item.name}</div>
          </div>
        ))}

      </div>

    </div>
  )
}