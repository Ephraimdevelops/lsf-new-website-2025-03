import { useState, useRef, useCallback } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { toast } from 'sonner';

interface DownloadState {
    progress: number;
    isDownloading: boolean;
    isPaused: boolean;
    error: string | null;
    downloadUrl: string | null;
    filename: string | null;
}

export const useFileDownloader = () => {
    const [downloadState, setDownloadState] = useState<DownloadState>({
        progress: 0,
        isDownloading: false,
        isPaused: false,
        error: null,
        downloadUrl: null,
        filename: null,
    });

    const cancelTokenSource = useRef<CancelTokenSource | null>(null);
    const downloadedChunks = useRef<Blob[]>([]);
    const totalLength = useRef<number>(0);
    const downloadedLength = useRef<number>(0);

    const startDownload = useCallback(async (url: string, filename: string, append = false) => {
        try {
            if (!append) {
                setDownloadState({
                    progress: 0,
                    isDownloading: true,
                    isPaused: false,
                    error: null,
                    downloadUrl: url,
                    filename: filename,
                });
                downloadedChunks.current = [];
                downloadedLength.current = 0;
                totalLength.current = 0;
            } else {
                setDownloadState(prev => ({
                    ...prev,
                    isDownloading: true,
                    isPaused: false,
                    error: null,
                }));
            }

            cancelTokenSource.current = axios.CancelToken.source();

            const headers: any = {};
            if (append && downloadedLength.current > 0) {
                headers['Range'] = `bytes=${downloadedLength.current}-`;
            }

            const response = await axios({
                url,
                method: 'GET',
                responseType: 'blob',
                cancelToken: cancelTokenSource.current.token,
                headers,
                onDownloadProgress: (progressEvent) => {
                    if (!totalLength.current && progressEvent.total) {
                        // For range requests, the total might refer just to the remaining part
                        // We need to carefully handle true file size.
                        // If we get a range response (206), total is the chunk size. 
                        // We'll calculate progress loosely based on total length if available.
                    }

                    let currentTotal = progressEvent.total;

                    // Try to handle range request totals
                    if (append && currentTotal) {
                        currentTotal += downloadedLength.current;
                    } else if (!totalLength.current && progressEvent.total) {
                        totalLength.current = progressEvent.total;
                        currentTotal = progressEvent.total;
                    }

                    const loaded = (append ? downloadedLength.current : 0) + progressEvent.loaded;

                    if (currentTotal) {
                        const percentCompleted = Math.round((loaded * 100) / currentTotal);
                        setDownloadState(prev => ({ ...prev, progress: percentCompleted }));
                    }
                },
            });

            downloadedChunks.current.push(response.data);
            downloadedLength.current += response.data.size;

            // Completion
            const finalBlob = new Blob(downloadedChunks.current);
            const blobUrl = window.URL.createObjectURL(finalBlob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', filename || 'document.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            toast.success(`Download complete: ${filename}`);
            setDownloadState(prev => ({ ...prev, isDownloading: false, progress: 100 }));

        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Download canceled/paused:', error.message);
            } else {
                console.error('Download failed:', error);
                setDownloadState(prev => ({
                    ...prev,
                    isDownloading: false,
                    isPaused: false,
                    error: 'Download failed. Please try again.',
                }));
                toast.error(`Failed to download ${filename}.`);

                // Fallback for CORS or completely failed requests
                if (!append) {
                    try {
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = filename;
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast.success(`Download initiated in new tab: ${filename}`);
                    } catch (fallbackError) {
                        console.error('Fallback failed:', fallbackError);
                    }
                }
            }
        }
    }, []);

    const pauseDownload = useCallback(() => {
        if (cancelTokenSource.current) {
            cancelTokenSource.current.cancel('Download paused by user');
            setDownloadState(prev => ({ ...prev, isDownloading: false, isPaused: true }));
        }
    }, []);

    const resumeDownload = useCallback(() => {
        const { downloadUrl, filename } = downloadState;
        if (downloadUrl && filename) {
            startDownload(downloadUrl, filename, true);
        }
    }, [downloadState, startDownload]);

    const cancelDownload = useCallback(() => {
        if (cancelTokenSource.current) {
            cancelTokenSource.current.cancel('Download canceled by user');
        }
        setDownloadState({
            progress: 0,
            isDownloading: false,
            isPaused: false,
            error: null,
            downloadUrl: null,
            filename: null,
        });
        downloadedChunks.current = [];
        downloadedLength.current = 0;
        totalLength.current = 0;
    }, []);

    return {
        ...downloadState,
        startDownload,
        pauseDownload,
        resumeDownload,
        cancelDownload,
    };
};
