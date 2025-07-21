import {SearchIcon} from '@mui/material/';
import {AttachFileIcon} from '@mui/material';
import {MoreVertIcon} from '@mui/material';
import './ChatWindow.css';
import EmojiPicker from 'emoji-picker-react';
// import icons
import {InsertEmoticonIcon} from '@mui/material';
import {CloseIcon} from '@mui/material';
import {SendIcon} from '@mui/material';
import {MicIcon} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { MsgItem } from './msgItem';
import Api from '../Api';

export const ChatWindow = ({user, data}) => {

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [listMsg, setListMsg] = useState([]);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    setListMsg([]);

    let unsub = Api.onChatContent(data.chatId, setListMsg, setUsers);

    return unsub;
    
  }, [data.chatId]);

  // VERIFICAR SE O CONTEUDO NO BODY É MAIOR QUE A AREA DA TELA
  const body = useRef();

  // CALCULA O TAMANHO DO CONTEUDO NO BODY E DIMINUI JOGANDO O SCROOL PRA BAIXO
  useEffect(() => {
    if (body.current.scrollHeight > body.current.offsetHeight) {
      body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
    }
  }, [listMsg]);


  const handleEmojiClick = (emojiData, event) => {
    setText(text + emojiData.emoji);

  }

  // VERIFICAR SE O NAVEGADOR SUPORTA A API E SE EXISTE A API  
  let recognition = null;
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (SpeechRecognition !== undefined) {
  
    // SE EXISTIR INSTANCIA E SALVA NA VARIAVEL
    recognition = new SpeechRecognition();
  }

  const handleMicClick = () => {
    if (recognition !== null) {
      recognition.onstart = () => {
        setListening(true);
      }

      recognition.onend = () => {
        setListening(false);
      }

      recognition.onresult = (e) => {
        setText(e.results[0][0].transcript);
      }

      recognition.start();
    }
  }

  const handleInput = (e) => {
    if (e.keyCode == 13) {
      handleSendClick();
    }
  }

  const handleSendClick = () => {
    if (text !== '') {
      Api.sendMessage(data, user.id, 'text', text, users);
      
      setText('');
      setEmojiOpen(false);
    }
  }

  return (
    <div className="chatWindow">

      

      <div className="chatWindow-header">

        <div className="chatWindow-headerInfo">
          <img className="chatWindow-avatar" src={data.image} alt="" />
          <div className="chatWindow-name">{data.title}</div>
        </div>
        <div className="chatWindow-headerbuttons">
          <div className="chatWindow-btn">
            <SearchIcon style={{ color: '#919191' }} />
          </div>
          <div className="chatWindow-btn">
            <AttachFileIcon style={{ color: '#919191' }} />
          </div>
          <div className="chatWindow-btn">
            <MoreVertIcon style={{ color: '#919191' }} />
          </div>
        </div>

      </div>

      <div ref={body} className="chatWindow-body">

        {listMsg.map((item, key) => (
          <MsgItem
            key={key}
            data={item}
            user={user}
          />
        ))}

      </div>

      <div
        style={{ height: emojiOpen ? '300px' : '0px' }}
        class="chatWindow-emojiArea">
        <EmojiPicker
          style={{ width: 'auto' }}

          onEmojiClick={handleEmojiClick}
          searchDisabled={true}
          skinTonesDisabled={true}
        />
      </div>

      <div className="chatWindow-footer">
        <div class="chatWindow--pre">

          <div
            style={{ width: emojiOpen ? 40 : 0 }}
            onClick={() => setEmojiOpen(false)}
            class="chatWindow-btn">

            <CloseIcon style={{ color: '#919191' }} />
          </div>

          <div
            onClick={() => setEmojiOpen(true)}
            className="chatWindow-btn">
            <InsertEmoticonIcon style={{ color: emojiOpen ? '#009688' : '#919191' }} />
          </div>

        </div>

        <div class="chatWindow--inputArea">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyUp={handleInput}
            placeholder='Digite uma mensagem'
            className='chatWindow--input' type="text" />
        </div>

        <div class="chatWindow--pos">

          {text === '' &&
            <div
              onClick={handleMicClick}
              className="chatWindow-btn">
              <MicIcon style={{ color: listening ? '#126ECE' : '#919191' }} />
            </div>
          }
          {text !== '' &&
            <div
              onClick={handleSendClick}
              className="chatWindow-btn">
              <SendIcon style={{ color: '#919191' }} />
            </div>
          }

        </div>
      </div>
    </div>
  )
}