import React, { useContext, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'
import { Button } from '@oacore/design/lib/elements'
import { useRouter } from 'next/router'

import styles from './styles.module.css'
import { Card, ProgressSpinner, TextField } from '../../design'
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
import removeBin from '../../components/upload/assets/removeBin.svg'
import toggleArrow from '../../components/upload/assets/dropdownArrow.svg'

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
    setsList,
    loadingSets,
    enableSet,
    enabledList,
    disabledList,
    deleteSet,
    getSetsWholeList,
    wholeSetData,
    loadingWholeSets,
    loadingWholeSetsBtn,
    getSetsEnabledList,
    setLoadingWholeSetsBtn,
    loadingRemoveItem,
    setLoadingRemoveAction,
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
    const [selectedItem, setSelectedItem] = useState(null)
    const dropdownRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [setNameDisplay, setSetNameDisplay] = useState({})
    const [isEditing, setIsEditing] = useState({})
    const [showFullList, setShowFullList] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const router = useRouter()
    const providerId = router.query['data-provider-id']

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
      getSetsEnabledList()
    }, [providerId])

    const uploadRef = useRef(null)
    const mappingRef = useRef(null)
    const setRef = useRef(null)

    const isStartingMember = membershipPlan.billing_type === 'starting'

    const scrollTarget = {
      upload: uploadRef,
      mapping: mappingRef,
      sets: setRef,
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
        'sets': mappingSubmit,
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

    const handleDropdownClick = async () => {
      setIsOpen(!isOpen)
      if (!wholeSetData.length) await getSetsWholeList()
    }

    const handleSelect = (item) => {
      setSelectedItem(item)
      setInputValue(item.setName)
      setIsOpen(false)
    }

    const handleAddClick = async () => {
      if (selectedItem) {
        try {
          setLoadingWholeSetsBtn(true)
          await enableSet({
            setSpec: selectedItem.setSpec,
            setName: selectedItem.setName,
            setNameDisplay: selectedItem.setNameDisplay,
          })
          setSelectedItem(null)
          await getSetsWholeList()
          await getSetsEnabledList()
        } catch (error) {
          console.error('Error patching settings:', error)
        } finally {
          setLoadingWholeSetsBtn(false)
        }
      }
    }

    const handleDelete = async (id) => {
      try {
        setLoadingRemoveAction(true, id)
        await deleteSet(id)
        await getSetsWholeList()
        await getSetsEnabledList()
      } catch (error) {
        console.error('Error patching settings:', error)
      } finally {
        setLoadingRemoveAction(false, id)
      }
    }

    const handleInputChange = (id, event) => {
      setSetNameDisplay((prevState) => ({
        ...prevState,
        [id]: event.target.value,
      }))
    }

    const handleEditClick = (id) => {
      setIsEditing((prevState) => ({
        ...prevState,
        [id]: true,
      }))
    }

    const handleButtonClick = async (item) => {
      try {
        await enableSet({
          id: item.id,
          setSpec: item.setSpec,
          setName: item.setName,
          setNameDisplay: setNameDisplay[item.id],
        })
        setIsEditing((prevState) => ({
          ...prevState,
          [item.id]: false,
        }))
      } catch (error) {
        console.error('Error patching settings:', error)
      }
    }

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

    const displayAllSets = showFullList ? enabledList : enabledList.slice(0, 3)

    const toggleList = () => {
      setShowFullList(!showFullList)
    }

    const handleSetInputChange = (event) => {
      setInputValue(event.target.value)
    }

    const filteredData = wholeSetData.filter((item) =>
      item.setName.toLowerCase().includes(inputValue.toLowerCase())
    )

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
        {globalStore.enabledList.length > 0 ? (
          <div ref={setRef}>
            <Card
              className={classNames.use(styles.section).join(className)}
              tag="section"
              id="sets"
              name="sets"
            >
              <div className={styles.formWrapper}>
                <div className={styles.formInnerWrapper}>
                  <Card.Title tag="h2">{content.sets.title}</Card.Title>
                  <Card.Description className={styles.description}>
                    <Markdown>{content.sets.description}</Markdown>
                  </Card.Description>
                  <div>
                    {displayAllSets.map((item) => (
                      <div className={styles.setMainItem}>
                        <div className={styles.setOuterHeader}>
                          <div className={styles.setInnerHeader}>
                            <TextField
                              value={
                                setNameDisplay[item.id] || item.setNameDisplay
                              }
                              onChange={(event) =>
                                handleInputChange(item.id, event)
                              }
                              className={styles.setInnerField}
                              disabled={!isEditing[item.id]}
                            />
                            {!isEditing[item.id] ? (
                              <Button
                                onClick={() => handleEditClick(item.id)}
                                className={styles.setButton}
                              >
                                <div className={styles.setButtonText}>
                                  Change set display name
                                </div>
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleButtonClick(item)}
                                className={styles.setButton}
                              >
                                <div className={styles.setButtonText}>Save</div>
                              </Button>
                            )}
                          </div>
                          <div className={styles.removeWrapper}>
                            {loadingRemoveItem.id === item.id &&
                            loadingRemoveItem.value ? (
                              <div className={styles.wrapper}>
                                <ProgressSpinner
                                  className={styles.deleteSpinner}
                                />
                              </div>
                            ) : (
                              // eslint-disable-next-line max-len
                              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                              <img
                                onClick={() => handleDelete(item.id)}
                                src={removeBin}
                                alt=""
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className={styles.setWrapper}>
                            <div className={styles.setTitle}>setName</div>
                            <span className={styles.setItem}>
                              {item.setName}
                            </span>
                          </div>
                          <div className={styles.setWrapper}>
                            <div className={styles.setTitle}>setSpec</div>
                            <span className={styles.setItem}>
                              {item.setSpec}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {enabledList.length > 3 && (
                      <Button
                        className={styles.showBtn}
                        variant="outlined"
                        onClick={toggleList}
                      >
                        {showFullList ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </div>
                  <div className={styles.selectRss} ref={dropdownRef}>
                    <div className={styles.selectFormWrapper}>
                      <div className={styles.selectWrapper}>
                        <TextField
                          id="selectInput"
                          label="Add new set"
                          onClick={handleDropdownClick}
                          onChange={handleSetInputChange}
                          value={inputValue}
                          className={styles.selectInput}
                        />
                        <img
                          className={styles.repositoryLogo}
                          src={toggleArrow}
                          alt=""
                        />
                      </div>
                      <Button
                        onClick={handleAddClick}
                        className={styles.addBtn}
                        variant="contained"
                      >
                        {!loadingWholeSetsBtn ? (
                          <span>Add</span>
                        ) : (
                          <div className={styles.wrapper}>
                            <ProgressSpinner className={styles.spinner} />
                          </div>
                        )}
                      </Button>
                    </div>
                    {isOpen && (
                      <div className={styles.dropdownMenu}>
                        {loadingWholeSets ? (
                          <p className={styles.loading}>Loading...</p>
                        ) : (
                          <ul>
                            {filteredData.map((item) => (
                              // eslint-disable-next-line max-len
                              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                              <li
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className={styles.selectItem}
                              >
                                {item.setName}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <></>
        )}
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
