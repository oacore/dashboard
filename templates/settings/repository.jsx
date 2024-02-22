import React, { useContext, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'
import { Button } from '@oacore/design/lib/elements'
import { useRouter } from 'next/router'

import styles from './styles.module.css'
import { Card, TextField } from '../../design'
import content from '../../texts/settings'
import Markdown from '../../components/markdown'
import Upload from '../../components/upload'
import { useScrollEffect } from '../../pages/_app/hooks'
import oaiLogo from './assets/oai_logo.svg'
import { FormShell, ResolverSettingsForm } from '../../components/forms'
import DropdownInput from '../../components/input-select/input-select'
import warning from './assets/warning.svg'
import { GlobalContext } from '../../store'
import infoGreen from '../../components/upload/assets/infoGreen.svg'

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
      {isStartingMember && (
        <Card.Description className={styles.uploadDescription} tag="div">
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
        </Card.Description>
      )}
      <div className={styles.uploadWrapper}>
        <div className={styles.uploadText}>
          <Markdown>{content.upload.description}</Markdown>
        </div>
        <Upload
          deleteCaption={content.upload.deleteCaption}
          logoUrl={logoUrl}
          imageCaption={content.upload.imageCaption}
          buttonCaptions={content.upload.buttonCaptions}
          onSubmit={handleUpload}
        />
      </div>
    </div>
  </Card>
)

