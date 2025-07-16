import firebaseConfig from './firebaseconfig';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, setDoc, collection, getDocs, updateDoc, addDoc, arrayUnion, query, where } from 'firebase/firestore';
import { onSnapshot, doc, getDoc } from 'firebase/firestore';

// INICIALIZA O APP
const app = initializeApp(firebaseConfig);

// INICIALIZA OS SERVIÇOS
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider };

export default {
    // FUNÇAO PARA ADICIONAR USUARIO NO BANCO DE DADOS
    addUser: async (user) => {
        await setDoc(
            doc(db, 'users', user.id),
            {
                name: user.name,
                avatar: user.avatar
            },
            { merge: true }
        );
    },
    getContactList: async (userId) => {
        const list = [];

        // FAÇO REQUISIÇÃO NO BANCO DE DADOS DA COLLECTION USERS 
        let usersRef = collection(db, 'users');
        let results = await getDocs(usersRef);

        // VERIFICO TODOS USERS DA COLLECTION E PEGO SOMENTE OS USERS !== DO MEU ID
        results.forEach(doc => {

            let data = doc.data();

            if (doc.id !== userId) {
                list.push({
                    id: doc.id,
                    name: data.name,
                    avatar: data.avatar
                });
            }

        });

        // RETORNO A LISTA SOMENTE COM OS USUARIOS DIFENTES DO MEU ID
        return list;
    },

    addNewChat: async (user, user2) => {


        // VERIFICAR SE JÁ EXISTER CHATS ABERTOS
        const chatExists = async (userId1, userId2) => {
            const q = query(
                collection(db, 'chats'),
                where('users', 'array-contains', userId1)
            );

            const snapshot = await getDocs(q);

            for (let docSnap of snapshot.docs) {
                const data = docSnap.data();
                if (data.users.includes(userId2)) {
                    return docSnap.id; // já existe chat
                }
            }

            return null; // não existe
        };

        const existingChatId = await chatExists(user.id, user2.id);

        if (existingChatId) {

            return;
        }

        let newChat = await addDoc(collection(db, 'chats'), {
            messages: [],
            users: [user.id, user2.id]
        });

        updateDoc(doc(db, 'users', user.id), {
            chats: arrayUnion({
                chatId: newChat.id,
                title: user2.name,
                image: user2.avatar,
                with: user2.id
            })
        });

        updateDoc(doc(db, 'users', user2.id), {
            chats: arrayUnion({
                chatId: newChat.id,
                title: user.name,
                image: user.avatar,
                with: user.id
            })
        });

    },

    onChatList: (userId, setChatList) => {

        const userDocRef = doc(db, 'users', userId);

        return onSnapshot(userDocRef, (doc) => {

            if (doc.exists()) {

                const data = doc.data();

                if (data.chats) {
                    let chat = [...data.chats];

                    chat.sort((a, b) => {
                        if (a.lastMessageDate === undefined) {
                            return -1;
                        }

                        if (b.lastMessageDate === undefined) {
                            return 1;
                        }

                        if (a.lastMessageDate < b.lastMessageDate) {
                            return 1;
                        } else {
                            return -1;
                        }
                    })
                    setChatList(data.chats);
                }
            }
        });
    },

    onChatContent: (chatId, setListMsg, setUsers) => {

        const userDocRef = doc(db, 'chats', chatId);

        return onSnapshot(userDocRef, (doc) => {

            if (doc.exists()) {

                let data = doc.data();

                if (data.messages) {
                    setListMsg(data.messages);
                    setUsers(data.users);
                }
            }
        });
    },

    sendMessage: async (chatData, userId, type, body, users) => {
        let now = new Date();

        const chatRef = doc(db, 'chats', chatData.chatId);

        updateDoc(chatRef, {
            messages: arrayUnion({
                type,
                author: userId,
                body,
                date: now
            })
        });

        
        for (let i in users) {
            const userRef = doc(db, 'users', users[i]);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                let uData = userSnap.data();

                if (uData.chats) {
                    let chats = [...uData.chats];

                    for (let j in chats) {
                        if (chats[j].chatId === chatData.chatId) {
                            chats[j].lastMessage = body;
                            chats[j].lastMessageDate = now;
                        }
                    }

                    // Atualiza os dados no Firestore
                    await updateDoc(userRef, { chats });
                }
            }
        }


    }


};


