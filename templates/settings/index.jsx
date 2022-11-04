import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Button } from '@oacore/design/lib/elements'

import styles from './styles.module.css'
import oaiLogo from './assets/oai_logo.svg'

import Markdown from 'components/markdown'
import { Card, TextField } from 'design'
import {
  ChangePassword,
  FormShell,
  ResolverSettingsForm,
} from 'components/forms'
import Upload from 'components/upload'
import Title from 'components/title'
import content from 'texts/settings'

const UploadSection = ({
  className,
  handleUpload,
  logoUrl,
  isStartingMember,
}) => (
  <Card
    className={classNames.use(styles.section).join(className)}
    tag="section"
  >
    <Card.Title tag="h2">{content.upload.title}</Card.Title>
    <div className={styles.uploadContainer}>
      <Card.Description className={styles.uploadDescription} tag="div">
        <p> {content.upload.description}</p>
        {isStartingMember && (
          <>
            <Markdown className={styles.uploadNote}>
              {content.upload.memberNote.title}
            </Markdown>
            <Button
              href={content.upload.memberNote.action.url}
              variant="contained"
            >
              {content.upload.memberNote.action.caption}
            </Button>
          </>
        )}
      </Card.Description>
      <Upload
        deleteCaption={content.upload.deleteCaption}
        logoUrl={logoUrl}
        imageCaption={content.upload.imageCaption}
        buttonCaptions={content.upload.buttonCaptions}
        onSubmit={handleUpload}
      />
    </div>
  </Card>
)

const SettingsTemplate = ({
  userEmail,
  dataProvider,
  dataProviderLogo,
  updateOrganization,
  updateDataProvider,
  oaiMapping,
  mappingSubmit,
  updateLogo,
  inviteUser,
  className,
  membershipPlan,
  tag: Tag = 'main',
  ...restProps
}) => {
  const [formMessage, setFormMessage] = useState({})
  const organization = { name: dataProvider.institution }
  const isStartingMember = membershipPlan.billing_type === 'starting'
  const handleSubmit = async (event) => {
    event.preventDefault()

    const target = event.target.form || event.target

    const formData = new FormData(target)
    const data = Object.fromEntries(formData.entries())
    const scope = target.getAttribute('name')

    const present = {
      'organization': updateOrganization,
      'data-provider': updateDataProvider,
      'invitation': inviteUser,
      'mapping': mappingSubmit,
    }[scope]

    const result = await present(data)
    setFormMessage({
      ...formMessage,
      [scope]: { type: result.type, text: result.message },
    })
  }

  return (
    <Tag className={classNames.use(styles.container, className)} {...restProps}>
      <Title>{content.title}</Title>
      <Card
        className={classNames.use(styles.section).join(className)}
        tag="section"
      >
        <Card.Title tag="h2">{content.organisation.title}</Card.Title>
        <FormShell
          name="organization"
          onSubmit={handleSubmit}
          message={formMessage.organization}
        >
          <TextField
            id="settings-global-email"
            label={!organization.name && 'Set your institutional name'}
            name="name"
            defaultValue={organization.name}
            tag="p"
          />
        </FormShell>
        <Card.Title tag="h2">{content.invite.title}</Card.Title>
        <FormShell
          className={styles.invitationForm}
          name="invitation"
          buttonCaption="Invite"
          isButtonVisible
          onSubmit={handleSubmit}
          message={formMessage.invitation}
        >
          <TextField
            id="settings-invitation"
            size="small"
            label="Email"
            name="email"
            tag="div"
          />
        </FormShell>
      </Card>

      <Card
        className={classNames.use(styles.section).join(className)}
        tag="section"
      >
        <Card.Title>{content.repository.title}</Card.Title>
        <FormShell
          name="data-provider"
          onSubmit={handleSubmit}
          message={formMessage['data-provider']}
        >
          <TextField
            id="settings-repository-name"
            label={!dataProvider.name && 'Name'}
            name="name"
            defaultValue={dataProvider.name}
            tag="p"
          />
          <TextField
            id="settings-repository-email"
            label={!dataProvider.email && 'Email'}
            name="email"
            defaultValue={dataProvider.email}
            tag="p"
            readOnly
          />
        </FormShell>
      </Card>
      <ChangePassword
        className={styles.section}
        email={userEmail}
        tag="section"
      />
      <Card
        className={classNames.use(styles.section).join(className)}
        tag="section"
      >
        <img src={oaiLogo} alt="Oai logo" />
        <Card.Title tag="h2">{content.mapping.title}</Card.Title>
        <Card.Description className={styles.description}>
          <Markdown>{content.mapping.description}</Markdown>
        </Card.Description>
        {Object.keys(oaiMapping).length > 0 && (
          <ResolverSettingsForm
            formMessage={formMessage.mapping}
            onSubmit={handleSubmit}
            mappingSubmit={mappingSubmit}
            oaiMapping={oaiMapping}
          />
        )}
      </Card>
      <UploadSection
        isStartingMember={isStartingMember}
        logoUrl={dataProviderLogo}
        handleUpload={updateLogo}
      />
    </Tag>
  )
}

export default SettingsTemplate
