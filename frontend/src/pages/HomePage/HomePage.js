import React, {useState, useEffect, useContext} from 'react'
import CustomModal from '../../Components/Modal/Modal';
import AuthContext from '../../context/AuthContext';
import Session from '../../Components/Homepage/Session';
import CreateSession,{EmptySession} from '../../Components/Homepage/EmptySession';



const HomePage = () => {

  const {updateToken, authTokens} = useContext(AuthContext);

  const[session, setSession] = useState([]);
  const[sessionJoin, setSessionJoin] = useState([]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  
  let [notificaiton, setNotification] = useState(null)
  let [joinNotify, setJoinedNotify] = useState(null)

  let getSession = async()=>{
    let response = await fetch('http://127.0.0.1:8000/api/new-session/',{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+ String(authTokens?.access)
      },
    })
    let data = await response.json()
    console.log(response.status)
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
    e.target.token.value = '';

    if(response.status !==200){
      setNotification(response.statusText)
    }else{
      setJoinedNotify("Created")
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


  return (
    <>
      <div className={`row d-flex justify-content-between align-items-center sticky-element  ${isSticky ? 'sticky-background' : ''}`}>
        <div className='col-lg-6 col-xl-5 d-flex justify-content-start align-items-center mt-3'>
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
        </div>
        <button className='col-lg-2 col-xl-1 btn btn-custom2-danger mt-3'>Settings</button>
      </div>

      <div className='mt-4 mb-5'>
        <div className="container">
            <div className="row">
                <div className='col'>
                  <h4 className='text-violet'>Created</h4>
                  <div className='scroll-container overflow-scroll'>
                    <div className='row'>
                      {session && session.map((each)=>{return (<Session key={each.id} session={each}/>)})}
                      {session.length===0 && <CreateSession/>}
                    </div>
                  </div>
                </div>
                <div className='col'>
                  <h4 className='text-blue'>Joined</h4>
                  <div className='col scroll-container overflow-scroll'>
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

      <CustomModal isOpen={isOpen} onRequestClose={closeModal} />
    </>
  )
}

export default HomePage