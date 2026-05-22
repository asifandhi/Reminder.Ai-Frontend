import { useState,useEffect } from 'react'
import './App.css'
import { useSelector } from 'react-redux'
import theme from './theme'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { login } from './store/authSlice.js'
import { getMe } from './api/auth.js'



function App() {

  const t = theme["dark"]

  const dispatch = useDispatch();

  useEffect(() => {
    getMe()
      .then((res) => {
        dispatch(login(res.data.data));
      })
      .catch(() => {

      });
  }, []);



  return (
    
    <div style={{ backgroundColor: t.bg, color: t.text, minHeight: "100vh" }}
    >
      <Outlet/>

    </div>
  )
}

export default App
