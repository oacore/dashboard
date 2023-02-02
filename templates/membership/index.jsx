import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import MembershipCard from './card'
import MembershipDocumentationPage from '../../pages/documentation'

import textData from 'texts/memership'
import TextBox from 'components/text-box'

const MembershipPageTemplate = ({
  membershipPlan,
  tag: Tag = 'main',
  className,
  dataProviderId,
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
            planName={membershipPlan.membership_plan_name}
            isPlanActive={
              membershipPlan.billing_type === card.title.toLowerCase()
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
    <article className={styles.content}>
      <MembershipDocumentationPage dataProviderId={dataProviderId} />
    </article>
  </Tag>
)

export default MembershipPageTemplate
