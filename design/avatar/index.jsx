import React from 'react'

import avatarClassNames from './index.css'

const Avatar = React.memo(() => (
  <div className={avatarClassNames.avatar}>
    <img src="/avatar.png" alt="User avatar" />
  </div>
))

export default Avatar
