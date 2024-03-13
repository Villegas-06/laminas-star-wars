import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/register.css';
import Swal from 'sweetalert2';
import usersData from '../../data/users.json';

const Register: React.FC = () => {
    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleUsernameInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }

  const handleGenderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !email.trim()) {
      setError('Por favor ingresa un correo electrónico');
      return;
    }

    if (!password || !password.trim()) {
      setError('Por favor ingresa una contraseña');
      return;
    }

    if (password.trim().length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    const userExists = usersData.users.find(
        (user) => user.username === username
    );

    if(userExists){
        setError('Este usuario ya está registrado, intenta con otro');
        return;
    }

    if(!username || !username.trim()){
        setError('Por favor ingresa un nombre de usuario');
        return;
    }

    if(!gender || !gender.trim()){
        setError("Elige un género");
        return;
    }

    const newUser = {
      username: username,
      email: email,
      password: password,
      gender: gender
    };
    
    // Add the new user to usersData array
    usersData.users.push(newUser)

    Swal.fire({
      icon: 'success',
      title: 'Registro Exitoso!',
      text: 'Tu cuenta ha sido creada exitosamente',
      confirmButtonText: 'Ok'
    });

    navigate('/');
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2 className="register-title">Regístrate</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group" id='register-email'>
            <label htmlFor="email">Correo electrónico:</label>
            <input
              type="email"
              id="email"
              value={email || ''}
              onChange={handleEmailInputChange}
              placeholder="correo@example.com"
            />
          </div>
          <div className="form-group" id='register-password'>
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password || ''}
              onChange={handlePasswordInputChange}
              placeholder="Contraseña"
            />
          </div>
          <div className="form-group" id='register-username'>
            <label htmlFor="username">Nombre de usuario:</label>
            <input 
                type="text" 
                id="username"
                value={username || ''}
                onChange={handleUsernameInputChange}
                placeholder='TheUnicReal'
            />
          </div>
          <div className="form-group" id='register-gender'>
            <label>Género:</label>
            <div className="radio-group">
              <input 
                  type="radio" 
                  id="male"
                  value="male"
                  checked={gender === 'male'}
                  onChange={handleGenderInputChange}
              />
              <label className="radio-label" htmlFor="male">Hombre</label>
              <input 
                  type="radio" 
                  id="female"
                  value="female"
                  checked={gender === 'female'}
                  onChange={handleGenderInputChange}
              />
              <label className="radio-label" htmlFor="female">Mujer</label>
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          <button className="register-submit" type="submit">Registrarse</button>
          <p className='login-account'>Ya tienes una cuenta? <Link to='/'>Inicia Sesión</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
