import { uploadWithDeadline } from "./uploadDeadline";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

export async function uploadEvidence(url: string, file: { uri: string; mimeType: string; size: number }, progress: (percent: number) => void): Promise<string> {
  let status: number;
  let body: string;
  if (Platform.OS !== "web") {
    const info = await FileSystem.getInfoAsync(file.uri);
    if (!info.exists || info.size <= 0 || info.size > 10 * 1024 * 1024) throw new Error("File unavailable or exceeds 10 MB. Please select it again.");
    const task = FileSystem.createUploadTask(url, file.uri, { httpMethod: "POST", uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT, headers: { "Content-Type": file.mimeType } }, event => progress(Math.min(99, Math.round(event.totalBytesSent / Math.max(1, event.totalBytesExpectedToSend) * 100))));
    const result = await uploadWithDeadline(task);
    if (!result) throw new Error("Upload interrupted");
    status = result.status; body = result.body;
  } else {
    const blob = await (await fetch(file.uri)).blob();
    if (!blob.size || blob.size > 10 * 1024 * 1024) throw new Error("File must be between 1 byte and 10 MB");
    const result = await new Promise<{ status: number; body: string }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url); xhr.setRequestHeader("Content-Type", file.mimeType); xhr.timeout = 120000;
      xhr.upload.onprogress = event => { if (event.lengthComputable) progress(Math.min(99, Math.round(event.loaded / event.total * 100))); };
      xhr.onload = () => resolve({ status: xhr.status, body: xhr.responseText });
      xhr.onerror = xhr.ontimeout = () => reject(new Error("Upload failed. Check your connection and retry."));
      xhr.send(blob);
    });
    status = result.status; body = result.body;
  }
  if (status < 200 || status >= 300) throw new Error("Upload failed. Please retry.");
  const result = JSON.parse(body) as { storageId?: string };
  if (typeof result.storageId !== "string" || !result.storageId.trim() || result.storageId.length > 100) throw new Error("Upload response is incomplete");
  return result.storageId;
}
