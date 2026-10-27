// Creates a raster-backed searchable DERIVATIVE; originals remain untouched.
// OCR is machine output requiring independent visual/legal review before approval.
import Foundation
import PDFKit
import AppKit
import Vision
import CoreText
import ImageIO
let args=CommandLine.arguments
guard args.count==4,let doc=PDFDocument(url:URL(fileURLWithPath:args[1])) else {fatalError("Usage: input.pdf derivative.pdf receipt.json")}
let output=URL(fileURLWithPath:args[2]);guard let consumer=CGDataConsumer(url:output as CFURL),let context=CGContext(consumer:consumer,mediaBox:nil,[kCGPDFContextTitle as String:"Unverified OCR indexing derivative",kCGPDFContextCreator as String:"Haki Yangu research preparation; independent review required"] as CFDictionary) else {fatalError("PDF output unavailable")}
var receipts:[[String:Any]]=[]
for index in 0..<doc.pageCount {
 let receipt:[String:Any]=try autoreleasepool {
  guard let page=doc.page(at:index) else {throw NSError(domain:"Missing page",code:index)}
  let bounds=page.bounds(for:.mediaBox),width:CGFloat=1800
  let image=page.thumbnail(of:NSSize(width:width,height:width*bounds.height/bounds.width),for:.mediaBox)
  var imageRect=CGRect(origin:.zero,size:image.size)
  guard let cg=image.cgImage(forProposedRect:&imageRect,context:nil,hints:nil) else {throw NSError(domain:"Render failed",code:index)}
  let request=VNRecognizeTextRequest();request.recognitionLevel = .accurate;request.recognitionLanguages=["en-US"];request.usesLanguageCorrection=false
  try VNImageRequestHandler(cgImage:cg,options:[:]).perform([request])
  let lines=(request.results ?? []).sorted {abs($0.boundingBox.midY-$1.boundingBox.midY)<0.008 ? $0.boundingBox.minX<$1.boundingBox.minX : $0.boundingBox.midY>$1.boundingBox.midY}
  var media=CGRect(x:0,y:0,width:bounds.width,height:bounds.height)
  context.beginPDFPage([kCGPDFContextMediaBox as String:Data(bytes:&media,count:MemoryLayout<CGRect>.size)] as CFDictionary)
  // Re-encode the page image to reduce oversized image-only originals.
  let bitmap=NSBitmapImageRep(cgImage:cg)
  guard let jpeg=bitmap.representation(using:.jpeg,properties:[.compressionFactor:0.82]),let source=CGImageSourceCreateWithData(jpeg as CFData,nil),let raster=CGImageSourceCreateImageAtIndex(source,0,nil) else {throw NSError(domain:"JPEG render failed",code:index)}
  context.draw(raster,in:media)
  context.saveGState();context.setTextDrawingMode(.invisible);context.textMatrix = .identity
  var texts:[String]=[],lowConfidence=0
  for line in lines {
   guard let candidate=line.topCandidates(1).first else {continue}
   let box=line.boundingBox;let font=CTFontCreateWithName("Helvetica" as CFString,max(5,bounds.height*box.height*0.8),nil)
   let attributes=[NSAttributedString.Key(kCTFontAttributeName as String):font]
   let text=CTLineCreateWithAttributedString(NSAttributedString(string:candidate.string,attributes:attributes))
   context.textPosition=CGPoint(x:box.minX*media.width,y:box.minY*media.height)
   CTLineDraw(text,context);texts.append(candidate.string);if(candidate.confidence<0.8){lowConfidence+=1}
  }
  context.restoreGState();context.endPDFPage()
  return ["page":index+1,"text":texts.joined(separator:"\n"),"lines":texts.count,"lowConfidenceLines":lowConfidence]
 }
 receipts.append(receipt);print("Prepared OCR page \(index+1)/\(doc.pageCount)");fflush(stdout)
}
context.closePDF()
let receipt:[String:Any]=["sourceFile":args[1],"derivativeFile":args[2],"pageCount":doc.pageCount,"ocrEngine":"Apple Vision accurate en-US, correction disabled","status":"machine_ocr_requires_independent_visual_review","productionEligible":false,"pages":receipts]
try JSONSerialization.data(withJSONObject:receipt,options:[.prettyPrinted,.sortedKeys]).write(to:URL(fileURLWithPath:args[3]))
