import React, { useEffect, useRef, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Button, Icon } from '@oacore/design/lib/elements'
import { Carousel } from '@oacore/design/lib'

import styles from '../styles.module.css'
import ShowMoreText from '../../../components/showMore'
import info from '../../../components/upload/assets/info.svg'
import oai from '../../../components/upload/assets/oai.svg'
import carouselArrowRight from '../../../components/upload/assets/carouselArrowRight.svg'
import carouselArrowLeft from '../../../components/upload/assets/carouselArrowLeft.svg'
import redirect from '../../../components/upload/assets/redirect.svg'
import { Message } from '../../../design'
import texts from '../../../texts/deduplication/deduplication.yml'
import Markdown from '../../../components/markdown'
import TogglePanel from '../../../components/toggle-panel/togglePanel'
import Actions from '../../../components/actions'
import ActionModal from './tableActionModal'
import togglerArrow from '../../../components/upload/assets/togglerArrow.svg'
import check from '../../../components/upload/assets/check.svg'

const generatedTitle = [
  <div className={styles.metadataTitle}>Metadata title</div>,
  <div className={styles.mainTitle}>Title</div>,
  <div className={styles.authorTitle}>Author</div>,
  <div className={styles.columnItemTitle}>Type</div>,
  <div className={styles.columnItemTitle}>Field of study</div>,
  <div className={styles.columnItemTitle}>DOI</div>,
  <img src={oai} alt="oai" />,
  'Publication date',
  'Deposited date',
  <div className={styles.abstractTitle}>Abstract</div>,
  <div>Version</div>,
  <div />,
]
const CompareCard = ({
  worksDataInfo,
  outputsDataInfo,
  updateWork,
  getDeduplicationInfo,
}) => {
  const modalContent = texts.comparison.modalData
  const [modifiedWorksData, setModifiedWorksData] = useState([])
  const [currentModalData, setCurrentModalData] = useState()
  const [activeButtons, setActiveButtons] = useState(() => {
    const storedActiveButtons = localStorage.getItem('activeButtons')
    return storedActiveButtons ? JSON.parse(storedActiveButtons) : {}
  })
  const [selectedTypes, setSelectedTypes] = useState(() => {
    const storedSelectedTypes = localStorage.getItem('selectedTypes')
    return storedSelectedTypes ? JSON.parse(storedSelectedTypes) : {}
  })
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupContent, setPopupContent] = useState('')

  const popupRef = useRef(null)

  useEffect(() => {
    const generatedData = [
      worksDataInfo?.data?.authors?.map((author) => author.name).join(', '),
      worksDataInfo?.data?.documentType,
      worksDataInfo?.data?.fieldOfStudy,
      worksDataInfo?.data?.doi,
      worksDataInfo?.data?.oaiIds,
      worksDataInfo?.data?.publishedDate,
      worksDataInfo?.data?.depositedDate,
      worksDataInfo?.data?.abstract,
    ]
    setModifiedWorksData(generatedData)
  }, [worksDataInfo?.data])

  const handleWorksRedirect = (id) => {
    window.open(`https://core.ac.uk/works/${id}`, '_blank')
  }

  const handleOutputsRedirect = (id) => {
    window.open(`https://core.ac.uk/outputs/${id}`, '_blank')
  }

  const handleRepositoryRedirect = (oaiId) => {
    window.open(`${process.env.IDP_URL}/oai/${oaiId}`, '_blank')
  }

  const handleModalOpen = (id, index) => {
    const clickedItem = outputsDataInfo.find((item) => item.data.id === id)
    setCurrentModalData({ ...modalContent[index], id: clickedItem.data.id })
    document.body.classList.add('modal-open')
    document.body.style.overflow = 'hidden'
  }
  const handleModalClose = () => {
    setCurrentModalData(null)
    document.body.classList.remove('modal-open')
    document.body.style.overflow = 'auto'
  }

  const handleModalConfirm = (modalData) => {
    handleModalClose()
    const updatedActiveButtons = {
      ...activeButtons,
      [modalData.id]: modalData.type,
    }
    setActiveButtons(updatedActiveButtons)
    localStorage.setItem('activeButtons', JSON.stringify(updatedActiveButtons))

    if (Object.keys(updatedActiveButtons).length > 0) {
      setSelectedTypes((prevSelectedTypes) => {
        const updatedSelectedTypes = { ...prevSelectedTypes }
        delete updatedSelectedTypes[modalData.id]
        return updatedSelectedTypes
      })
      localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes))
    }
  }

  const handleTypeSave = async (workId, outputId, type) => {
    await updateWork(workId, outputId, type)
    await getDeduplicationInfo(workId, outputId, type)

    setActiveButtons((prevActiveButtons) => {
      const updatedActiveButtons = { ...prevActiveButtons }
      delete updatedActiveButtons[outputId]
      return updatedActiveButtons
    })
    localStorage.setItem('activeButtons', JSON.stringify(activeButtons))

    setSelectedTypes((prevSelectedTypes) => ({
      ...prevSelectedTypes,
      [outputId]: type,
    }))
    localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes))
  }

  const isMatching = (value, arrayIndex) =>
    value?.toLowerCase() &&
    modifiedWorksData[arrayIndex]?.includes(value?.toLowerCase())

  useEffect(() => {
    localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes))
  }, [selectedTypes])

  useEffect(() => {
    localStorage.setItem('activeButtons', JSON.stringify(activeButtons))
  }, [activeButtons])

  function findTitlesBySelectedTypes(data, singleType) {
    return data
      .filter((item) => item.type === singleType)
      .map((item) => {
        const title =
          item.title.length > 35 ? `${item.title.slice(0, 35)}...` : item.title
        return title
      })
  }

  const handlePopupOpen = (content) => {
    setIsPopupOpen(true)
    setPopupContent(content)
  }

  const handlePopupClose = () => {
    setIsPopupOpen(false)
    setPopupContent('')
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        isPopupOpen
      )
        handlePopupClose()
    }

    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [isPopupOpen])

  return (
    <div className={styles.compareCardWrapper}>
      <div className={styles.dataTitleWrapper}>
        {generatedTitle?.map((key, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.dataTitle} key={index}>
            {key}
          </div>
        ))}
      </div>
      <section className={styles.carouselWrapper}>
        {currentModalData && (
          <div className={styles.overlay}>
            <ActionModal
              title={currentModalData.title}
              typeText={currentModalData.type}
              description={currentModalData.description}
              options={currentModalData.options}
              buttonConfirm={currentModalData.confirm}
              buttonCancel={currentModalData.cancel}
              itemId={currentModalData.id}
              onConfirm={() => handleModalConfirm(currentModalData)}
              onCancel={handleModalClose}
              updateWork={updateWork}
              getDeduplicationInfo={getDeduplicationInfo}
              worksDataInfo={worksDataInfo}
              outputsDataInfo={outputsDataInfo}
            />
          </div>
        )}
        <Carousel
          draggable
          slidesToShow={3}
          infinite={false}
          autoplay={false}
          prevArrow={
            <div>
              <img
                className={styles.arrowLeft}
                src={carouselArrowLeft}
                alt="carouselArrowLeft"
              />
            </div>
          }
          nextArrow={
            <div>
              <img
                className={styles.arrowRight}
                src={carouselArrowRight}
                alt="carouselArrowRight"
              />
            </div>
          }
        >
          <div className={styles.compareCardLeft}>
            <Message className={styles.referenceTitleLeft}>
              <img className={styles.referenceIcon} src={info} alt="riox" />
              <p className={styles.referenceText}>
                {texts.comparison.referenceTitle}
              </p>
            </Message>
            <div className={styles.compareTitleWrapperLeft}>
              <div className={styles.compareTitle}>
                <ShowMoreText
                  text={worksDataInfo?.data?.title}
                  maxLetters={100}
                />
              </div>
              <div className={styles.redirectButtonWrapper}>
                <Button
                  onClick={() => handleWorksRedirect(worksDataInfo?.data?.id)}
                  className={styles.visibilityIconButton}
                >
                  <Icon src="#eye" className={styles.visibility} />
                  <span>Live in CORE</span>
                </Button>
                <div className={styles.visibilityPlaceHolder} />
              </div>
            </div>
            <div className={styles.itemsWrapper}>
              <div className={styles.itemWrapper}>
                {modifiedWorksData?.map((value, index) => (
                  <div
                    key={value}
                    className={classNames.use(styles.dataItem, {
                      [styles.height]: index === modifiedWorksData.length - 1,
                      [styles.authorHeight]: index === 0,
                      [styles.relativeParent]: Array.isArray(value),
                    })}
                  >
                    {Array.isArray(value) ? (
                      // eslint-disable-next-line max-len
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                      <span
                        className={styles.popupTrigger}
                        onClick={() =>
                          handlePopupOpen(value.slice(1).join(', '))
                        }
                      >
                        {value[0].length > 35
                          ? `${value[0].slice(0, 35)}...`
                          : value[0]}{' '}
                        <span className={styles.count}>
                          +{value.length - 1}
                        </span>
                        {isPopupOpen && (
                          <div className={styles.popup} ref={popupRef}>
                            <div className={styles.popupContent}>
                              {popupContent}
                            </div>
                            <Button
                              className={styles.closeButton}
                              variant="outlined"
                              onClick={(event) => {
                                event.stopPropagation()
                                handlePopupClose()
                              }}
                            >
                              Close
                            </Button>
                          </div>
                        )}
                      </span>
                    ) : (
                      <ShowMoreText
                        text={value}
                        maxLetters={
                          index === modifiedWorksData.length - 1 ? 150 : 50
                        }
                      />
                    )}
                  </div>
                ))}
                <div className={styles.dataItem}>
                  {texts.comparison.version}
                </div>
                <Markdown className={styles.dataItemReference}>
                  {texts.comparison.reference}
                </Markdown>
              </div>
            </div>
          </div>
          {outputsDataInfo.map((item) => (
            <div className={styles.compareCardRight}>
              <Message className={styles.referenceTitle}>
                <img className={styles.referenceIcon} src={info} alt="riox" />
                <div className={styles.referenceText}>
                  {texts.comparison.compareItem}
                  <span className={styles.oaiTitle}>
                    OAI {item?.data?.oai.split(':').pop()}
                  </span>
                </div>
              </Message>
              <div className={styles.compareTitleWrapper}>
                <div className={styles.compareTitle}>
                  <ShowMoreText text={item?.data?.title} maxLetters={100} />
                </div>
                <div className={styles.redirectButtonWrapper}>
                  <Button
                    onClick={() => handleOutputsRedirect(item?.data?.id)}
                    className={styles.visibilityIconButton}
                  >
                    <Icon src="#eye" className={styles.visibility} />
                    <span>Live in CORE</span>
                  </Button>
                  <Button
                    onClick={() => handleRepositoryRedirect(item?.data?.oai)}
                    className={styles.visibilityIconButton}
                  >
                    <img
                      src={redirect}
                      alt="redirect"
                      className={styles.redirectImg}
                    />
                    <span>Open in the repository</span>
                  </Button>
                </div>
              </div>
              <div>
                <div
                  className={classNames.use(styles.dataItemAuthors, {
                    [styles.matched]: !isMatching(
                      item?.data?.authors
                        ?.map((author) => author.name)
                        .join(', '),
                      0
                    ),
                  })}
                >
                  <ShowMoreText
                    text={item?.data?.authors
                      ?.map((author) => author.name)
                      .join(', ')}
                    maxLetters={50}
                  />
                </div>
                <div
                  className={classNames.use(styles.outputItem, {
                    [styles.matched]: !isMatching(item?.data?.documentType, 1),
                  })}
                >
                  <ShowMoreText
                    text={item?.data?.documentType}
                    maxLetters={50}
                  />
                </div>
                <div
                  className={classNames.use(styles.outputItem, {
                    [styles.matched]: !isMatching(item?.data?.fieldOfStudy, 2),
                  })}
                >
                  <ShowMoreText
                    text={item?.data?.fieldOfStudy}
                    maxLetters={50}
                  />
                </div>
                <div
                  className={classNames.use(styles.outputItem, {
                    [styles.matched]: !isMatching(item?.data?.doi, 3),
                  })}
                >
                  <ShowMoreText text={item?.data?.doi} maxLetters={50} />
                </div>
                <div
                  className={classNames.use(styles.outputItem, {
                    [styles.matched]: !isMatching(item?.data?.oai, 4),
                  })}
                >
                  <ShowMoreText text={item?.data?.oai} maxLetters={50} />
                </div>
                <div
                  className={classNames.use(styles.outputItem, {
                    [styles.matched]: !isMatching(item?.data?.publishedDate, 5),
                  })}
                >
                  <ShowMoreText
                    text={item?.data?.publishedDate}
                    maxLetters={50}
                  />
                </div>
                <div
                  className={classNames.use(styles.outputItem, {
                    [styles.matched]: !isMatching(item?.data?.depositedDate, 6),
                  })}
                >
                  <ShowMoreText
                    text={item?.data?.depositedDate}
                    maxLetters={50}
                  />
                </div>
                <div
                  className={classNames.use(styles.heightOutput, {
                    [styles.matched]: !isMatching(item?.data?.abstract, 7),
                  })}
                >
                  <ShowMoreText text={item?.data?.abstract} maxLetters={150} />
                </div>
                <TogglePanel
                  title={
                    <div
                      className={classNames.use(styles.togglePanelTitle, {
                        [styles.togglePanelTitleActive]:
                          selectedTypes[item?.data.id],
                      })}
                    >
                      {selectedTypes[item?.data.id]
                        ? findTitlesBySelectedTypes(
                            Object.values(
                              texts.comparison.toggleVersion[0]?.options
                            ),
                            selectedTypes[item?.data.id]
                          )
                        : 'Please indicate the version of articles:'}
                      {selectedTypes[item?.data.id] ? (
                        <img src={check} alt="check" />
                      ) : (
                        <div className={styles.svgWrapper}>
                          <img src={togglerArrow} alt="togglerArrow" />
                        </div>
                      )}
                    </div>
                  }
                  className={styles.actionButtonPannel}
                  content={
                    <div className={styles.actionButtons}>
                      {Object.values(
                        texts.comparison.toggleVersion[0]?.options
                      ).map((option) => (
                        // eslint-disable-next-line max-len
                        // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
                        <div
                          onClick={() =>
                            handleTypeSave(
                              worksDataInfo?.data?.id,
                              item?.data.id,
                              option.type
                            )
                          }
                          className={classNames.use(styles.optionButton, {
                            [styles.clicked]:
                              selectedTypes[item?.data.id] === option.type,
                          })}
                        >
                          <div>{option.title}</div>
                        </div>
                      ))}
                    </div>
                  }
                />
                <TogglePanel
                  title={
                    <div
                      className={classNames.use(styles.togglePanelTitle, {
                        [styles.togglePanelTitleActive]:
                          activeButtons[item.data.id],
                      })}
                    >
                      {activeButtons[item.data.id]
                        ? findTitlesBySelectedTypes(
                            Object.values(modalContent),
                            activeButtons[item.data.id]
                          )
                        : 'Mark this paper as'}
                      {activeButtons[item.data.id] ? (
                        <img src={check} alt="check" />
                      ) : (
                        <div className={styles.svgWrapper}>
                          <img src={togglerArrow} alt="togglerArrow" />
                        </div>
                      )}
                    </div>
                  }
                  content={
                    <div className={styles.actionButtons}>
                      {Object.values(texts.comparison.toggleButtons).map(
                        (button, index) => (
                          // eslint-disable-next-line max-len
                          // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
                          <div
                            onClick={() => handleModalOpen(item.data.id, index)}
                            className={classNames.use(styles.actionButton, {
                              [styles.clicked]:
                                activeButtons[item.data.id] === button.type,
                            })}
                          >
                            <div>{button.title}</div>
                            <Actions
                              className={styles.actionIcon}
                              description={button.info}
                            />
                          </div>
                        )
                      )}
                    </div>
                  }
                />
              </div>
            </div>
          ))}
        </Carousel>
      </section>
    </div>
  )
}

export default CompareCard
