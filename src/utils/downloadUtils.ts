/**
 * Downloads a file from a URL by creating a temporary anchor element
 * @param url - The URL to download from
 * @param filename - The filename for the downloaded file
 */
export const downloadFile = (url: string, filename: string): void => {
    const link = document.createElement('a');
    link.href = url;
    link.style.display = 'none';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Downloads CSV data with a formatted filename including current date
 * @param url - The URL to download CSV from
 * @param prefix - The prefix for the filename (default: 'data')
 */
export const downloadCsv = (url: string, prefix: string = 'data'): void => {
    const filename = `${prefix}-${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(url, filename);
};
