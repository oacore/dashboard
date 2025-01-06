import React from 'react'

const Video = ({ src, title, className = '', tag: Tag = 'div' }) => (
  <Tag className={`embed-responsive embed-responsive-16by9 ${className}`}>
    <iframe
      className="embed-responsive-object"
      src={src}
      title={title}
      referrerPolicy="origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
    />
  </Tag>
)

export default Video
