import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import MembershipCard from './card'

import TextBox from 'components/text-box'
import textData from 'texts/memership'

const MembershipPageTemplate = ({
  membershipPlan,
  tag: Tag = 'main',
  className,
  ...restProps
}) => (
  <Tag
    className={classNames.use(styles.container).join(className)}
    {...restProps}
  >
    <header className={styles.header}>
      <h1 className={styles.title}>{textData.title}</h1>
      <p className={styles.description}>{textData.description}</p>
    </header>
    <article className={styles.content}>
      <div className={styles.cards}>
        {textData.plans.cards.map((card) => (
          <MembershipCard
            key={card.title}
            title={card.title}
            textData={textData}
            description={card.description}
            action={card.action}
            planName={membershipPlan.billingType}
            isPlanActive={
              membershipPlan.billingType === card.title.toLowerCase()
            }
          />
        ))}
      </div>
      <TextBox
        className={styles.box}
        description={textData.box.text}
        buttonCaption={textData.box.action.caption}
        buttonUrl={textData.box.action.url}
      />
    </article>
  </Tag>
)

export default MembershipPageTemplate
