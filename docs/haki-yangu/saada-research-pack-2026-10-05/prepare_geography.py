"""Read NBS DBF attributes; preserve codes, source projection and unresolved currency."""
import collections, hashlib, json, struct
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def main():
    directory=ROOT/'structured-data'/'nbs-2022-wards'
    file=next(directory.glob('*.dbf'));data=file.read_bytes()
    count=struct.unpack_from('<I',data,4)[0];header,length=struct.unpack_from('<HH',data,8)
    encoding=next(directory.glob('*.cpg')).read_text().strip();assert encoding=='UTF-8'
    fields=[]
    for offset in range(32,header-1,32):
        field=data[offset:offset+32]
        if field[0]==13:break
        fields.append(dict(name=field[:11].split(b'\0')[0].decode('ascii'),type=chr(field[11]),length=field[16],decimalPlaces=field[17]))
    assert sum(f['length'] for f in fields)+1==length
    assert len(data)>=header+count*length
    rows=[];deleted=0
    for index in range(count):
        record=data[header+index*length:header+(index+1)*length]
        if record[0]==ord('*'):deleted+=1;continue
        assert record[0]==ord(' ')
        offset=1;row={}
        for f in fields:
            row[f['name']]=record[offset:offset+f['length']].decode('utf-8').strip();offset+=f['length']
        row['researchRecordId']='NBS2022-ROW-'+str(index+1)
        row['candidateAdministrativeKey']='/'.join(row[f] for f in ['reg_code','dist_code','counc_code','ward_code'])
        rows.append(row)
    keys=collections.Counter(r['candidateAdministrativeKey'] for r in rows)
    missing=[r['researchRecordId'] for r in rows if any(not r[f] for f in ['reg_code','reg_name','dist_code','dist_name','ward_code','ward_name'])]
    regions=sorted(set((r['reg_code'],r['reg_name']) for r in rows))
    projection=next(directory.glob('*.prj')).read_text().strip()
    output=dict(sourceId='GEO-NBS-WARDS-2022',status='derived_attributes_for_review',sourceAttributeFile=str(file.relative_to(ROOT)),sourceSha256=hashlib.sha256(data).hexdigest(),sourceEncoding=encoding,sourceProjectionWKT=projection,codePolicy='All original fields remain strings; preserve leading zeroes. Research row IDs are not approved app place IDs. Composite code semantics must be confirmed with NBS.',coordinatesDerived=False,productionEligible=False,currentBoundariesVerified=False,licenceReview='unresolved',records=rows)
    (ROOT/'structured-data'/'nbs-2022-ward-attributes-review.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    qa=dict(sourceRecordCount=count,extractedRecordCount=len(rows),deletedRecordsSkipped=deleted,fieldCount=len(fields),fields=fields,regionCount=len(regions),regions=[dict(code=c,name=n) for c,n in regions],candidateKeyDuplicates={k:v for k,v in keys.items() if v>1},recordsMissingCoreFields=missing,projectionConflict='NBS overview webpage describes Arc1960; this acquired2022 ZIP .prj specifies WGS1984 World Mercator in metres. Do not use webpage projection for this file.',productionEligible=False,notValidated=['Current2026 administrative boundaries','Legal service catchment areas','Code semantics and official unique IDs','Polygon topology and GIS coordinate transformations','Reuse permissions'])
    (ROOT/'structured-data'/'geography-validation-review.json').write_text(json.dumps(qa,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:qa[k] for k in ['sourceRecordCount','extractedRecordCount','regionCount','candidateKeyDuplicates','recordsMissingCoreFields']}))
if __name__=='__main__':main()
