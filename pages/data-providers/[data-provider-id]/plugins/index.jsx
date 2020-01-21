import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import pluginsClassNames from './plugins.css'

import { Card, Button } from 'design'
import { overview as texts } from 'texts/plugins'

const PluginCard = ({
  title,
  description,
  actionCaption,
  href,
  ...restProps
}) => (
  <Card {...restProps}>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
    <Button variant="contained" href={href} tag="a">
      {actionCaption}
    </Button>
  </Card>
)

const DiscoveryPluginCard = passProps => (
  <PluginCard
    title={texts.discovery.title}
    description={texts.discovery.description}
    actionCaption={texts.discovery.action}
    href="plugins/discovery"
    {...passProps}
  />
)

const RecommenderPluginCard = passProps => (
  <PluginCard
    title={texts.recommender.title}
    description={texts.recommender.description}
    actionCaption={texts.recommender.action}
    href="plugins/recommender"
    {...passProps}
  />
)

const Plugins = ({ className, ...restProps }) => (
  <main
    className={classNames.use(pluginsClassNames.container, className)}
    {...restProps}
  >
    <h1>Plugins</h1>
    <DiscoveryPluginCard tag="section" />
    <RecommenderPluginCard tag="section" />
  </main>
)

export default Plugins
