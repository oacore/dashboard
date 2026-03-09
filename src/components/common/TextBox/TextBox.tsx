import classNames from 'classnames';
import { Button } from 'antd';
import { Markdown } from '@core/core-ui';
import './styles.css';

interface TextBoxProps {
  className?: string;
  description: string;
  buttonCaption: string;
  buttonUrl?: string;
  onClick?: () => void;
}

const TextBox: React.FC<TextBoxProps> = ({
  className,
  description,
  buttonCaption,
  buttonUrl,
  onClick,
}) => (
  <div className={classNames('text-box', className)}>
    <Markdown className="text-box-text">{description}</Markdown>
    <div className="text-box-button">
      <Button
        type="default"
        onClick={onClick ?? undefined}
        href={buttonUrl ?? undefined}
      >
        {buttonCaption}
      </Button>
    </div>
  </div>
);

export default TextBox;
