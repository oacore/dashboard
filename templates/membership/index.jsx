import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Button } from '@oacore/design/lib/elements'

import styles from './styles.module.css'

import TextBox from 'components/text-box'
import textData from 'texts/memership'
import { patchValue } from 'utils/helpers'

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
        {textData.plans.cards.map((card) => {
          const activePlan =
            membershipPlan.billing_type === card.title.toLowerCase()

          return (
            <div
              key={card.title}
              className={classNames.use(styles.card, {
                [styles.cardActive]:
                  membershipPlan.membership_plan_name ===
                  card.title.toLowerCase(),
              })}
            >
              <h1
                className={classNames.use(styles.cardTitle, {
                  [styles.cardTitleActive]: activePlan,
                })}
              >
                {card.title}
                {activePlan && <span>{textData.plans.selected.header}</span>}
              </h1>
              <div
                className={classNames.use(styles.cardContent, {
                  [styles.cardContentActive]: activePlan,
                })}
              >
                <p className={styles.cardDescription}>{card.description}</p>
                {activePlan ? (
                  <p className={styles.planActive}>
                    {patchValue(textData.plans.selected.card, {
                      title: card.title,
                    })}
                  </p>
                ) : (
                  card.action && (
                    <Button
                      href={card.action.url}
                      variant="contained"
                      className={styles.cardButton}
                    >
                      {card.action.caption}
                    </Button>
                  )
                )}
              </div>
            </div>
          )
        })}
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
