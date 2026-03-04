import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button, Input, Spin } from 'antd';
import {DeleteFilled, DownOutlined, LoadingOutlined} from '@ant-design/icons';
import classNames from 'classnames';
import { CrPaper } from '@components/common/CrPapper/CrPapper.tsx';
import Markdown from '@components/common/Markdown/Markdown';
import notificationText from '@features/Settings/texts';
import { useSets, type SetItem } from '../hooks/useSets';
import '../styles.css';

const MAX_DISPLAY_LENGTH = 110;
const DISPLAY_LIMIT = 3;

export const Sets: React.FC<{ className?: string }> = ({ className }) => {
  const {
    enabledList,
    wholeSetData,
    loadingSets,
    loadingWholeSets,
    enableSet,
    deleteSet,
    triggerFetchAvailable,
    dataProviderId,
  } = useSets();

  const [selectedItem, setSelectedItem] = useState<SetItem | null>(null);
  const [setNameDisplay, setSetNameDisplay] = useState<Record<number, string>>({});
  const [isEditing, setIsEditing] = useState<Record<number, boolean>>({});
  const [showFullList, setShowFullList] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenDropdown = useCallback(() => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    if (willOpen) {
      triggerFetchAvailable();
    }
  }, [isOpen, triggerFetchAvailable]);

  const handleSelect = useCallback((item: SetItem) => {
    setSelectedItem(item);
    setInputValue(item.setName);
    setIsOpen(false);
  }, []);

  const handleAddClick = useCallback(async () => {
    if (!selectedItem || !dataProviderId) return;

    try {
      setIsAdding(true);
      await enableSet({
        providerId: dataProviderId,
        setSpec: selectedItem.setSpec,
        setName: selectedItem.setName,
        setNameDisplay: selectedItem.setNameDisplay,
      });
      setSelectedItem(null);
      setInputValue('');
    } catch (error) {
      console.error('Error enabling set:', error);
    } finally {
      setIsAdding(false);
    }
  }, [selectedItem, dataProviderId, enableSet]);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        setDeletingId(id);
        await deleteSet(id);
      } catch (error) {
        console.error('Error deleting set:', error);
      } finally {
        setDeletingId(null);
      }
    },
    [deleteSet]
  );

  const handleInputChange = useCallback((id: number, value: string) => {
    setSetNameDisplay((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const handleEditClick = useCallback((id: number) => {
    setIsEditing((prev) => ({
      ...prev,
      [id]: true,
    }));
  }, []);

  const handleSaveClick = useCallback(
    async (item: SetItem) => {
      const id = item.id;
      if (!dataProviderId || id == null) return;

      const displayName = setNameDisplay[id] ?? item.setNameDisplay;

      try {
        await enableSet({
          providerId: dataProviderId,
          id,
          setSpec: item.setSpec,
          setName: item.setName,
          setNameDisplay: displayName,
        });
        setIsEditing((prev) => ({
          ...prev,
          [id]: false,
        }));
      } catch (error) {
        console.error('Error updating set display name:', error);
      }
    },
    [dataProviderId, setNameDisplay, enableSet]
  );

  const truncate = (str: string, max: number) =>
    str.length > max ? `${str.substring(0, max)}...` : str;

  const enabledListWithId = enabledList.filter(
    (item): item is SetItem & { id: number } => item.id != null
  );
  const displayAllSets = showFullList
    ? enabledListWithId
    : enabledListWithId.slice(0, DISPLAY_LIMIT);
  const filteredData = wholeSetData.filter((item) =>
    item.setName.toLowerCase().includes(inputValue.toLowerCase())
  );

  if (!dataProviderId) {
    return null;
  }

  return (
    <CrPaper
      className={classNames('access-users-section', className)}
      data-testid="sets-section"
    >
      <div className="header-wrapper">
        <h2 className="header-wrapper-title">{notificationText.sets.title}</h2>
      </div>
      <Markdown className="description">{notificationText.sets.description}</Markdown>

      <div className="form-wrapper">
        <div className="form-inner-wrapper">
          <div>
            {loadingSets ? (
              <p className="loading">Loading sets...</p>
            ) : (
              <>
                {displayAllSets.map((item) => (
                  <div key={item.id} className="set-main-item">
                    <div className="set-outer-header">
                      <div className="set-outer-content">
                        <div className="set-inner-header">
                          <Input
                            value={
                              setNameDisplay[item.id] ??
                              item.setNameDisplay ??
                              item.setName
                            }
                            onChange={(e) =>
                              handleInputChange(item.id, e.target.value)
                            }
                            className="set-inner-field"
                            disabled={!isEditing[item.id]}
                            aria-label="Set display name"
                          />
                          {!isEditing[item.id] ? (
                            <Button
                              type="link"
                              onClick={() => handleEditClick(item.id)}
                              className="set-button"
                              aria-label="Change set display name"
                            >
                              <span className="set-button-text">
                                Change set display name
                              </span>
                            </Button>
                          ) : (
                            <Button
                              type="link"
                              size="small"
                              onClick={() => handleSaveClick(item)}
                              className="set-button"
                              aria-label="Save set display name"
                            >
                              <span className="set-button-text">Save</span>
                            </Button>
                          )}
                        </div>
                        <div>
                          <div className="set-wrapper">
                            <div className="set-title">setName</div>
                            <span className="set-item">
                              {truncate(item.setName, MAX_DISPLAY_LENGTH)}
                            </span>
                          </div>
                          <div className="set-wrapper">
                            <div className="set-title">setSpec</div>
                            <span className="set-item">
                              {truncate(item.setSpec, MAX_DISPLAY_LENGTH)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="remove-wrapper">
                        {deletingId === item.id ? (
                          <div className="wrapper">
                            <Spin  indicator={<LoadingOutlined spin />} size="small" />
                          </div>
                        ) : (
                          <Button
                            type="text"
                            icon={<DeleteFilled />}
                            onClick={() => handleDelete(item.id)}
                            aria-label={`Remove set ${item.setName}`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {enabledListWithId.length > DISPLAY_LIMIT && (
                  <Button
                    type="default"
                    className="show-btn"
                    onClick={() => setShowFullList(!showFullList)}
                  >
                    {showFullList ? 'Show Less' : 'Show More'}
                  </Button>
                )}
              </>
            )}
          </div>
          <div ref={dropdownRef}>
            <div className="select-form-wrapper">
              <div className="select-wrapper">
                <div
                  className="select-input"
                  onClick={handleOpenDropdown}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenDropdown();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Add new set"
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                >
                  <Input
                    placeholder="Add new set"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={handleOpenDropdown}
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Add new set"
                  />
                  <DownOutlined className="repository-settings-logo" />
                </div>
              </div>
              <Button
                type="primary"
                onClick={handleAddClick}
                disabled={!selectedItem || isAdding}
                loading={isAdding}
                className="add-btn"
                aria-label="Add set"
              >
                Add
              </Button>
              {isOpen && (
                <div
                  className="dropdown-menu"
                  role="listbox"
                  aria-label="Available sets"
                >
                  {loadingWholeSets ? (
                    <p className="loading">Loading...</p>
                  ) : (
                    <ul>
                      {filteredData.map((item, index) => (
                        <li
                          key={item.id ?? item.setSpec ?? index}
                          role="option"
                          tabIndex={0}
                          className="select-item"
                          onClick={() => handleSelect(item)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelect(item);
                            }
                          }}
                          aria-selected={selectedItem?.id === item.id}
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
      </div>
    </CrPaper>
  );
};
