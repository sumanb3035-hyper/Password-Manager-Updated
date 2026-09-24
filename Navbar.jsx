import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-600 flex justify-between py-3'>
        <div className="logo font-bold mx-4 text-white">
            <span className='text-green-500'>&lt;</span>Password<span className='text-amber-300'>Manager</span><span className='text-green-500'>/&gt;</span>
        </div>
        <ul className='flex mx-4 gap-4'>
            <div className="git">
              <a className='flex gap-1.5 invert' href="https://github.com/sumanb3035-hyper"><img className='w-6' src="assets/github.png" alt="Github"/>Github</a>
            </div>
        </ul>
    </nav>
  )
}

export default Navbar