/** Server-side text extraction using PDF.js's Node-compatible build. */
export async function extractPdfText(data: Uint8Array): Promise<string> {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = "pdfjs-dist/legacy/build/pdf.worker.mjs";
    const document = await pdfjs.getDocument({ data, isEvalSupported: false }).promise;
    let text = "";
    try {
        for (let number = 1; number <= document.numPages; number++) {
            const page = await document.getPage(number);
            const content = await page.getTextContent();
            text += content.items.map(item => "str" in item ? item.str : "").join(" ") + "\n";
            page.cleanup();
        }
        return text;
    } finally { await document.destroy(); }
}
