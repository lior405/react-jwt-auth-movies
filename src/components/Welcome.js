import React, { useCallback, useContext, useEffect } from 'react';
import Loader from '../Loader';
import {UserContext} from './UserContext';
import Movies from './Movies';


const Welcome = ()=> {

    const [userContext, setUserContext] = useContext(UserContext);

    const fetchUserDetails = useCallback(()=> {
        fetch(process.env.REACT_APP_API_ENDPOINT + "users/me" , {
            method: "GET",
            credentials: "include",
            //pass authentication token as bearer token in header
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
        }).then(async response=> {
            if(response.ok) {
                const data = await response.json()
                setUserContext(oldValue=> {
                    return {...oldValue, details: data};
                })
            }else {
                if(response.status === 401) {
                    //Edge case: when the token has expired.
                    //this could happen if the refreshToken calls have failed due to network error or
                    //User has had the tab open from previous day and tries to click on the fetch button
                    window.location.reload();
                } else {
                    setUserContext( oldValue => {
                        return {...oldValue, details: null}
                    })
                }
            }
        })
    }, [setUserContext, userContext.token])

    useEffect(()=> {
        //fetch only when user details are not present
        if(!userContext.details) {
            fetchUserDetails()
        }
    }, [userContext.details, fetchUserDetails])

    const logoutHandler = ()=> {
        fetch(process.env.REACT_APP_API_ENDPOINT + "users/logout",{
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
                },
        }).then(async response => {
            setUserContext(oldValue => {
                return {...oldValue, details: undefined, token: null}
            })
            window.localStorage.setItem("logout", Date.now())
        })
    }

    const refetchHandler = () => {
        //set deatails to undefined to diplay spinner and
        //fetchUserDetails will be invoked from useEffect
        setUserContext(oldValue => {
            return {...oldValue, details: undefined}
        })
    }

    return userContext.details === null ? (
        "Error Loading User details"
    ) : !userContext.details ? (
        <Loader />
    ) : ( <div>
            <Movies
                logoutHandler= {logoutHandler}
                refetchHandler={refetchHandler} 
            />
        </div>
    )
}

export default Welcome