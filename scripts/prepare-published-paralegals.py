"""Extract public LHRC listings into research candidates, never provider accounts."""
import collections
import hashlib
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

class NetworkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.center = None
        self.mode = None
        self.parts = []
        self.cells = []
        self.cell = None
        self.rows = []
        self.centers = []
    def handle_starttag(self, tag, attrs):
        if tag == 'h3':
            self.mode, self.parts = 'heading', []
        elif tag == 'tr':
            self.cells = []
        elif tag in ('td', 'th'):
            self.cell = []
    def handle_data(self, data):
        if self.mode == 'heading':
            self.parts.append(data)
        if self.cell is not None:
            self.cell.append(data)
    def handle_endtag(self, tag):
        if tag == 'h3' and self.mode == 'heading':
            title = ' '.join(''.join(self.parts).split())
            self.center = title if re.match(r'^\d+\.', title) else None
            if self.center:
                self.centers.append(self.center)
            self.mode = None
        elif tag in ('td', 'th') and self.cell is not None:
            self.cells.append(' '.join(''.join(self.cell).split()))
            self.cell = None
        elif tag == 'tr' and self.center and len(self.cells) == 3:
            name, _, phone = self.cells
            if name and name.upper() != 'JINA KAMILI':
                self.rows.append({'sourceCenter': self.center, 'fullName': name, 'phoneAsPublished': phone})

def prepare(source, output):
    p = NetworkParser()
    raw = source.read_bytes()
    p.feed(raw.decode('utf-8'))
    if not p.rows or len(p.centers) != len(set(p.centers)):
        raise ValueError('Missing listings or duplicate center headings: inspect source before importing.')
    by_name, by_phone = collections.defaultdict(set), collections.defaultdict(set)
    for row in p.rows:
        name = ' '.join(re.sub(r'[^\w\s]', '', row['fullName'].casefold()).split())
        phone = re.sub(r'\D', '', row['phoneAsPublished'])
        row['nameKey'], row['phoneDigits'] = name, phone
        by_name[name].add(row['sourceCenter'])
        if phone:
            by_phone[phone].add(name)
    for row in p.rows:
        flags = ['current_role_unconfirmed', 'publication_basis_to_confirm', 'availability_unknown', 'location_requires_confirmation']
        if len(by_name[row['nameKey']]) > 1:
            flags.append('same_name_multiple_centers')
        if len(by_phone[row['phoneDigits']]) > 1:
            flags.append('phone_shared_by_different_names')
        if not re.fullmatch(r'0[67]\d{8}', row['phoneDigits']):
            flags.append('phone_format_requires_review')
        if 'UNREGISTERED' in row['sourceCenter'].upper():
            flags.append('source_labels_center_unregistered')
        key = '|'.join((row['sourceCenter'], row['nameKey'], row['phoneDigits']))
        row.update(candidateId='lhrc-' + hashlib.sha256(key.encode()).hexdigest()[:16], sourceUrl='https://legalaid.humanrights.or.tz/en/paralegals-network', status='research_candidate', publicEligible=False, appAccountCreated=False, flags=flags)
    counts = {'sourceCenters': len(p.centers), 'publishedRows': len(p.rows), 'distinctNamePhonePairs': len({(r['nameKey'], r['phoneDigits']) for r in p.rows}), 'rowsWithCrossCenterNameConflict': sum('same_name_multiple_centers' in r['flags'] for r in p.rows), 'rowsWithSharedPhoneConflict': sum('phone_shared_by_different_names' in r['flags'] for r in p.rows), 'rowsWithPhoneFormatFlag': sum('phone_format_requires_review' in r['flags'] for r in p.rows), 'publishedIntoApp': 0}
    packet = {'checkedOn': '2026-11-15', 'publisher': 'Legal and Human Rights Centre (LHRC)', 'sourceSha256': hashlib.sha256(raw).hexdigest(), 'scope': 'Public source snapshot; not an LSF roster, accreditation, availability or app registration.', 'counts': counts, 'byCenter': dict(collections.Counter(r['sourceCenter'] for r in p.rows)), 'candidates': p.rows}
    output.write_text(json.dumps(packet, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(counts))

if __name__ == '__main__':
    prepare(Path(sys.argv[1]), Path(sys.argv[2]))
