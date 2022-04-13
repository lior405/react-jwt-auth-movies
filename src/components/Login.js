import {Button, Callout, FormGroup, InputGroup} from '@blueprintjs/core';
import React, {useContext, useState} from 'react';
import { UserContext } from './UserContext';

const Login = () => {
    const [isSubmitting , setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userContext, setUserContext] = useContext(UserContext);

    const formSubmittingHandler = e => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const genericErrorMessage = "Something went wrong! Please try again later."

        fetch(process.env.REACT_APP_API_ENDPOINT + "users/login", {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: email, password}),
        })
        .then( async response => {
            setIsSubmitting(false)
            if(!response.ok) {
                if(response.status === 400) {
                    setError("Please fill all the fields correctly!");
                } else if(response.status === 401) {
                    setError("Invalid Email and password combination.");
                }else {
                    setError(genericErrorMessage);
                }
            } else {
                const data = await response.json();
                setUserContext(oldValue => {
                    return {...oldValue, token: data.token}
                })
            }
        })
        .catch(error => {
            setIsSubmitting(false);
            setError(genericErrorMessage);
        })
    }

    return (
        <>
            {error && <Callout intent='danger'>{error}</Callout>}
            <form className="auth-form" onSubmit={formSubmittingHandler}>
                <FormGroup label="Email" labelFor="email">
                    <InputGroup 
                        id='email'
                        placeholder='Email'
                        type='email'
                        value={email}
                        onChange={e=> setEmail(e.target.value)} 
                    />
                </FormGroup>
                <FormGroup label='Password' labelFor='password'>
                    <InputGroup 
                    id='password'
                    placeholder='Password'
                    type='password'
                    value={password}
                    onChange={e=> setPassword(e.target.value)}
                    />
                </FormGroup>
                <Button 
                    intent='primary' 
                    disabled={isSubmitting}
                    text={`${isSubmitting ? "Signing In" : "Sign In"}`}
                    fill 
                    type='submit' 
                />
            </form>
        </>
    )
}

export default Login;