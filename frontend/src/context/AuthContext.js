import React from 'react'
import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import BaseUrl from '../Components/BaseUrl';

// ======================================= context Demo
// const AuthContext = createContext()
// export default AuthContext;

// export const AuthProvider = ({children}) =>{
//     return (
//         <AuthContext.Provider>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// ====================================== Main AuthContext
const AuthContext = createContext()
export default AuthContext;


export const AuthProvider = ({children}) =>{

    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    const [userProfile, setUserProfile] = useState()
    const [userProfilePic, setUserProfilePic] = useState()
    let[auth, setAuth] = useState(false)
    let [loading, setLoading] = useState(true)
    let [loginError, setLoginError] = useState({})


    let userLogin = async(e)=>{
        e.preventDefault()
        let response = await fetch(`${BaseUrl.baseUrl}/api/token/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({'username':e.target.username.value, 'password': e.target.password.value})
        })

        let data = await response.json()
        console.log(response.status)
        if (response.status ===200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            getUserProfile()
            setAuth(true)
        }else{
            setLoginError({
                error: true,
                status: response.status,
                text: response.statusText
            })
            if(data.non_field_errors){
                setLoginError({
                    error: true,
                    status: "NOT VERIFIED",
                    text: "Please verify your account with provided email address."
                })
            }
        }
    }

    let getUserProfile = async()=>{
        if(user){
            let response = await fetch(`${BaseUrl.baseUrl}/api/profile/${user.user_id}/`,{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ String(authTokens?.access)
                }
            })
            let data = await response.json()
            // console.log(data)
            if (response.status===200){
                setUserProfile(data)
                setUserProfilePic(BaseUrl.baseUrl+data.profile_pic)
            }
        }

    }

    let userLogout = ()=>{
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        setAuth(false)
        setLoginError({})
    }

    let updateToken = async()=>{
        // console.log("update token working")
        let response = await fetch(`${BaseUrl.baseUrl}/api/token/refresh/`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'refresh':authTokens?.refresh})
            
        })
        let data = await response.json()
        // console.log(data.access)
        // console.log(response)
        if (response.status=== 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            userLogout()
        }

        if (loading){
            setLoading(false)
        }
    }

    // console.log(user)
    let contextData = {
        user:user,
        auth: auth,
        authTokens: authTokens,
        userLogin:userLogin,
        loginError: loginError,
        updateToken: updateToken,
        userLogout: userLogout,
        userProfile:userProfile,
        userProfilePic:userProfilePic
    }

    useEffect(()=>{
        if (loading){
            updateToken()
        }
        let fourMin = 1000*60*4
        let interval = setInterval(() => {
            if (authTokens){
                updateToken()
            }
        },fourMin);
        return ()=> clearInterval(interval)
    }, [authTokens, loading])


    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}