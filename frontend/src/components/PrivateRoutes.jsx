import {Outlet,Navigate}from 'react-router-dom'

const PrivateRoutes = () => {
    const user = false;
  return (
    <div>{user ? <Outlet/> : <Navigate to='/login' />}</div>
  )
}

export default PrivateRoutes