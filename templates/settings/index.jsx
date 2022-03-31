import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Switch, useSwitch } from '@oacore/design'

import styles from './styles.module.css'
import oaiLogo from './assets/oai_logo.svg'
import imagePlacegolder from './assets/placeholder.svg'

import { Card, TextField, Form } from 'design'
import { ChangePassword, FormShell } from 'components/forms'
import Upload from 'components/upload'
import Title from 'components/title'
import content from 'texts/settings'

const UploadSection = ({ className }) => (
  <Card
    className={classNames.use(styles.section).join(className)}
    tag="section"
  >
    <Card.Title tag="h2">{content.upload.title}</Card.Title>
    <div className={styles.uploadContainer}>
      <Card.Description className={styles.uploadDescription}>
        {content.upload.description}
      </Card.Description>
      {/* We will use repository URL later */}
      <Upload
        imageCaption={content.upload.imageCaption}
        imgDefault={imagePlacegolder}
        buttonCaptions={content.upload.buttonCaptions}
      />
    </div>
  </Card>
)

const SettingsTemplate = ({
  userEmail,
  dataProvider,
  updateOrganization,
  updateDataProvider,
  inviteUser,
  className,
  tag: Tag = 'main',
  ...restProps
}) => {
  const { toggleChange, isActivated } = useSwitch()
  const [formMessage, setFormMessage] = useState({})
  const organization = { name: dataProvider.institution }

  // For testing
  const mappingSubmitting = () => ({
    message: 'OK',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())

    const scope = event.target.getAttribute('name')
    const present = {
      'organization': updateOrganization,
      'data-provider': updateDataProvider,
      'invitation': inviteUser,
      'mapping': mappingSubmitting,
    }[scope]

    const result = await present(data)

    setFormMessage({
      ...formMessage,
      [scope]: result.message,
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
            label="Name"
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
            label="Name"
            name="name"
            defaultValue={dataProvider.name}
            tag="p"
          />
          <TextField
            id="settings-repository-email"
            label="Email"
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
          {content.mapping.description}
        </Card.Description>
        <FormShell
          name="mapping"
          useButtonOnChange={false}
          isButtonVisible={isActivated}
          buttonCaption={content.mapping.buttonCaption}
          className={styles.mappingForm}
          onSubmit={handleSubmit}
          message={formMessage.mapping}
        >
          <div className={styles.mappingFields}>
            {content.mapping.form.map((field) => (
              <div key={field.name}>
                <Form.Label
                  className={styles.mappingLabel}
                  htmlFor={field.name}
                >
                  {field.title}
                </Form.Label>
                <TextField
                  className={styles.mappingInput}
                  id="settings-repository-name"
                  label={field.label}
                  name={field.name}
                  defaultValue={dataProvider.name}
                  helper={field.helper}
                  statusIcon="#pencil"
                />
              </div>
            ))}
          </div>
          <Switch
            className={styles.toggle}
            id="toggle-switch"
            isActivated={isActivated}
            onChange={toggleChange}
            label={
              isActivated
                ? content.mapping.switch.active
                : content.mapping.switch.disabled
            }
          />
        </FormShell>
      </Card>
      <UploadSection />
    </Tag>
  )
}

export default SettingsTemplate
