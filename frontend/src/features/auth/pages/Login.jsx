import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {handleLogin} = useAuth()

  const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

  const navigate = useNavigate()
  const handleSubmit = async(e) => {
    e.preventDefault();
   
     const payload ={
      email,
      password,
     }
     await handleLogin(payload)
     navigate("/")
  };
   if(!loading && user){
    return <Navigate to="/" replace/>
   }
   
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F9AC33] focus:border-transparent transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F9AC33] focus:border-transparent transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#F9AC33] text-white font-semibold py-3 px-4 rounded-lg hover:bg-yellow-500 transition duration-200 transform hover:scale-105"
          >
            Login
          </button>
          <p className='text-white'>New user? <Link to='/register' className='text-lg'>Register</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Login
