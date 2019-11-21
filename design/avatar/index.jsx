import React from 'react'
import './index.css'

const Avatar = React.memo(() => (
  <div className="avatar">
    <img src="/avatar.png" alt="User avatar" />
  </div>
))

export default Avatar
