import React from 'react'
import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";

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
export default AuthContext


export const AuthProvider = ({children}) =>{

    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let[auth, setAuth] = useState(false)
    let [loading, setLoading] = useState(true)


    let userLogin = async(e)=>{
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({'username':e.target.username.value, 'password': e.target.password.value})
        })

        let data = await response.json()
        console.log(data)
        if (response.status ===200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            setAuth(true)
        }else{
            alert("Something went wrong")
        }
    }

    let userLogout = ()=>{
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        setAuth(false)
    }

    let updateToken = async()=>{
        console.log("update token working")
        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
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
        updateToken: updateToken,
        userLogout: userLogout,
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