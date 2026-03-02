import { Button } from 'antd';
import "../styles.css";
import validatorData from "../texts";
import type { ValidateCardProps } from '../types';
import { Input } from 'antd';

export const ValidateCard: React.FC<ValidateCardProps> = ({
  handleValidateClick,
  handleTextareaChange,
  recordValue,
}) => {
  const { TextArea } = Input;

  return (
    <article className="content">
      <h2 className="content-title">{validatorData.validator.validator.title}</h2>
      <div className="validator-sub-title-wrapper">
        <p className="sub-title">
          {validatorData.validator.validator.subTitle.title}
        </p>
        <div className="validator-action-wrapper">
          {Object.values(validatorData.validator.validator.subTitle.actions).map(
            (item, index) => (
              <Button
                key={index}
                onClick={() => {
                  handleTextareaChange(item.value);
                }}
                className="link-button"
              >
                {item.text}
              </Button>
            ),
          )}
        </div>
      </div>
      <TextArea rows={10}
                className="text-field"
                placeholder="Put your data here"
                value={recordValue}
                onChange={(event) => handleTextareaChange(event.target.value)}/>
      <div className="input-button">
        <Button className="validation-button" type="primary" onClick={handleValidateClick}>
          {validatorData.validator.validator.action}
        </Button>
      </div>
    </article>
  );
};

