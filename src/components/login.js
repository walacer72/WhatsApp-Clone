import './login.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Api';

export const Login = ({onReceive}) => {

    const handleGoogleLogin = async () => {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        if (result) {
            onReceive(user);            
        } else {
            alert('Erro!');
        }
    }

    return (
        <div class="login">
            <button 
            onClick={handleGoogleLogin}
            className='login-button'>Logar com sua conta Google</button>
        </div>
    )
}