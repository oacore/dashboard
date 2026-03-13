import sortIcon from '@/assets/icons/sort.svg';

export const CrSortIcon = ({ sortOrder }: { sortOrder?: 'ascend' | 'descend' | null }) => {
  const getIconStyle = () => {
    if (sortOrder === 'ascend') {
      return { transform: 'rotate(180deg)' };
    }
    return {};
  };

  return (
    <img
      src={sortIcon}
      alt="sort"
      style={{
        width: '16px',
        height: '16px',
        opacity: sortOrder ? 1 : 0.3,
        transition: 'all 0.05s',
        ...getIconStyle()
      }}
    />
  );
};
