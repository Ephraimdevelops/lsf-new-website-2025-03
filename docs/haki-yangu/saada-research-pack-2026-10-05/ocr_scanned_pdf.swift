// Read-only OCR using Apple's installed PDFKit and Vision frameworks.
// Never changes source PDFs or marks OCR text as a verified transcription.
import Foundation
import PDFKit
import AppKit
import Vision

let args = CommandLine.arguments
guard args.count >= 3, let document = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
    fputs("Usage: ocr_scanned_pdf input.pdf output.json [page-limit]\n", stderr)
    exit(1)
}
let limit = args.count > 3 ? min(Int(args[3]) ?? document.pageCount, document.pageCount) : document.pageCount
var pages: [[String: Any]] = []
for index in 0..<limit {
    let result: [String: Any] = try autoreleasepool {
        guard let page = document.page(at: index) else { return ["page":index+1,"error":"missing_page"] }
        let bounds = page.bounds(for: .mediaBox)
        let width: CGFloat = 1800
        let image = page.thumbnail(of: NSSize(width:width,height:width*bounds.height/bounds.width), for:.mediaBox)
        var rect = CGRect(origin:.zero,size:image.size)
        guard let cg = image.cgImage(forProposedRect:&rect,context:nil,hints:nil) else {
            return ["page":index+1,"error":"render_failed"]
        }
        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate
        request.recognitionLanguages = ["en-US"]
        request.usesLanguageCorrection = true
        let handler = VNImageRequestHandler(cgImage:cg,options:[:])
        try handler.perform([request])
        let observations = (request.results ?? []).sorted {
            if abs($0.boundingBox.midY-$1.boundingBox.midY)<0.008 { return $0.boundingBox.minX < $1.boundingBox.minX }
            return $0.boundingBox.midY > $1.boundingBox.midY
        }
        let lines = observations.compactMap { $0.topCandidates(1).first }
        return ["page":index+1,"text":lines.map { $0.string }.joined(separator:"\n"),
                "lineCount":lines.count,"lowConfidenceLineCount":lines.filter { $0.confidence<0.8 }.count,
                "meanLineConfidence":lines.isEmpty ? 0 : lines.reduce(0) { $0 + Double($1.confidence) } / Double(lines.count)]
    }
    pages.append(result)
    print("OCR page \(index+1)/\(limit)")
    fflush(stdout)
}
let output: [String:Any] = ["engine":"Apple Vision VNRecognizeTextRequest","recognitionLanguage":"en-US",
                          "sourceFile":args[1],"sourcePDFPageCount":document.pageCount,"pages":pages,
                          "status":"machine_ocr_unverified","productionEligible":false]
let data = try JSONSerialization.data(withJSONObject:output,options:[.prettyPrinted,.sortedKeys])
try data.write(to:URL(fileURLWithPath:args[2]))
