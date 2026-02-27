export const forceDownload = async (url: string, filename: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Failed to download file directly, falling back to new tab:', error);
        // Fallback if CORS or network issues prevent blob fetching
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'document.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
