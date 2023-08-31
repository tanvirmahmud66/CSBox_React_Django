import React, { useContext, useEffect, useState } from 'react'
import defaultPic from '../../assets/defaultPic.jpeg'
import { useParams } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import ProfileChangePop from './ProfileChangePop'

const ProfilePage = () => {

    const {id} = useParams()
    const{user,authTokens} = useContext(AuthContext)
    const [profile, setProfile] = useState()
    const [editProfile, setEditProfile] = useState(false)
    const [isOpen, setIsOpen] = useState(false);

    const[profilePictrue, setProfilePictrue] = useState()
    const[bio, setBio] = useState('')
    const[profession, setProfession] = useState('')
    const[gender, setGender] = useState('')
    const[work, setWrok] = useState('')
    const[university, setUniversity] = useState('')
    const[college, setCollege] = useState('')
    const[school, setSchool] = useState('')
    const[linkedIn, setLinkedIn] = useState('')
    const[github, setGithub] = useState('')
    const[website, setWebsite] = useState('')

    let getProfile = async()=>{
        let response = await fetch(`http://127.0.0.1:8000/api/profile/${id}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(authTokens?.access)
            }
        })
        let data = await response.json()
        // console.log(data)
        if (response.status===200){
            const baseUrl = 'http://127.0.0.1:8000';
            setProfile(data)
            setProfilePictrue(baseUrl+data.profile_pic)
            setBio(data.bio)
            setProfession(data.profession)
            setGender(data.gender)
            setWrok(data.work_at)
            setUniversity(data.study_at)
            setCollege(data.college)
            setSchool(data.school)
            setLinkedIn(data.linkedIn)
            setGithub(data.github)
            setWebsite(data.website)
        }
    }

    

    let bioChange =(event)=>{
        setBio(event.target.value)
    }
    let professionChange =(event)=>{
        setProfession(event.target.value)
    }
    let genderChange =(event)=>{
        setGender(event.target.value)
    }
    let workChange =(event)=>{
        setWrok(event.target.value)
    }
    let universityChange =(event)=>{
        setUniversity(event.target.value)
    }
    let collegeChange =(event)=>{
        setCollege(event.target.value)
    }
    let schoolChange =(event)=>{
        setSchool(event.target.value)
    }
    let linkedInChange =(event)=>{
        setLinkedIn(event.target.value)
    }
    let githubChange =(event)=>{
        setGithub(event.target.value)
    }
    let websiteChange =(event)=>{
        setWebsite(event.target.value)
    }

    let editProfileApi = async(e)=>{
        e.preventDefault()
        let response = await fetch(`http://127.0.0.1:8000/api/profile/${id}/`,{
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(authTokens?.access)
            },
            body: JSON.stringify({
                user: user.user_id,
                bio: bio,
                profession: profession,
                gender: gender,
                work_at: work,
                study_at: university,
                college: college,
                school: school,
                linkedIn: linkedIn,
                github: github,
                website: website
            })
        })

        let data = await response.json()
        if (response.status===200){
            getProfile()
            setEditProfile(false)
        }
    }

    useEffect(()=>{
        getProfile()
    },[])


    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    

  return (
    <>
    {!editProfile?
    <div className='row mt-4'>
        {profile &&
        <>
        <div className='col-3 p-0'>
            <div className='d-flex rounded bg-custom-light-dark flex-column justify-content-center align-items-center p-3'>
                <div className='profile-avatar '>
                    <img src={profilePictrue} alt='profile pic position-relative'/>
                    {(user.user_id===profile.user.id) &&
                    <div className="change-button">
                        <button onClick={openModal} className="btn text-green">Change</button>
                    </div>}
                </div>
                <h3 className='mt-2'>{profile.user.first_name} {profile.user.last_name}</h3>
                <p className='mt-1'>{profile.bio}</p>
                {(user.user_id===profile.user.id) &&
                <button onClick={()=> setEditProfile(!editProfile)} className='btn btn-custom2-green'>Edit Profile</button>}
            </div>
            {/* <div className='d-flex rounded mt-3 flex-column justify-content-center align-items-center bg-custom-light-dark p-3'>
                Expertise In
            </div> */}
        </div>

        <div className='col-9 p-0'>
            <div className='ms-4 align-items-center rounded bg-custom-light-dark p-3'>
                <div className='p-2 mb-2 text-center'>Basic Information</div>

                {profile.profession &&
                <div className='d-flex justify-content-start align-items-center row mb-3'>
                    <div className='col-3 fs-5 '>Profession:</div>
                    <div className='col-9 value-div bg-custom-dark p-2'>
                        <div className='text-green'>{profile.profession}</div>
                    </div>
                </div>}

                {profile.gender &&
                <div className='d-flex justify-content-between align-items-center row mb-3'>
                    <div className='col-3 fs-5 '>Gender</div>
                    <div className='col-9 value-div bg-custom-dark'>
                        <div className='text-green'>{profile.gender}</div>
                    </div>
                </div>}

                {profile.work_at &&
                <div className='d-flex justify-content-between align-items-center row mb-3'>
                    <div className='col-3 fs-5 '>Currently Working:</div>
                    <div className='col-9 value-div bg-custom-dark'>
                        <div className='text-green'>{profile.work_at}</div>
                    </div>
                </div>}

                {profile.study_at &&
                <div className='d-flex justify-content-between align-items-center row mb-3'>
                    <div className='col-3 fs-5 '>University: </div>
                    <div className='col-9 value-div bg-custom-dark'>
                        <div className='text-green'>{profile.study_at}</div>
                    </div>
                </div>}
                
                {profile.college && 
                <div className='d-flex justify-content-between align-items-center row mb-3'>
                    <div className='col-3 fs-5 '>College: </div>
                    <div className='col-9 value-div bg-custom-dark'>
                        <div className='text-green'>{profile.college}</div>
                    </div>
                </div>}

                {profile.school &&
                <div className='d-flex justify-content-between align-items-center row mb-3'>
                    <div className='col-3 fs-5 '>School:</div>
                    <div className='col-9 value-div bg-custom-dark p-2'>
                        <div className='text-green'>{profile.school}</div>
                    </div>
                </div>}

                {profile.user.email &&
                <div className='d-flex justify-content-between align-items-center row mb-3'>
                    <div className='col-3 fs-5'>Email</div>
                    <div className='col-9 value-div bg-custom-dark'>
                        <div className='text-primary'>{profile.user.email}</div>
                    </div>
                </div>}

                {profile.linkedIn && 
                <div className='d-flex justify-content-between align-items-center row mb-3'>
                    <div className='col-3 fs-5'>LinkedIn:</div>
                    <div className='col-9 value-div bg-custom-dark'>
                        <div className='text-primary'>
                            <a href={profile.linkedIn} target='_blank'>
                                {profile.linkedIn}
                            </a>
                        </div>
                    </div>
                </div>}

                {profile.github &&
                <div className='d-flex justify-content-between align-items-center row mb-3'>
                    <div className='col-3 fs-5 '>Github: </div>
                    <div className='col-9 value-div bg-custom-dark'>
                        <div className='text-primary'>
                            <a href={profile.github} target='_blank'>
                                {profile.github}
                            </a>
                        </div>
                    </div>
                </div>}

                {profile.website &&
                <div className='d-flex justify-content-between align-items-center row mb-3'>
                    <div className='col-3 fs-5'>Website: </div>
                    <div className='col-9 value-div bg-custom-dark'>
                        <div className='text-primary'>
                            <a href={profile.website} target='_blank'>
                                {profile.website}
                            </a>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
        </>}
    </div>:
    <div className='mt-3'>
        <div className='card p-3'>
            <form onSubmit={editProfileApi}>
                <div className='row'>
                    <div className='col'>
                        <div className='form-group mb-3'>
                            <label htmlFor="bio" className="form-label">Bio</label>
                            <input className="form-control" type="text" name='bio' id="bio" value={bio} onChange={bioChange}/>
                        </div>
                        <div className='form-group mb-3'>
                            <label htmlFor="profession" className="form-label">Profession</label>
                            <input className="form-control" type="text" name='profession' id="profession" value={profession} onChange={professionChange}/>
                        </div>
                        <div className='form-group mb-3'>
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <input className="form-control" type="text" name='gender' id="gender" value={gender} onChange={genderChange}/>
                        </div>
                        <div className='form-group mb-3'>
                            <label htmlFor="working" className="form-label">Currently Working</label>
                            <input className="form-control" type="text" name='working' id="working" value={work} onChange={workChange}/>
                        </div>
                        <div className='form-group mb-3'>
                            <label htmlFor="university" className="form-label">University</label>
                            <input className="form-control" type="text" name='university' id="university" value={university} onChange={universityChange}/>
                        </div>
                    </div>
                    <div className='col'>
                        <div className='form-group mb-3'>
                            <label htmlFor="college" className="form-label">College</label>
                            <input className="form-control" type="text" name='college' id="college" value={college} onChange={collegeChange}/>
                        </div>
                        <div className='form-group mb-3'>
                            <label htmlFor="school" className="form-label">School</label>
                            <input className="form-control" type="text" name='school' id="school" value={school} onChange={schoolChange}/>
                        </div>
                        <div className='form-group mb-3'>
                            <label htmlFor="linkedin" className="form-label">LinkedIn Profile Link</label>
                            <input className="form-control" type="text" name='linkedin' id="linkedin" value={linkedIn} onChange={linkedInChange}/>
                        </div>
                        <div className='form-group mb-3'>
                            <label htmlFor="github" className="form-label">Github Profile Link</label>
                            <input className="form-control" type="text" name='github' id="github" value={github} onChange={githubChange}/>
                        </div>
                        <div className='form-group mb-3'>
                            <label htmlFor="website" className="form-label">Website Link</label>
                            <input className="form-control" type="text" name='website' id="website" value={website} onChange={websiteChange}/>
                        </div>
                    </div>
                </div>
                <div className='btn-custom-group'>
                    <button onClick={()=>setEditProfile(!editProfile)} className='btn btn-custom-danger'>Cancel</button>
                    <button type='submit' className='btn btn-custom-green'>Save</button>
                </div>
            </form>
        </div>
    </div>}

        <ProfileChangePop isOpen={isOpen} onRequestClose={closeModal} profileID={id} getProfile={getProfile}/>
    </>
  )
}

export default ProfilePage