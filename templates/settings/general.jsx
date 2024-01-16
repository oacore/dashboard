import React, { useContext, useEffect, useRef, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'
import { Button } from '@oacore/design/lib/elements'
import { useRouter } from 'next/router'

import warning from './assets/warning.svg'
import content from '../../texts/settings'
import { Card, TextField } from '../../design'
import DropdownInput from '../../components/input-select/input-select'
import styles from './styles.module.css'
import Markdown from '../../components/markdown'
import ConfirmationDeleteInvite from './confirmation'
import { useScrollEffect } from '../../pages/_app/hooks'
import { GlobalContext } from '../../store'
import AccessUsers from './accessUsers'

import { ChangePassword, FormShell } from 'components/forms'

const GeneralPageTemplate = observer(
  ({
    organisationUserInvites,
    updateOrganization,
    inviteUser,
    className,
    userEmail,
    delInviter,
    init,
    status,
    apiUserData,
    datasetUserData,
    fetchApiUsers,
    fetchDatasetUsers,
    tag: Tag = 'main',
    ...restProps
  }) => {
    const { ...globalStore } = useContext(GlobalContext)
    const [formMessage, setFormMessage] = useState({})
    const [inviteCodes, setInviteCodes] = useState(organisationUserInvites)
    const [rorId, setRorId] = useState(
      globalStore.organisation.rorId ? globalStore.organisation.rorId : ''
    )
    const [rorName, setRorName] = useState(
      globalStore.organisation.rorName ? globalStore.organisation.rorName : ''
    )
    const [organizationName, setOrganizationName] = useState(
      globalStore.organisation.name
    )
    const [suggestionsId, setSuggestionsId] = useState([])
    const [suggestionsName, setSuggestionsName] = useState([])

    const [isNameChanged, setNameChanged] = useState(false)
    const [isRorChanged, setRorChanged] = useState(false)

    const [isNameOpen, setNameIsOpen] = useState(false)
    const [isIdOpen, setIdIsOpen] = useState(false)

    const [showAllInvites, setShowAllInvites] = useState(false)
    const [showFullApiList, setShowFullApiList] = useState(false)
    const [showFullDatasetList, setShowFullDatasetList] = useState(false)

    const displayedInviteCodes = showAllInvites
      ? inviteCodes
      : inviteCodes.slice(0, 5)

    const toggleShowAllInvites = () => {
      setShowAllInvites(!showAllInvites)
    }

    const toggleApiList = () => {
      setShowFullApiList(!showFullApiList)
    }
    const toggleDatasetList = () => {
      setShowFullDatasetList(!showFullDatasetList)
    }

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

    const inviteRef = useRef(null)
    const router = useRouter()

    const scrollTarget = {
      invite: inviteRef,
    }

    useScrollEffect(scrollTarget[router.query.referrer])

    const removeElement = (code) => {
      const newInviteCodes = inviteCodes.filter((item) => item.code !== code)
      // eslint-disable-next-line no-param-reassign
      organisationUserInvites = organisationUserInvites.filter(
        (item) => item.code !== code
      )
      setInviteCodes(newInviteCodes)
    }

    const handleSubmit = async (event) => {
      event.preventDefault()

      const target = event.target.form || event.target

      const formData = new FormData(target)
      const data = Object.fromEntries(formData.entries())
      const scope = target.getAttribute('name', 'ror_id')

      const present = {
        organization: updateOrganization,
        invitation: inviteUser,
      }[scope]

      const result = await present(data)

      await globalStore.organisation.retrieve()

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

    const handleNameChange = () => {
      setNameChanged(organizationName !== globalStore.organisation.name)
    }

    const handleRorChange = () => {
      setRorChanged(
        rorId !== globalStore.organisation.rorId ||
          rorName !== globalStore.organisation.rorName
      )
    }

    const handleOrganizationNameChange = (event) => {
      setOrganizationName(event.target.value)
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
        <div className={styles.settingCardTitle}>{content.title}</div>
        <div ref={inviteRef}>
          <Card
            className={classNames.use(styles.section).join(className)}
            tag="section"
            id="invite"
            name="invite"
          >
            <Card.Title tag="h2">{content.organisation.title}</Card.Title>
            <div className={styles.formWrapper}>
              <div className={styles.formInnerWrapper}>
                <FormShell
                  name="organization"
                  onSubmit={handleSubmit}
                  onChange={handleNameChange}
                  message={formMessage.organization}
                >
                  <TextField
                    id="settings-global-email"
                    label={
                      !globalStore.organisation.name &&
                      'Set your institutional name'
                    }
                    name="name"
                    defaultValue={organizationName}
                    value={organizationName}
                    onChange={handleOrganizationNameChange}
                    tag="p"
                  />
                  {isNameChanged && <Button variant="contained">save</Button>}
                </FormShell>
              </div>
              <div className={styles.mainWarningWrapper} />
            </div>
            <div className={styles.formWrapper}>
              <div className={styles.formInnerWrapper}>
                <form
                  name="organization"
                  onSubmit={handleSubmit}
                  onChange={handleRorChange}
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
                    />
                  </div>
                  {isRorChanged && <Button variant="contained">save</Button>}
                </form>
              </div>
              <div className={styles.mainWarningWrapper}>
                {renderRORWarning()}
              </div>
            </div>
            <Markdown className={styles.rorDescription}>
              {content.organisation.rordescription}
            </Markdown>
            <Card.Title tag="h2">{content.invite.title}</Card.Title>
            <div className={styles.formWrapper}>
              <div className={styles.formInnerWrapper}>
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
                <Card.Title tag="h4">{content.invite.listAccess}</Card.Title>
                <>
                  {displayedInviteCodes.map((item) => (
                    // {organisationUserInvites.map((item) => (
                    <div
                      className={classNames.use(styles.invitationUserDelete)}
                    >
                      <div
                        id={`invite-${item.email}`}
                        className={classNames.use(styles.inviteEmail)}
                      >
                        {item.email}
                      </div>
                      <div
                        id={`invite-${item.activated}`}
                        className={classNames.use(styles.inviteStatus, {
                          [styles.inviteActivated]: item.activated,
                        })}
                      >
                        {item.activated ? 'activated' : 'not activated'}
                      </div>
                      <ConfirmationDeleteInvite
                        text={content.invite.confirmation}
                        item={item}
                        submitConfirm={delInviter}
                        removeElement={removeElement}
                      />
                    </div>
                  ))}
                  {inviteCodes.length > 5 && (
                    <Button
                      className={styles.showBtn}
                      variant="outlined"
                      onClick={toggleShowAllInvites}
                    >
                      {showAllInvites ? 'Show Less' : 'Show More'}
                    </Button>
                  )}
                </>
              </div>
              <div className={styles.mainWarningWrapper} />
            </div>
          </Card>
        </div>
        <div className={styles.apiAccess}>
          <AccessUsers
            title={content.accessUsers.title}
            subTitle={
              <div>
                {`There are `}
                <span className={styles.highlite}>{apiUserData.length}</span>
                {` people at your organisation registered for `}
                <a
                  href="https://core.ac.uk/services/api"
                  target="_blank"
                  rel="noreferrer"
                >
                  CORE API
                </a>
              </div>
            }
            subDescription={content.accessUsers.subTitle}
            userData={apiUserData}
            toggleShowFullList={toggleApiList}
            showFullList={showFullApiList}
          />
        </div>
        <div className={styles.dataSetAccess}>
          <AccessUsers
            title={content.accessDataUsers.title}
            subTitle={
              <div>
                {`There are `}
                <span className={styles.highlite}>
                  {datasetUserData.length}
                </span>
                {` people at your organisation registered for `}
                <a
                  href="https://core.ac.uk/services/dataset"
                  target="_blank"
                  rel="noreferrer"
                >
                  CORE Dataset
                </a>
              </div>
            }
            subDescription={content.accessDataUsers.subTitle}
            userData={datasetUserData}
            toggleShowFullList={toggleDatasetList}
            showFullList={showFullDatasetList}
          />
        </div>
        <ChangePassword
          className={styles.section}
          email={userEmail}
          tag="section"
        />
      </Tag>
    )
  }
)

export default GeneralPageTemplate
