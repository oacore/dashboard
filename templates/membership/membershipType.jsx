import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../settings/styles.module.css'
import MembershipCard from './card'
import DashboardHeader from '../../components/dashboard-header'

import textData from 'texts/memership'
import TextBox from 'components/text-box'

const MembershipPageTemplate = ({
  membershipPlan,
  tag: Tag = 'main',
  className,
  headerDashboard,
  docs,
  ...restProps
}) => (
  <Tag
    className={classNames.use(styles.memberContainer).join(className)}
    {...restProps}
  >
    <DashboardHeader
      title={textData.title}
      description={textData.description}
    />
    <article className={styles.content}>
      <div className={styles.cards}>
        {textData.plans.cards.map((card) => (
          <MembershipCard
            key={card.title}
            title={card.title}
            textData={textData}
            description={card.description}
            action={card.action}
            planName={membershipPlan.billing_type}
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
  </Tag>
)

export default MembershipPageTemplate
