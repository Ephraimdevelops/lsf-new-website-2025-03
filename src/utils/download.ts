import axios from 'axios';
import { toast } from 'sonner';

export const forceDownload = async (url: string, filename: string) => {
    const toastId = toast.loading(`Starting download: ${filename}...`);

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    toast.loading(`Downloading ${filename}: ${percentCompleted}%`, {
                        id: toastId,
                    });
                } else {
                    toast.loading(`Downloading ${filename}...`, {
                        id: toastId,
                    });
                }
            },
        });

        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename || 'document.pdf');
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        toast.success(`Download complete: ${filename}`, {
            id: toastId,
        });
    } catch (error) {
        console.error('Download failed:', error);
        toast.error(`Failed to download ${filename}. Please try again.`, {
            id: toastId,
        });

        // Fallback: simple link click if axios/CORS fails
        try {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (fallbackError) {
            console.error('Fallback failed:', fallbackError);
        }
    }
};
