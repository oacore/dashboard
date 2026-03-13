type Props = {
    imgUrl: string;
    code: string;
    isSquare?: boolean;
};

export function BadgeRow({ imgUrl, code, isSquare }: Props) {
    return (
        <div className="badgeRow">
            <div className="badgeLeft">
                <img
                    src={imgUrl}
                    alt="CORE badge"
                    className={`badgeImg ${isSquare ? 'badgeImg--square' : ''}`}
                />
            </div>

            <div className="badgeDivider" />

            <div className="badgeRight">
                <code className="badgeCode">{code}</code>
            </div>
        </div>
    );
}