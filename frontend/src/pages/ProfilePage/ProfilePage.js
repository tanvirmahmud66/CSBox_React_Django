import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import ProfileChangePop from './ProfileChangePop'
import BaseUrl from '../../Components/BaseUrl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import { faCheck ,faVenus, faMars, faBriefcase, faUniversity, faGraduationCap, faSchool, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';


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

    let [editBio, setEditBio] = useState(false)
    let [editprofession, setEditProfession] = useState(false)
    let [editWorkingAt, setEditWorkingAt] = useState(false)
    let [editGender, setEditGender] = useState(false)
    let [editUniversity, setEditUniversity] = useState(false)
    let [editCollege, setEditCollege] = useState(false)
    let [editSchool, setEditSchool] = useState(false)
    let [editLinkedIn, setEditLinkedIn] = useState(false)
    let [editGithub, setEditGithub] = useState(false)
    let [editWebsite, setEditWebsite] = useState(false)

    let [disable, setDisable] = useState(false)

    let getProfile = async()=>{
        let response = await fetch(`${BaseUrl.baseUrl}/api/profile/${id}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(authTokens?.access)
            }
        })
        let data = await response.json()
        // console.log(data)
        if (response.status===200){
            setProfile(data)
            setProfilePictrue(BaseUrl.baseUrl+data.profile_pic)
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
        let response = await fetch(`${BaseUrl.baseUrl}/api/profile/${id}/`,{
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

        // let data = await response.json()
        if (response.status===200){
            getProfile()
            setDisable(false)
            setEditProfession(false)
            setEditBio(false)
            setEditWorkingAt(false)
            setEditUniversity(false)
            setEditCollege(false)
            setEditSchool(false)
            setEditLinkedIn(false)
            setEditGithub(false)
            setEditWebsite(false)
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

    // =======================
    let editBioHandle=()=>{
        setEditBio(true)
        setDisable(true)
    }

    let editProfessionHandle=()=>{
        setEditProfession(true)
        setDisable(true)
    }

    let editGenderHandle=()=>{
        setEditGender(true)
        setDisable(true)
    }

    let editWorkingHandle = ()=>{
        setEditWorkingAt(true)
        setDisable(true)
    }

    let editUniversityHandle = ()=>{
        setEditUniversity(true)
        setDisable(true)
    }

    let editCollegeHandle = ()=>{
        setEditCollege(true)
        setDisable(true)
    }

    let editSchoolHandle = ()=>{
        setEditSchool(true)
        setDisable(true)
    }

    let editLinkedinHandle = ()=>{
        setEditLinkedIn(true)
        setDisable(true)
    }

    let editGithubHandle = ()=>{
        setEditGithub(true)
        setDisable(true)
    }

    let editWebsiteHandle = ()=>{
        setEditWebsite(true)
        setDisable(true)
    }





  return (
    <>
    {!editProfile?
    <div className='row '>
        {profile &&
        <>
            <div className='col-xxl-3 p-0 mt-4'>
                <div className='d-flex rounded flex-column justify-content-center align-items-center p-3'>
                    <div className='profile-avatar '>
                        <img src={profilePictrue} alt='profile pic position-relative'/>
                        {(user.user_id===profile.user.id) &&
                        <div className="change-button">
                            <button onClick={openModal} className="btn text-green">Change</button>
                        </div>}
                    </div>
                    <h3 className='mt-2 text-center'>{profile.user.first_name} {profile.user.last_name}</h3>
                    <p className='mt-1'>{profile.bio}</p>
                    {(user.user_id===profile.user.id) &&
                    <button onClick={()=> setEditProfile(!editProfile)} className='btn btn-custom2-green'><FontAwesomeIcon icon={faEdit}/> Edit Profile</button>}
                </div>
            </div>

            <div className='col-xxl-9 card mt-4'>
                <div className='pt-3 pb-3'>
                    {profile.profession &&
                    <div className='d-flex justify-content-start align-items-center row m-1'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faUserMd} /> Profession:</div>
                        <div className='col-md-9 value-div p-2'>
                            <div className='text-green'>{profile.profession}</div>
                        </div>
                    </div>}

                    {/* {profile.gender &&
                    <div className='d-flex justify-content-between align-items-center row m-1 mt-3'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faVenus} /> Gender</div>
                        <div className='col-md-9 value-div'>
                            <div className='text-green'>{profile.gender}</div>
                        </div>
                    </div>} */}

                    {profile.work_at &&
                    <div className='d-flex justify-content-between align-items-center row m-1 mt-3'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faBriefcase} /> Working At:</div>
                        <div className='col-md-9 value-div'>
                            <div className='text-green'>{profile.work_at}</div>
                        </div>
                    </div>}

                    {profile.study_at &&
                    <div className='d-flex justify-content-between align-items-center row m-1 mt-3'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faUniversity} /> University: </div>
                        <div className='col-md-9 value-div'>
                            <div className='text-green'>{profile.study_at}</div>
                        </div>
                    </div>}
                    
                    {profile.college && 
                    <div className='d-flex justify-content-between align-items-center row m-1 mt-3'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faGraduationCap} /> College: </div>
                        <div className='col-md-9 value-div'>
                            <div className='text-green'>{profile.college}</div>
                        </div>
                    </div>}

                    {profile.school &&
                    <div className='d-flex justify-content-between align-items-center row m-1 mt-3'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faSchool} /> School:</div>
                        <div className='col-md-9 value-div p-2'>
                            <div className='text-green'>{profile.school}</div>
                        </div>
                    </div>}

                    {profile.user.email &&
                    <div className='d-flex justify-content-between align-items-center row m-1 mt-3'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faEnvelope} /> Email</div>
                        <div className='col-md-9 value-div bg-white'>
                            <div className='text-primary'>{profile.user.email}</div>
                        </div>
                    </div>}

                    {profile.linkedIn && 
                    <div className='d-flex justify-content-between align-items-center row m-1 mt-3'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faGlobe} /> LinkedIn:</div>
                        <div className='col-md-9 value-div bg-white'>
                            <div className='text-primary'>
                                <a href={profile.linkedIn} target='_blank'>
                                    {profile.linkedIn}
                                </a>
                            </div>
                        </div>
                    </div>}

                    {profile.github &&
                    <div className='d-flex justify-content-between align-items-center row m-1 mt-3'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faGlobe} /> Github: </div>
                        <div className='col-md-9 value-div bg-white'>
                            <div className='text-primary'>
                                <a href={profile.github} target='_blank'>
                                    {profile.github}
                                </a>
                            </div>
                        </div>
                    </div>}

                    {profile.website &&
                    <div className='d-flex justify-content-between align-items-center row m-1 mt-3'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faGlobe} /> Website: </div>
                        <div className='col-md-9 value-div bg-white'>
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
    <div className='mt-3 mb-3'>
        <div className='card p-3'>
            <div className='card-title text-center'>Edit Profile</div>
            <div className='row'>
                <div className='col-xxl-6'>
                    
                    {/* Bio */}
                    <div className='d-flex justify-content-start align-items-center row m-1'>
                        <div className='col-md-3 fs-5 p-0'>Myself:</div>
                        {(profile.bio && !editBio )&&
                            <div className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between'>
                                <div className='text-green'>{profile.bio}</div>
                                {disable?
                                    <button onClick={editBioHandle} className='btn btn-secondary' disabled><FontAwesomeIcon icon={faEdit}/></button>:
                                    <button onClick={editBioHandle} className='btn btn-secondary'><FontAwesomeIcon icon={faEdit}/></button>
                                }
                            </div>
                        }

                        {(!profile.bio && !editBio)&&
                            <button onClick={editBioHandle} className='col-md-3 btn btn-custom-green'>Add</button>
                        }

                        {editBio &&
                            <form className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between' onSubmit={editProfileApi}>
                               <div className='form-group w-100'>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name='profession' 
                                        id="profession" 
                                        value={bio} 
                                        onChange={bioChange}
                                    />
                                </div>
                                <button type='submit' className='btn btn-custom-green ms-2'><FontAwesomeIcon icon={faCheck}/></button> 
                            </form>
                        }
                    </div>

                    {/* Profession */}
                    <div className='d-flex justify-content-start align-items-center row m-1 mt-4'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faUserMd} /> Profession:</div>
                        {(profile.profession && !editprofession )&&
                            <div className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between'>
                            <div className='text-green'>{profile.profession}</div>
                                {disable?
                                    <button onClick={editProfessionHandle} className='btn btn-secondary' disabled><FontAwesomeIcon icon={faEdit}/></button>:
                                    <button onClick={editProfessionHandle} className='btn btn-secondary'><FontAwesomeIcon icon={faEdit}/></button>
                                }
                            </div>
                        }

                        {(!profile.profession && !editprofession)&&
                            <button onClick={editProfessionHandle} className='col-md-3 btn btn-custom-green'>Add</button>
                        }

                        {editprofession &&
                            <form className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between' onSubmit={editProfileApi}>
                               <div className='form-group w-100'>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name='profession' 
                                        id="profession" 
                                        value={profession} 
                                        onChange={professionChange}
                                    />
                                </div>
                                <button type='submit' className='btn btn-custom-green ms-2'><FontAwesomeIcon icon={faCheck}/></button> 
                            </form>
                        }
                    </div>
                    
                    {/* working at */}
                    <div className='d-flex justify-content-start align-items-center row m-1 mt-4'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faBriefcase} /> Wroking At:</div>
                        {(profile.work_at && !editWorkingAt)&&
                            <div className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between'>
                                <div className='text-green'>{profile.work_at}</div>
                                {disable?
                                    <button onClick={editWorkingHandle} className='btn btn-secondary' disabled><FontAwesomeIcon icon={faEdit}/></button>:
                                    <button onClick={editWorkingHandle} className='btn btn-secondary'><FontAwesomeIcon icon={faEdit}/></button>
                                }
                            </div>
                        }

                        {(!profile.work_at && !editWorkingAt)&&
                            <button onClick={editWorkingHandle} className='col-md-3 btn btn-custom-green'>Add</button>
                        }

                        {editWorkingAt &&
                            <form className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between' onSubmit={editProfileApi}>
                               <div className='form-group w-100'>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name='profession' 
                                        id="profession" 
                                        value={work} 
                                        onChange={workChange}
                                    />
                                </div>
                                <button type='submit' className='btn btn-custom-green ms-2'><FontAwesomeIcon icon={faCheck}/></button> 
                            </form>
                        }
                    </div>

                    {/* University */}
                    <div className='d-flex justify-content-start align-items-center row m-1 mt-4'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faUniversity} /> University:</div>
                        {(profile.study_at && !editUniversity)&&
                            <div className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between'>
                                <div className='text-green'>{profile.study_at}</div>
                                {disable?
                                    <button onClick={editUniversityHandle} className='btn btn-secondary' disabled><FontAwesomeIcon icon={faEdit}/></button>:
                                    <button onClick={editUniversityHandle} className='btn btn-secondary'><FontAwesomeIcon icon={faEdit}/></button>
                                }
                            </div>
                        }

                        {(!profile.study_at && !editUniversity)&&
                            <button onClick={editUniversityHandle} className='col-md-3 btn btn-custom-green'>Add</button>
                        }

                        {editUniversity &&
                            <form className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between' onSubmit={editProfileApi}>
                               <div className='form-group w-100'>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name='profession' 
                                        id="profession" 
                                        value={university} 
                                        onChange={universityChange}
                                    />
                                </div>
                                <button type='submit' className='btn btn-custom-green ms-2'><FontAwesomeIcon icon={faCheck}/></button> 
                            </form>
                        }
                    </div>

                     {/* College */}
                     <div className='d-flex justify-content-start align-items-center row m-1 mt-4'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faGraduationCap} /> College:</div>
                        {(profile.college && !editCollege)&&
                            <div className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between'>
                                <div className='text-green'>{profile.college}</div>
                                {disable?
                                    <button onClick={editCollegeHandle} className='btn btn-secondary' disabled><FontAwesomeIcon icon={faEdit}/></button>:
                                    <button onClick={editCollegeHandle} className='btn btn-secondary'><FontAwesomeIcon icon={faEdit}/></button>
                                }
                            </div>
                        }

                        {(!profile.college && !editCollege)&&
                            <button onClick={editCollegeHandle} className='col-md-3 btn btn-custom-green'>Add</button>
                        }

                        {editCollege &&
                            <form className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between' onSubmit={editProfileApi}>
                               <div className='form-group w-100'>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name='profession' 
                                        id="profession" 
                                        value={college} 
                                        onChange={collegeChange}
                                    />
                                </div>
                                <button type='submit' className='btn btn-custom-green ms-2'><FontAwesomeIcon icon={faCheck}/></button> 
                            </form>
                        }
                    </div>

                </div>
                <div className='col-xxl-6'>
                     
                     {/* School */}
                     <div className='d-flex justify-content-start align-items-center row m-1'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faSchool} /> School:</div>
                        {(profile.school && !editSchool)&&
                            <div className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between'>
                                <div className='text-green'>{profile.school}</div>
                                {disable?
                                    <button onClick={editSchoolHandle} className='btn btn-secondary' disabled><FontAwesomeIcon icon={faEdit}/></button>:
                                    <button onClick={editSchoolHandle} className='btn btn-secondary'><FontAwesomeIcon icon={faEdit}/></button>
                                }
                            </div>
                        }

                        {(!profile.school && !editSchool)&&
                            <button onClick={editSchoolHandle} className='col-md-3 btn btn-custom-green'>Add</button>
                        }

                        {editSchool &&
                            <form className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between' onSubmit={editProfileApi}>
                               <div className='form-group w-100'>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name='profession' 
                                        id="profession" 
                                        value={school} 
                                        onChange={schoolChange}
                                    />
                                </div>
                                <button type='submit' className='btn btn-custom-green ms-2'><FontAwesomeIcon icon={faCheck}/></button> 
                            </form>
                        }
                    </div>

                    {/* LinkedIn */}
                    <div className='d-flex justify-content-start align-items-center row m-1 mt-4'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faGlobe} /> LinkedIn:</div>
                        {(profile.linkedIn && !editLinkedIn)&&
                            <div className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between'>
                                <div className='text-green'>{profile.linkedIn}</div>
                                {disable?
                                    <button onClick={editLinkedinHandle} className='btn btn-secondary' disabled><FontAwesomeIcon icon={faEdit}/></button>:
                                    <button onClick={editLinkedinHandle} className='btn btn-secondary'><FontAwesomeIcon icon={faEdit}/></button>
                                }
                            </div>
                        }

                        {(!profile.linkedIn && !editLinkedIn)&&
                            <button onClick={editLinkedinHandle} className='col-md-3 btn btn-custom-green'>Add</button>
                        }

                        {editLinkedIn &&
                            <form className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between' onSubmit={editProfileApi}>
                               <div className='form-group w-100'>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name='profession' 
                                        id="profession" 
                                        value={linkedIn} 
                                        onChange={linkedInChange}
                                    />
                                </div>
                                <button type='submit' className='btn btn-custom-green ms-2'><FontAwesomeIcon icon={faCheck}/></button> 
                            </form>
                        }
                    </div>

                    {/* Github */}
                    <div className='d-flex justify-content-start align-items-center row m-1 mt-4'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faGlobe} /> GitHub:</div>
                        {(profile.github && !editGithub)&&
                            <div className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between'>
                                <div className='text-green'>{profile.github}</div>
                                {disable?
                                    <button onClick={editGithubHandle} className='btn btn-secondary' disabled><FontAwesomeIcon icon={faEdit}/></button>:
                                    <button onClick={editGithubHandle} className='btn btn-secondary'><FontAwesomeIcon icon={faEdit}/></button>
                                }
                            </div>
                        }

                        {(!profile.github && !editGithub)&&
                            <button onClick={editGithubHandle} className='col-md-3 btn btn-custom-green'>Add</button>
                        }

                        {editGithub &&
                            <form className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between' onSubmit={editProfileApi}>
                               <div className='form-group w-100'>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name='profession' 
                                        id="profession" 
                                        value={github} 
                                        onChange={githubChange}
                                    />
                                </div>
                                <button type='submit' className='btn btn-custom-green ms-2'><FontAwesomeIcon icon={faCheck}/></button> 
                            </form>
                        }
                    </div>

                    {/* website */}
                    <div className='d-flex justify-content-start align-items-center row m-1 mt-4'>
                        <div className='col-md-3 fs-5 p-0'><FontAwesomeIcon icon={faGlobe} /> Website:</div>
                        
                        {(profile.website && !editWebsite)&&
                            <div className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between'>
                                <div className='text-green'>{profile.website}</div>
                                {disable?
                                    <button onClick={editWebsiteHandle} className='btn btn-secondary' disabled><FontAwesomeIcon icon={faEdit}/></button>:
                                    <button onClick={editWebsiteHandle} className='btn btn-secondary'><FontAwesomeIcon icon={faEdit}/></button>
                                }
                            </div>
                        }

                        {(!profile.website && !editWebsite)&&
                            <button onClick={editWebsiteHandle} className='col-md-3 btn btn-custom-green'>Add</button>
                        }

                        {editWebsite &&
                            <form className='col-md-9 value-div p-2 d-flex align-items-center justify-content-between' onSubmit={editProfileApi}>
                               <div className='form-group w-100'>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name='profession' 
                                        id="profession" 
                                        value={website} 
                                        onChange={websiteChange}
                                    />
                                </div>
                                <button type='submit' className='btn btn-custom-green ms-2'><FontAwesomeIcon icon={faCheck}/></button> 
                            </form>
                        }
                    </div>

                </div> 
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <button onClick={()=>setEditProfile(!editProfile)} className='btn btn-custom-danger'>Close</button>
            </div>
        </div>
    </div>}

        <ProfileChangePop isOpen={isOpen} onRequestClose={closeModal} profileID={id} getProfile={getProfile}/>
    </>
  )
}

export default ProfilePage