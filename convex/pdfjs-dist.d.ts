declare module "pdfjs-dist/build/pdf.min.mjs" {
  const pdfjs: {
    GlobalWorkerOptions: { workerSrc?: string };
    getDocument(args: { data: Uint8Array }): {
      promise: Promise<{
        numPages: number;
        getPage(pageNumber: number): Promise<{
          getTextContent(): Promise<{ items: Array<{ str?: string }> }>;
        }>;
      }>;
    };
  };

  export = pdfjs;
}