const RepositoryPageTemplate = observer(
  ({
    className,
    userEmail,
    membershipPlan,
    dataProviderLogo,
    updateDataProvider,
    updateOrganization,
    updateLogo,
    oaiMapping,
    mappingSubmit,
    dataProvider,
    setGlobalRorName,
    setGlobalRorId,
    init,
    status,
    tag: Tag = 'main',
    ...restProps
  }) => {
    const { ...globalStore } = useContext(GlobalContext)
    const [formMessage, setFormMessage] = useState({})
    const [rorId, setRorId] = useState(globalStore.dataProvider.rorGlobalId)
    const [rorName, setRorName] = useState(
      globalStore.dataProvider.rorGlobalName
    )
    const [repositoryName, setRepositoryName] = useState(
      globalStore.dataProvider.name
    )
    const [oaiUrl, setOaiUrl] = useState()
    const [suggestionsId, setSuggestionsId] = useState([])
    const [suggestionsName, setSuggestionsName] = useState([])
    const [isChanged, setChanged] = useState(false)
    const [isNameOpen, setNameIsOpen] = useState(false)
    const [isIdOpen, setIdIsOpen] = useState(false)

    const [isNameChanged, setNameChanged] = useState(false)
    const [isEmailChanged, setEmailChanged] = useState(false)
    const [isOaiChanged, setOaiChanged] = useState(false)
    const [isFormSubmitted, setFormSubmitted] = useState(false)

    useEffect(() => {
      fetch(`https://api.ror.org/organizations?query=${rorId}`)
        .then((response) => response.json())
        .then((data) => {
          setSuggestionsId(data.items)
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error)
        })
    }, [rorId])

    useEffect(() => {
      fetch(`https://api.ror.org/organizations?query=${rorName}`)
        .then((response) => response.json())
        .then((data) => {
          setSuggestionsName(data.items)
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error)
        })
    }, [rorName])

    const uploadRef = useRef(null)
    const mappingRef = useRef(null)
    const router = useRouter()

    const isStartingMember = membershipPlan.billing_type === 'starting'

    const scrollTarget = {
      upload: uploadRef,
      mapping: mappingRef,
    }

    useScrollEffect(scrollTarget[router.query.referrer])

    const handleSubmit = async (event) => {
      event.preventDefault()

      const target = event.target.form || event.target
      const formData = new FormData(target)
      const data = Object.fromEntries(formData.entries())
      const scope = target.getAttribute('name', 'ror_id')
      const present = {
        'data-provider': updateDataProvider,
        'mapping': mappingSubmit,
      }[scope]

      const result = await present(data)
      setGlobalRorId(rorId)
      setGlobalRorName(rorName)

      await globalStore.organisation.retrieve()

      if (event.target.getAttribute('name') === 'data-provider')
        setFormSubmitted(true)

      setFormMessage({
        ...formMessage,
        [scope]: { type: result.type, text: result.message },
      })
    }

    const handleNameInputChange = (event) => {
      setRorName(event.target.value)
      setNameIsOpen(true)
    }

    const handleIdInputChange = (event) => {
      setRorId(event.target.value)
      setIdIsOpen(true)
    }

    const handleNameOptionClick = () => {
      setNameIsOpen(false)
    }

    const handleIdOptionClick = () => {
      setIdIsOpen(false)
    }

    const handleChange = () => {
      setChanged(true)
    }

    const changeHandler = () => {
      setNameChanged(true)
    }

    const changeEmail = () => {
      setEmailChanged(true)
    }
    const changeOaiUrl = () => {
      setOaiChanged(true)
    }
    const handleNameChange = (event) => {
      setRepositoryName(event.target.value)
    }
    const handleOaiUrlChange = (event) => {
      setOaiUrl(event.target.value)
    }

    const renderRORWarning = () => {
      if (
        globalStore.organisation.rorId &&
        globalStore.dataProvider.rorGlobalId &&
        globalStore.organisation.rorId !== globalStore.dataProvider.rorGlobalId
      ) {
        return (
          <div className={styles.warningWrapper}>
            <img src={warning} alt="" />
            The ROR ID for your organisation is different from the ROR ID for
            your repository.
          </div>
        )
      }
      return null
    }

    return (
      <Tag
        className={classNames.use(styles.container, className)}
        {...restProps}
      >
        <h1 className={styles.settingCardTitle}>Repository settings</h1>
        <Card
          className={classNames.use(styles.section).join(className)}
          tag="section"
        >
          <Card.Title>{content.repository.title}</Card.Title>
          <div className={styles.formWrapper}>
            <div className={styles.formInnerWrapper}>
              <FormShell
                name="data-provider"
                onSubmit={handleSubmit}
                onChange={changeHandler}
              >
                <TextField
                  id="settings-repository-name"
                  label={!dataProvider.name && 'Name'}
                  name="name"
                  defaultValue={repositoryName}
                  tag="p"
                  value={repositoryName}
                  onChange={handleNameChange}
                />
                {isNameChanged && <Button variant="contained">save</Button>}
              </FormShell>
            </div>
            <div className={styles.mainWarningWrapper} />
          </div>
          <div className={styles.formWrapper}>
            <div className={styles.formInnerWrapper}>
              <FormShell
                name="data-provider"
                onSubmit={handleSubmit}
                onChange={changeEmail}
              >
                <TextField
                  id="settings-repository-email"
                  label={!dataProvider.email && 'Email'}
                  name="email"
                  defaultValue={dataProvider.email}
                  tag="p"
                  readOnly
                />
                {isEmailChanged && <Button variant="contained">save</Button>}
              </FormShell>
              <Markdown className={styles.rorDescription}>
                {content.organisation.emailDescription}
              </Markdown>
            </div>
            <div className={styles.mainWarningWrapper} />
          </div>
          <div className={styles.formRorWrapper}>
            <div className={styles.formInnerWrapper}>
              <form
                name="data-provider"
                onSubmit={handleSubmit}
                onChange={handleChange}
              >
                <div className={styles.fieldsWrapper}>
                  <DropdownInput
                    id="ror-id"
                    label="ROR id"
                    name="ror_id"
                    className={styles.inputItem}
                    tag="p"
                    isOpen={isIdOpen}
                    suggestions={suggestionsId}
                    handleOptionClick={handleIdOptionClick}
                    setRorName={setRorName}
                    setRorId={setRorId}
                    value={rorId}
                    onChange={handleIdInputChange}
                    required={false}
                  />
                  <DropdownInput
                    id="ror-name"
                    label="ROR registered name"
                    name="rorName"
                    className={styles.inputItem}
                    tag="p"
                    value={rorName}
                    suggestions={suggestionsName}
                    isOpen={isNameOpen}
                    onChange={handleNameInputChange}
                    handleOptionClick={handleNameOptionClick}
                    setRorName={setRorName}
                    setRorId={setRorId}
                    required={false}
                  />
                </div>
                {isChanged && <Button variant="contained">save</Button>}
              </form>
              <Markdown className={styles.rorDescription}>
                {content.organisation.rordescription}
              </Markdown>
            </div>
            <div className={styles.mainWarningWrapper}>
              {renderRORWarning()}
            </div>
          </div>
          <div className={styles.formWrapper}>
            <div className={styles.formInnerWrapper}>
              <FormShell
                name="data-provider"
                onSubmit={handleSubmit}
                onChange={changeOaiUrl}
              >
                <TextField
                  id="oaiPmhUrl"
                  label="OAI based URL"
                  name="oaiPmhUrl"
                  defaultValue={oaiUrl}
                  tag="p"
                  value={oaiUrl}
                  onChange={handleOaiUrlChange}
                />
                {isOaiChanged && <Button variant="contained">save</Button>}
              </FormShell>
              <Markdown className={styles.rorDescription}>
                {content.organisation.oaiDescription}
              </Markdown>
            </div>
            <div className={styles.mainWarningWrapper} />
          </div>
          {isFormSubmitted && (
            <div className={styles.infoIndicatorWrapper}>
              <div className={styles.infoIndicator}>
                <img src={infoGreen} alt="infogreen" />
                <span className={styles.infoText}>
                  Your data has been successfully saved.
                  <br />
                  Please be aware that it may take a few days for the changes to
                  propagate across the whole of CORE data.
                </span>
              </div>
              <div className={styles.mainWarningWrapper} />
            </div>
          )}
        </Card>
        <div ref={mappingRef}>
          <Card
            className={classNames.use(styles.section).join(className)}
            tag="section"
            id="mapping"
            name="mapping"
          >
            <div className={styles.formWrapper}>
              <div className={styles.formInnerWrapper}>
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
              </div>
              <div className={styles.mainWarningWrapper} />
            </div>
          </Card>
        </div>
        <div ref={uploadRef}>
          <UploadSection
            isStartingMember={isStartingMember}
            logoUrl={dataProviderLogo}
            handleUpload={updateLogo}
          />
        </div>
      </Tag>
    )
  }
)

export default RepositoryPageTemplate
