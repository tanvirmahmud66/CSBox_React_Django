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

import React, { useContext } from 'react'
import { createContext, useState, useEffect } from 'react'
import AuthContext from './AuthContext';
import BaseUrl from '../Components/BaseUrl';

const ProfileContext = createContext()
export default ProfileContext;

export const UserProfileProvider = ({children}) => {
    
    const {user, authTokens} = useContext(AuthContext)
    const [userProfile, setUserProfile] = useState()
    const [userProfilePic, setUserProfilePic] = useState()
   


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


    useEffect(()=>{
        getUserProfile()
    },[authTokens])


    let contextData={
        userProfile:userProfile,
        userProfilePic:userProfilePic
    }

    return (
        <ProfileContext.Provider value={contextData}>
            {children}
        </ProfileContext.Provider>
    )
}