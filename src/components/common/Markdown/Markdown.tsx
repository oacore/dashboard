import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import './styles.css'

interface MarkdownLinkProps {
    href?: string;
    title?: string;
    children?: React.ReactNode;
}

const MarkdownLink: React.FC<MarkdownLinkProps> = ({ href, title, children }) => {
    if (!href) return <span>{children}</span>;

    const props: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
        href,
        title,
        className: 'markdown-link'
    }

    try {
        const isExternal = new URL(href, window.location.origin).origin !== window.location.origin
        if (isExternal) {
            Object.assign(props, {
                target: '_blank',
                rel: 'noopener noreferrer',
            })
        }
    } catch {
        // If URL parsing fails, treat as internal link
    }

    return <a {...props}>{children}</a>
}

interface MarkdownProps {
    children: React.ReactNode;
    className?: string;
}

const Markdown: React.FC<MarkdownProps> = ({ children, className, ...markdownProps }) => {
    const content = typeof children === 'string' ? children : String(children ?? '');

    return (
        <div className={className}>
            <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                    a: MarkdownLink,
                }}
                {...markdownProps}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default Markdown
