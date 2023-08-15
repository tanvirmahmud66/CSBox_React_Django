import React from 'react'

const Month = () => {
  return (
    <div className='d-flex justify-content-start align-items-center'>
        <div className='month bg-text'>October, 2023</div>
        <div className='d-flex align-items-center divide'>
            <div className='circle bg-custom-light-dark'></div>
            <div className='line bg-custom-light-dark'></div>
        </div>
    </div>
  )
}

export default Month