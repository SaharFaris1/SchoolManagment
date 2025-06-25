import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      setIsLoggedIn(true)
      setUserName(user.fullName || 'مستخدم')
    }
    const handleStorageChange = () => {
      const currentUser = JSON.parse(localStorage.getItem('user'))
      if (currentUser) {
        setIsLoggedIn(true);
        setUserName(currentUser.fullName || 'مستخدم')
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    };

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    };
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUserName('')
    window.dispatchEvent(new Event('storage'))
    navigate('/')
  }

  return (
    <nav className="bg-gray-50 shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="text-xl  text-white-800 flex items-center gap-2">
            <img src="logo.jpg" alt="Logo" className="w-15 h-15 rounded-full" />
            <span className=''>  School Managment</span>
          </div>

          {/* Desktop Right Side Buttons */}
          <div className="hidden md:flex space-x-4 space-x-reverse items-center">
            {isLoggedIn ? (
              <>
                <span className="text-white">Hi {userName}</span>
               
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden text-white flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden  mt-4 pb-3 border-t border-gray-200">
            {isLoggedIn ? (
              <div className="flex flex-col space-y-3 px-4">

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-center">
                Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-4">
              
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
export default Nav