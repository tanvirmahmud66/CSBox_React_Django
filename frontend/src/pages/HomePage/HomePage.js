import React, {useState, useEffect, useContext} from 'react'
import CustomModal from '../../Components/Homepage/Modal';
import AuthContext from '../../context/AuthContext';
import Session from '../../Components/Homepage/Session';
import CreateSession,{EmptySession} from '../../Components/Homepage/EmptySession';
import SessionListItem from '../../Components/Homepage/SessionListItem';



const HomePage = () => {

  const {authTokens} = useContext(AuthContext);
  

  const[session, setSession] = useState([]);
  const[sessionJoin, setSessionJoin] = useState([]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  
  let [notificaiton, setNotification] = useState(null)
  let [joinNotify, setJoinedNotify] = useState(null)

  let [settings, setSettings] = useState(false)

  

  let getSession = async()=>{
    let response = await fetch('http://127.0.0.1:8000/api/new-session/',{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+ String(authTokens?.access)
      },
    })
    let data = await response.json()
    // console.log(data)
    if (response.status===200){
      setSession(data.data)
      setSessionJoin(data.join)
    }
    
  }

  let joinSession = async(e)=>{
    e.preventDefault()
    let response = await fetch('http://127.0.0.1:8000/api/join-session/',{
      method: 'POST',
      headers: {
        "Content-Type":"application/json",
        "Authorization": "Bearer " + String(authTokens.access)
      },
      body: JSON.stringify({
        "token": e.target.token.value
      })
    })
    let data = await response.json()
    console.log(data)
    e.target.token.value = '';

    if(response.status !==200){
      setNotification(response.statusText)
    }else{
      setJoinedNotify("Joining Accepted")
      getSession()
    } 
  }

  useEffect(()=>{
    setTimeout(()=>{
      setNotification(null)
      setJoinedNotify(null)
    }, 4000)
  }, [notificaiton, joinNotify])



  useEffect(()=>{
    getSession()
    // const interval = setInterval(() => {
    //   getSession()
    // }, 3000);
    // return ()=> clearInterval(interval)    
  }, [])

  

  useEffect(()=>{
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };



  // ============================= Settings

  const[createdSession, setCreatedSession] = useState(true)
  const[joinedSession, setJoinedSession] = useState(false)
  const[conversation, setConversation] = useState(false)
  const[profile, setProfile] = useState(false)
  const[account, setAccount] = useState(false)

  let setBtnHandle = (buttonName)=>{
    if (buttonName==='profile'){
      setProfile(true)
      setAccount(false)
      setConversation(false)
      setJoinedSession(false)
      setCreatedSession(false)
    }
    if (buttonName==='account'){
      setProfile(false)
      setAccount(true)
      setConversation(false)
      setJoinedSession(false)
      setCreatedSession(false)
      
    }
    if (buttonName==='conversation'){
      setProfile(false)
      setAccount(false)
      setConversation(true)
      setJoinedSession(false)
      setCreatedSession(false)
    }
    if (buttonName==='joinedSession'){
      setProfile(false)
      setAccount(false)
      setConversation(false)
      setJoinedSession(true)
      setCreatedSession(false)
    }
    if(buttonName==='createdSession'){
      setProfile(false)
      setAccount(false)
      setConversation(false)
      setJoinedSession(false)
      setCreatedSession(true)
    }
  }


  return (
    <>
    <div className='d-none-991'>
      <div className={`row p-2 d-flex justify-content-between align-items-center sticky-element  ${isSticky ? 'sticky-background' : ''}`}>
        <div className='d-flex justify-content-between align-items-center'>
          {!settings && 
          <div className='d-flex justify-content-between align-items-center'>
            <div className='text-capitalize fs-5'>session :</div>
            <form className='d-flex ms-2 me-2' onSubmit={joinSession}>
              <div className='from-group '>
                <input type='text' name='token' className='form-control position-relative' id='token' placeholder='token' required></input>
                {notificaiton!==null &&
                  <div className="position-absolute pt-0 pb-0 ps-0 pe-0 top-1 text-danger start-2 p-3">
                    {notificaiton}
                  </div>
                }
                {joinNotify &&
                  <div className="position-absolute pt-0 pb-0 ps-0 pe-0 top-1 text-green start-2 p-3">
                    {joinNotify}
                  </div>
                }
              </div>
              <button type='submit' className='btn bg-primary text-white ms-2'>Join</button>
            </form>
            <button onClick={openModal} className='btn btn-custom2-green'>Create</button>
          </div>}
          <button onClick={(()=> setSettings(!settings))} className={`btn ${settings? 'btn-custom2-green':'btn-custom2-danger'}`}>{settings? "Back to Home":"Settings"}</button>
        </div>
      </div>
      
      {!settings && 
        <div className='mt-4 mb-5'>
          <div className="container">
              <div className="row">
                  <div className='col'>
                    <h4 className='text-violet'>Created</h4>
                    <div className='scroll-container'>
                      <div className='row'>
                        {session && session.map((each)=>{return (<Session key={each.id} session={each}/>)})}
                        {session.length===0 && <CreateSession/>}
                      </div>
                    </div>
                  </div>
                  <div className='col'>
                    <h4 className='text-blue'>Joined</h4>
                    <div className='col scroll-container'>
                      <div className='row'>
                        
                        {sessionJoin!==undefined? sessionJoin.map((each)=>{
                            return (
                              <Session key={each.id} session={each}/>
                            )
                          }): <EmptySession/>}
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
      }

      {settings && 
        <div className='mt-2 vh-80 row'>
          {/* =============================== operation button list */}
          <div className='col-3'>
            <div className='card fs-5 text-danger text-center p-2 mb-3'>Settings</div>
            <ul className="list-group">
              {/* <li onClick={()=>setBtnHandle("profile")} className={`mb-3 text-white btn ${profile?"btn-custom-green border-green":"btn-custom2-primary"}`}>Profile</li>
              <li onClick={()=>setBtnHandle("account")} className={`mb-3 text-white btn ${account?"btn-custom-green border-green":"btn-custom2-primary"}`}>Account</li>
              <li onClick={()=>setBtnHandle("conversation")} className={`mb-3 text-white btn ${conversation?"btn-custom-green border-green":"btn-custom2-primary"}`}>Conversation</li> */}
              <li onClick={()=>setBtnHandle("createdSession")} className={`mb-3 text-white btn ${createdSession?"btn-custom-green border-green":"btn-custom2-primary"}`}>Created Session</li>
              <li onClick={()=>setBtnHandle("joinedSession")} className={`mb-3 text-white btn ${joinedSession?"btn-custom-green border-green":"btn-custom2-primary"}`}>Joined Session</li>
            </ul>
          </div>

          {/* Created session settings section */}
          {createdSession &&
              <div className='col-9'>
                <div className='ms-2'>
                  {session && session.map((each)=>{return (<SessionListItem key={each.id} session={each} updateSession={getSession}/>)})}
                  {session.length===0 && <CreateSession/>}
                </div>
              </div>
          }

          {joinedSession &&
              <div className='col-9'>
                <div className='ms-2'>
                  {sessionJoin!==undefined?
                   sessionJoin.map((each)=>{return (<SessionListItem key={each.id} session={each} updateSession={getSession}/>)}):
                    <EmptySession/>
                  }
                </div>
              </div>
          }

          {conversation &&
            <div className='col-9'>
              <div className='ms-2'>
                Conversation settings
              </div>
            </div>
          }

          {profile &&
            <div className='col-9'>
              <div className='ms-2'>
                Profile settings
              </div>
            </div>
          }

          {account &&
            <div className='col-9'>
              <div className='ms-2'>
                Account settings
              </div>
            </div>
          }
          
        </div>
      }

    </div>
    <div className='responsive-div'>
      <div className='d-flex justify-content-between aling-items-center mt-2'>
            <form className='d-flex me-2' onSubmit={joinSession}>
              <div className='from-group '>
                <input type='text' name='token' className='form-control position-relative' id='token' placeholder='token' required></input>
                {notificaiton!==null &&
                  <div className="position-absolute pt-0 pb-0 ps-0 pe-0 top-1 text-danger start-2 p-3">
                    {notificaiton}
                  </div>
                }
                {joinNotify &&
                  <div className="position-absolute pt-0 pb-0 ps-0 pe-0 top-1 text-green start-2 p-3">
                    {joinNotify}
                  </div>
                }
              </div>
              <button type='submit' className='btn bg-primary text-white ms-2'>Join</button>
            </form>
            <button onClick={openModal} className='btn btn-custom2-green'>Create</button>
      </div>
      
      <div>
        <div className='mt-4 mb-4'>
          <h4 className='text-white text-center'>Created Session</h4>
            <div className=''>
              <div className=''>
                {session && session.map((each)=>{return (<Session key={each.id} session={each}/>)})}
                {session.length===0 && <CreateSession/>}
              </div>
            </div>
        </div>
      </div>

    </div>
      <CustomModal isOpen={isOpen} onRequestClose={closeModal} get={getSession} />
    </>
  )
}

export default HomePage