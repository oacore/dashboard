import { TextData } from '@features/Orcid/texts/index.ts';
import {Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

export const OrcidProcessingNotice = () => (
    <div className="orcid-processing-notice" role="status">
        <Spin className="orcid-processing-notice-spin" indicator={<LoadingOutlined spin />} />
        <p className="orcid-processing-notice-text">{TextData.processingMessage}</p>
    </div>
);
