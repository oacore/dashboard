import React, { useState } from 'react';
import classNames from 'classnames';
import '../styles.css';

interface TogglePanelProps {
    className?: string;
    title: React.ReactNode;
    content: React.ReactNode;
}

const TogglePanel: React.FC<TogglePanelProps> = ({ className, title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleTogglePanel = () => {
        setIsOpen((prev) => !prev);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTogglePanel();
        }
    };

    return (
        <div
            className={classNames('toggle-panel', className)}
            onClick={handleTogglePanel}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-label={typeof title === 'string' ? title : 'Toggle panel'}
        >
            {title}
            {isOpen && <div className="toggle-content">{content}</div>}
        </div>
    );
};

export default TogglePanel;
