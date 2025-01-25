import React from 'react'
import { Spinner } from './Spinner'

const LoadingSate = () => {
  return (
    <div className='w-100 h-[100vh] flex justify-center items-center'>
        <Spinner size={"large"}  />
    </div>
  )
}

export default LoadingSate