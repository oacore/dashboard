import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button } from '@oacore/design/lib/elements'

import { GlobalContext } from '../../../store'
import styles from '../styles.module.css'
import texts from '../../../texts/fresh-finds/fresh-finds.yml'
import { Card } from '../../../design'
import Tablev2 from '../../../components/tablev2/tablev2'
import Table from '../../../components/table'
import link from '../../../components/upload/assets/link.svg'
import kababMenu from '../../../components/upload/assets/kebabMenu.svg'
import Menu from '../../../components/menu'
import ExportButton from '../../../components/export-button'
import TableLoading from '../../../components/tableLoading'
import Accordion from '../cards/accordion'

const FreshFindsTable = observer(
  ({ getFreshFindsData, freshFindsData, freshFindsDataLoading }) => {
    const { ...globalStore } = useContext(GlobalContext)
    const menuRef = useRef(null)
    const [visibleMenu, setVisibleMenu] = useState(false)
    const [selectedRowData, setSelectedRowData] = useState(null)
    const [page, setPage] = useState(0)
    const [freshData, setFreshData] = useState([])
    const [localSearchTerm, setLocalSearchTerm] = useState('')
    const [accordionData, setAccordionData] = useState('')

    const freshFindsArr = Object.values(
      globalStore.dataProvider.freshFindsData
    ).filter((value) => typeof value === 'object')

    useEffect(() => {
      getFreshFindsData(globalStore.dataProvider.id)
    }, [globalStore.dataProvider.id])

    const handleClick = (e, rowDetail) => {
      e.preventDefault()
      e.stopPropagation()
      setSelectedRowData(rowDetail)
      setVisibleMenu(!visibleMenu)
    }

    const fetchData = () => {
      setPage(page + 1)
    }

    const handleDoiRedirect = (e, doi) => {
      e.stopPropagation()
      window.open(`https://dx.doi.org/${doi}`, '_blank')
    }

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target))
          setVisibleMenu(false)
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [menuRef])

    useEffect(() => {
      const startIndex = page * 10
      const endIndex = Math.min(startIndex + 10, freshFindsArr.length)
      const freshRecords = [
        ...freshData,
        ...freshFindsArr.slice(startIndex, endIndex),
      ]
      setFreshData(freshRecords)
    }, [page, freshFindsData])

    const search = (data, searchTerm) => {
      const lowerSearchTerm = searchTerm.toLowerCase()
      return data.filter((item) => {
        const authors = item?.affiliation_info
          ?.map((info) => info.author_name.toLowerCase())
          .join(', ')
        const doi = item.DOI ? item.DOI.toLowerCase() : ''
        return (
          authors.includes(lowerSearchTerm) || doi.includes(lowerSearchTerm)
        )
      })
    }

    const searchChange = (event) => {
      const searchTerm = event.target.value
      setLocalSearchTerm(searchTerm)
      const filteredData = search(freshFindsArr, searchTerm)
      setFreshData(filteredData)
    }

    const onSetActiveArticle = (row) => {
      setAccordionData(row)
    }

    return (
      <Card className={styles.freshTableWrapper} id="freshTable">
        <Card.Title tag="h2">{texts.table.title}</Card.Title>
        <div
          className={styles.itemCountIndicator}
        >{`Papers we discovered elsewhere authored by ${globalStore.dataProvider.name} you might consider adding to your repository`}</div>
        {freshFindsDataLoading ? (
          <TableLoading />
        ) : (
          <Tablev2
            rowClick={(row) => onSetActiveArticle(row)}
            className={styles.freshTable}
            data={freshData}
            size={freshData?.length}
            totalLength={freshFindsArr?.length}
            fetchData={fetchData}
            isHeaderClickable
            searchable
            localSearch
            localSearchTerm={localSearchTerm}
            searchChange={searchChange}
            details={<Accordion article={accordionData} />}
          >
            <Table.Column
              id="authors"
              display="Authors"
              className={styles.authorsColumn}
              getter={(v) => {
                if (v?.affiliation_info) {
                  const authorNames = v.affiliation_info
                    .map((info) => info.author_name)
                    .join(', ')
                  return <span>{authorNames}</span>
                }
                return '-'
              }}
            />
            <Table.Column
              id="doi"
              display="DOI"
              getter={(v) => {
                if (v.DOI) {
                  return (
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                    <span
                      onClick={(e) => handleDoiRedirect(e, v.DOI)}
                      className={styles.doiCell}
                    >
                      <img src={link} alt="link" />
                      {v.DOI}
                    </span>
                  )
                }
                return '-'
              }}
              className={styles.doiColumn}
            />
            <Table.Column
              id="actions"
              getter={(v) => (
                <div className={styles.actionButtonWrapper}>
                  <Button
                    className={styles.actionButtonPure}
                    onClick={(e) => handleClick(e, v)}
                  >
                    <img src={kababMenu} alt="kababMenu" />
                  </Button>
                  <Menu
                    ref={menuRef}
                    visible={visibleMenu && selectedRowData === v}
                    className={styles.menuButton}
                    stopPropagation
                  >
                    {Object.values(texts.actions).map(({ title, key }) => (
                      <Menu.Item key={key} target="_blank">
                        <div className={styles.togglerTitle}>{title}</div>
                      </Menu.Item>
                    ))}
                  </Menu>
                </div>
              )}
            />
            <Table.Action>
              <ExportButton href="">download csv</ExportButton>
            </Table.Action>
          </Tablev2>
        )}
      </Card>
    )
  }
)

export default FreshFindsTable
