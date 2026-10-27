"""Build the small offline picker catalogue from NBS's 2022 ward DBF (pyshp required)."""
import hashlib
import io
import json
from pathlib import Path
import sys
import zipfile

import shapefile

archive = Path(sys.argv[1])
with zipfile.ZipFile(archive) as source:
    reader = shapefile.Reader(dbf=io.BytesIO(source.read("TANZANIA_2022PHC_WARDS_SHAPEFILES.dbf")))
    districts = {}
    for record in reader.iterRecords():
        row = record.as_dict()
        districts.setdefault(row["reg_name"].strip(), set()).add(row["dist_name"].strip())

assert len(districts) == 31, "Expected all mainland and Zanzibar regions"
assert all(values and all(values) for values in districts.values())
result = {
    "source": "https://www.nbs.go.tz/uploads/statistics/documents/en-1714652282-TANZANIA_2022PHC_WARD_SHAPEFILES.zip",
    "catalogue": "https://www.nbs.go.tz/statistics/topic/gis",
    "vintage": "2022 census; published 2024",
    "archiveSha256": hashlib.sha256(archive.read_bytes()).hexdigest(),
    "districtsByRegion": {region: sorted(values) for region, values in sorted(districts.items())},
}
target = Path(__file__).resolve().parents[1] / "mobile/src/data/tanzania-districts.json"
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(result, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
print(f"Generated {len(districts)} regions, {sum(map(len, districts.values()))} districts; {target.stat().st_size} bytes")
