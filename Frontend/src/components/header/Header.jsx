import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from "../../store/authSlice.js"
import { logoutUser } from '../../api/auth.js'
import Button from '../bacisComponets/Button.jsx'

function Header() {
    const dispatch = useDispatch();
    const { status, userData } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await logoutUser();
        dispatch(logout());
    };

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-md  border-b border-white/10 shadow-xl"
            style={{ background: "rgba(12, 19, 36, 0.6) ",   }}
        >
            <div className="flex justify-between items-center max-w-[1200px] mx-auto px-5 md:px-16 h-12">

                {/* Logo */}
                <Link to="/">
                    <span className=" text-2xl md:text-4xl font-bold tracking-tighter"
                        style={{ color: "#a4e6ff" }}
                    >
                        ReminderAI
                    </span>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-4"> 

                    {status ? (
                        <>
                            <span className="hidden md:inline text-sm font-semibold"
                                style={{ color: "#bbc9cf" }}
                            >
                                {userData?.name}
                            </span>

                            <Link to="/settings">
                                <Button variant="ghost" className="text-sm rounded-full px-4 py-2">
                                    Settings
                                </Button>
                            </Link>

                            <Button
                                variant="cta"
                                className="text-sm rounded-full px-6 py-2"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-sm rounded-full px-4 py-2">
                                    Login
                                </Button>
                            </Link>

                            <Link to="/signup">
                                <Button variant="cta" className="text-sm rounded-full px-6 py-2">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Header