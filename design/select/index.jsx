import React, { useEffect, useState, useRef, useCallback } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

import { TextField } from 'design'

// TODO: Taken from @oacore/design
const generateId = () => Math.random().toString(36).substr(2, 9)

const KEYS = {
  ESC: 27,
  ENTER: 13,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
}

// TODO: Consider converting it to class component
const Select = ({
  onSelectionChange,
  value,
  options,
  className,
  disabled = false,
  label,
  tag: Tag = 'div',
  id = generateId(),
}) => {
  const inputRef = useRef(null)
  const [clickedElement, setClickedElement] = useState(null)
  const selectMenuRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, toggleShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState({})
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const handleMouseUp = useCallback((event) => {
    if (inputRef.current && inputRef.current.contains(event.target)) return
    setClickedElement(null)
    toggleShowSuggestions(false)
    setActiveSuggestion({})
  }, [])

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [])

  const handleKeyDown = (event) => {
    let pos =
      suggestions.findIndex((s) => s.id === activeSuggestion.id) ||
      suggestions.length
    let direction = 1
    let suggestion = {}

    switch (event.which) {
      case KEYS.ESC:
        inputRef.current.blur()
        toggleShowSuggestions(false)
        break

      case KEYS.ENTER:
        event.preventDefault()
        event.stopPropagation()
        if (activeSuggestion.id !== undefined)
          onSelectionChange(activeSuggestion)

        inputRef.current.blur()
        break

      case KEYS.UP:
      case KEYS.DOWN:
        event.preventDefault()
        event.stopPropagation()
        if (suggestions.length === 0) return

        if (activeSuggestion.id === undefined) {
          // eslint-disable-next-line prefer-destructuring
          suggestion = suggestions[0]
          setActiveSuggestion(suggestion)
        } else {
          direction = event.which - KEYS.DOWN + 1 // either -1 or 1
          pos = (pos + direction) % suggestions.length
          suggestion = suggestions[pos]
          setActiveSuggestion(suggestion)
        }

        selectMenuRef.current
          .querySelector(`#suggestion-result-${id}-${suggestion.id}`)
          .scrollIntoView(false)
        break
      default:
    }
  }

  useEffect(() => {
    const suggest = async () => {
      setLoading(true)
      const s = await options(searchTerm)
      setSuggestions(s)
      setLoading(false)
    }
    suggest()
  }, [searchTerm])

  return (
    <Tag className={classNames.use(styles.selectWrapper, className)}>
      {!disabled && (
        <>
          <div className="sr-only" aria-live="assertive">
            {showSuggestions &&
            suggestions.length &&
            document.activeElement === inputRef.current
              ? `${suggestions.length} suggestions found, to navigate use up and down arrows`
              : ''}
          </div>
          <TextField
            ref={inputRef}
            id={`select-${id}`}
            className={styles.input}
            type="text"
            placeholder="Search..."
            autoComplete="off"
            role="combobox"
            aria-label="Select repository"
            aria-expanded={showSuggestions && suggestions.length}
            aria-owns="suggestion-results"
            aria-autocomplete="both"
            aria-controls={`suggestion-results-${id}`}
            aria-activedescendant={
              showSuggestions && activeSuggestion
                ? `suggestion-result-${id}-${activeSuggestion.id}`
                : undefined
            }
            value={searchTerm}
            onFocus={() => {
              setSearchTerm('')
              toggleShowSuggestions(true)
            }}
            onBlur={(event) => {
              const { relatedTarget: el } = event
              if (
                clickedElement === null &&
                !(el && el.dataset.selectId === id)
              )
                toggleShowSuggestions(false)
            }}
            onChange={(event) => {
              setSearchTerm(event.target.value)
            }}
            onKeyDown={handleKeyDown}
            label={label}
          />
        </>
      )}
      <div className={classNames.use(styles.inputContainer)}>{value}</div>
      {!disabled && (
        <ul
          id={`suggestion-results-${id}`}
          className={classNames.use(styles.selectMenu, {
            [styles.show]: showSuggestions && suggestions.length,
          })}
          role="listbox"
          ref={selectMenuRef}
        >
          {loading && <li>Loading</li>}
          {!loading &&
            suggestions.map((s) => (
              <SelectOption
                id={`suggestion-result-${id}-${s.id}`}
                key={s.id}
                value={s.id}
                data-select-id={id}
                onMouseDown={() => {
                  // Firefox and Safari have relatedTarget null.
                  // Therefore we cannot use onClick event
                  // since it's not getting fired
                  // because onBlur input listener cause rerender.
                  setClickedElement(s.id)
                }}
                onMouseUp={(event) => {
                  if (clickedElement === s.id) {
                    onSelectionChange(s.id)
                    toggleShowSuggestions(false)
                  }
                  setClickedElement(null)
                  event.stopPropagation()
                }}
                selected={s.id === activeSuggestion.id}
              >
                {s.name}
              </SelectOption>
            ))}
        </ul>
      )}
    </Tag>
  )
}

const SelectOption = ({ id, children, value, selected, ...restProps }) => (
  <li
    id={id}
    role="option"
    aria-selected={selected}
    className={classNames.use({
      [styles.optionSelected]: selected,
    })}
  >
    <button type="button" value={value} tabIndex="-1" {...restProps}>
      {children}
    </button>
  </li>
)

export default Select
