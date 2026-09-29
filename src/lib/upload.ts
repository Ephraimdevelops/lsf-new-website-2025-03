type UploadFileArgs = {
  contentType: string;
  subFolder?: string;
  file: File;
  existingUrl?: string;
};

export async function uploadFile(_args: UploadFileArgs): Promise<string> {
  throw new Error("File upload storage is not configured for this legacy CMS form.");
}
