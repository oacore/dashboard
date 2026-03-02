import React, { useState } from 'react'

import "./styles.css"
import { Button } from 'antd';
import Markdown from '@components/common/Markdown/Markdown.tsx';

interface CrShowMoreProps {
  text: string;
  maxLetters: number;
}

export const CrShowMore: React.FC<CrShowMoreProps> = ({
  text,
  maxLetters,
}) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const truncatedText = text?.slice(0, maxLetters)

  if (!text) return <div className="not-avaliable">Not available</div>
  if (text.length <= maxLetters) {
    return (
      <div className="description">
        <Markdown className="markdown-wrapper">{text}</Markdown>
      </div>
    )
  }

  return (
    <div className="description">
      <Markdown className="markdown-wrapper">
        {showMore ? text : `${truncatedText}...`}
      </Markdown>
      <Button type="link" className="show-more-btn" onClick={toggleShowMore}>
        {showMore ? 'Show less' : 'Show more'}
      </Button>
    </div>
  )
}

