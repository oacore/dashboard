import React, { useContext, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'
import { Button } from '@oacore/design/lib/elements'
import { useRouter } from 'next/router'
import { Modal } from '@oacore/design'

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
import greenTick from '../../components/upload/assets/greenTick.svg'

import dropdown from 'components/upload/assets/dropdownArrow.svg'

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
    getLicencing,
    updateLicencing,
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
    const [suggestionsId, setSuggestionsId] = useState([])
    const [suggestionsName, setSuggestionsName] = useState([])
    const [isChanged, setChanged] = useState(false)
    const [isNameOpen, setNameIsOpen] = useState(false)
    const [isIdOpen, setIdIsOpen] = useState(false)

    const [isNameChanged, setNameChanged] = useState(false)
    const [isFormSubmitted, setFormSubmitted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

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

    useEffect(() => {
      getLicencing()
    }, [])

    const uploadRef = useRef(null)
    const mappingRef = useRef(null)
    const licenseRef = useRef(null)
    const router = useRouter()
    const dropdownRef = useRef(null)

    const isStartingMember = membershipPlan.billing_type === 'starting'

    const scrollTarget = {
      upload: uploadRef,
      mapping: mappingRef,
      license: licenseRef,
    }

    useScrollEffect(scrollTarget[router.query.referrer])

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target))
          setIsOpen(false)
      }

      document.addEventListener('mousedown', handleClickOutside)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [dropdownRef])

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

    useEffect(() => {
      if (globalStore.licencingData?.licenseStrategy === false)
        setInputValue(content.license.options[0])
      else if (globalStore.licencingData?.licenseStrategy === true)
        setInputValue(content.license.options[1])
    }, [globalStore.licencingData?.licenseStrategy])

    const handleLicenseClick = async (option) => {
      setIsOpen(false)
      setInputValue(option)
      if (option.type === 1) setIsModalOpen(true)
      else {
        const licenseType = option.value !== content.license.options[0].value
        try {
          await updateLicencing(licenseType)
          setShowSuccess(true)
        } catch (error) {
          console.error('Error updating license:', error)
        }
      }
    }

    const handleSave = async () => {
      const licenseType = inputValue.value !== content.license.options[0].value
      try {
        await updateLicencing(licenseType)
        setIsModalOpen(false)
        setShowSuccess(true)
      } catch (error) {
        console.error('Error updating license:', error)
      }
    }

    const handleChange = () => {
      setChanged(true)
    }

    const changeHandler = () => {
      setNameChanged(true)
    }

    const handleNameChange = (event) => {
      setRepositoryName(event.target.value)
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

    const handleDropdownClick = () => {
      setIsOpen(!isOpen)
    }

    const handleSetInputChange = (event) => {
      setInputValue(event.target.value)
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
                <>
                  <TextField
                    id="settings-repository-name"
                    label={!dataProvider.name && 'Name'}
                    name="name"
                    defaultValue={repositoryName}
                    tag="p"
                    value={repositoryName}
                    onChange={handleNameChange}
                  />
                  <TextField
                    id="settings-repository-email"
                    label={!dataProvider.email && 'Email'}
                    name="email"
                    defaultValue={dataProvider.email}
                    tag="p"
                    readOnly
                  />
                </>
                {isNameChanged && <Button variant="contained">save</Button>}
              </FormShell>
            </div>
            <div className={styles.mainWarningWrapper} />
          </div>
          <div className={styles.formWrapper}>
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
            </div>
            <div className={styles.mainWarningWrapper}>
              {renderRORWarning()}
            </div>
          </div>
          <Markdown className={styles.rorDescription}>
            {content.organisation.rordescription}
          </Markdown>
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
        <div ref={licenseRef}>
          <Card
            className={classNames.use(styles.section).join(className)}
            tag="section"
          >
            <div className={styles.formWrapper}>
              <div className={styles.formInnerWrapper}>
                <Card.Title tag="h2">{content.license.title}</Card.Title>
                <div className={styles.licenseContainer}>
                  <Card.Description
                    className={styles.licenseDescriptionWrapper}
                    tag="div"
                  >
                    <>
                      <Markdown className={styles.licensedescription}>
                        {content.license.description}
                      </Markdown>
                      <div className={styles.licenseTypeWrapper}>
                        <div className={styles.licenseType}>
                          {content.license.dropdown}
                        </div>
                        <div
                          className={styles.dropdownWrapper}
                          ref={dropdownRef}
                        >
                          <div
                            className={classNames.use(styles.activeWrapper, {
                              [styles.active]: isOpen,
                            })}
                          >
                            <TextField
                              id="secondInput"
                              label=""
                              onClick={handleDropdownClick}
                              onChange={handleSetInputChange}
                              value={inputValue.value}
                              className={styles.selectInput}
                              readOnly
                            />
                            <img
                              className={styles.icon}
                              src={dropdown}
                              alt="dropdown"
                            />
                          </div>
                          {isOpen && (
                            <div className={styles.dropdown}>
                              <ul>
                                {Object.values(content.license.options).map(
                                  (option) => (
                                    // eslint-disable-next-line max-len
                                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                                    <li
                                      key={option.type}
                                      onClick={() => handleLicenseClick(option)}
                                      className={styles.selectItem}
                                    >
                                      {option.value}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.selectWrapper} />
                      <Markdown className={styles.licenseNote}>
                        {inputValue.description}
                      </Markdown>
                      {showSuccess && (
                        <div className={styles.success}>
                          <img className={styles.tick} src={greenTick} alt="" />
                          <div>Licencing preference updated successfully.</div>
                        </div>
                      )}
                    </>
                  </Card.Description>
                </div>
              </div>
              <div className={styles.mainWarningWrapper} />
            </div>
          </Card>
          {isModalOpen && (
            <Modal
              className={styles.notificationGuideWrapper}
              isOpen={isModalOpen}
              aria-label="modal"
              hideManually
            >
              <div className={styles.notificationGuide}>
                <h5 className={styles.notificationTitle}>
                  {content.license.modal.title}
                </h5>
                <div className={styles.notificationGuideInnerWrapper}>
                  <Markdown className={styles.notificationDescription}>
                    {content.license.modal.description}
                  </Markdown>
                </div>
                <div className={styles.buttonGroup}>
                  <Button
                    key={content.notificationGuide.actions.offAction.title}
                    variant="text"
                    className={styles.actionButton}
                    onClick={() => setIsModalOpen(false)}
                  >
                    {Object.values(content.license.modal.actions[1])}
                  </Button>
                  <Button
                    key={content.notificationGuide.actions.offAction.title}
                    variant="contained"
                    className={styles.actionButton}
                    onClick={() => handleSave()}
                  >
                    {Object.values(content.license.modal.actions[0])}
                  </Button>
                </div>
              </div>
            </Modal>
          )}
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
