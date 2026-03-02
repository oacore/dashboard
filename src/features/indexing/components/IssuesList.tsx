import { TypeCard } from './TypeCard';
import '../styles.css';

interface IssueItem {
    actualType: string;
    title: string;
    description?: string;
    resolution?: string;
    outputsAffectedCount: number;
    severity: string;
    hidden?: boolean;
}

interface IssuesListProps {
    typesList: IssueItem[];
    getDownloadUrl: (type: string) => string | undefined;
}

export const IssuesList: React.FC<IssuesListProps> = ({
    typesList,
    getDownloadUrl,
}) => {
    return (
        <>
            {typesList.map(
                ({
                    actualType,
                    title,
                    description,
                    resolution,
                    outputsAffectedCount,
                    severity,
                    hidden,
                }) => (
                    <TypeCard
                        key={actualType}
                        hidden={hidden}
                        issuesList={{
                            downloadUrl: getDownloadUrl(actualType),
                            type: actualType,
                        }}
                        title={title}
                        description={description}
                        resolution={resolution}
                        count={outputsAffectedCount}
                        type={severity[0].toUpperCase() + severity.slice(1).toLowerCase()}
                    />
                )
            )}
        </>
    );
};
