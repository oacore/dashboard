export const formatFairResultName = (name: string): string => {
  const formattedName = name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

  if (!formattedName) {
    return formattedName;
  }

  return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
};
