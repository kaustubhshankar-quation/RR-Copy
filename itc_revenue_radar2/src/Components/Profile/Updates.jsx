import React from 'react'
import Navbar3 from '../Navbars/Navbar3'
import FooterPages from '../Footer/FooterPages'
import UserService from '../../services/UserService'

function Updates() {
  return (
<>
<Navbar3/>
<div className="bgpages">
        <div className=' container py-3'>
          <div className='greentheme '>{`Dashboard >> Updates`}</div>
          <div className='p-2 bg-white greentheme my-3' style={{ fontSize: "20px" }}><b> Updates</b></div>
          <div className='card p-3 my-3'>
        <div className='my-2'> There are currently no updates!!</div>
      
          </div>
          </div>
          </div>
          <div className=""><FooterPages /></div>
</>
  )
}

export default Updates