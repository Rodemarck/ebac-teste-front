import React, { useEffect, useState } from 'react';
import api from '../api'
import { loginSuccess } from '../store/reducers/auth';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { fetchTasks } from '../store/reducers/task';
import { useAppDispatch, useAppSelector } from '../store/hooksTipados';
export const LoginPage = () => {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => state.task.items);

    const [myEmail, setEmail] = useState('');
    const [myPassword, setPassword] = useState('');


    useEffect(() => {
        dispatch(fetchTasks())
        console.log(tasks)
    }, [dispatch])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/login', { email: myEmail, password: myPassword });
            console.log('Login bem-sucedido:', response.data);
            const { accessToken } = response.data;
            dispatch(loginSuccess({ token: accessToken }));

            window.location.href = '/'

        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail</label>
            <input type="email" name="email" id="email" value={myEmail} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" value={myPassword} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Logar</button>
        </form>
    );
}