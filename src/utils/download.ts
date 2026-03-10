import axios from 'axios';
import { toast } from 'sonner';

/**
 * Force follows a download link by fetching the blob via axios
 * This helps bypass browser "preview" behavior for PDFs and images
 */
export const forceDownload = async (url: string, filename: string) => {
    const isRelative = url.startsWith('/') || !url.startsWith('http');

    // For relative paths or static assets, a simple anchor tag is usually more reliable
    // and avoids CORS issues with Axios.
    if (isRelative) {
        try {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        } catch (err) {
            console.error('Simple download failed, trying axios fallback', err);
        }
    }

    const toastId = toast.loading(`Preparing download: ${filename}...`);

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    toast.loading(`Downloading ${filename}: ${percentCompleted}%`, { id: toastId });
                } else {
                    toast.loading(`Downloading ${filename}...`, { id: toastId });
                }
            },
        });

        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        toast.success(`Downloaded: ${filename}`, { id: toastId });
    } catch (error) {
        console.error('Axios download failed:', error);

        // Ultimate fallback: just open in new tab if programmatic download fails
        try {
            toast.info('Programmatic download failed, opening in new tab...', { id: toastId });
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (fallbackError) {
            toast.error('Could not download file. Please try right-clicking and "Save Link As".', { id: toastId });
        }
    }
};
