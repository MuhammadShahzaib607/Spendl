import React from 'react'
import { Outlet } from 'react-router-dom'
import AuthModal from '../components/AuthModal'

const AuthRoute = () => {
    const token = sessionStorage.getItem("isAdmin")
  return (
    <div>
        {
        !token ?
        <AuthModal /> :
        <Outlet />
        }
    </div>
  )
}

export default AuthRoute