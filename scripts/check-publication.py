#!/usr/bin/env python3
"""Check the exact staged publication set. No private-source discovery or upload."""
import hashlib,io,json,re,subprocess,sys,xml.etree.ElementTree as ET,zipfile

def blob(path):
    return subprocess.check_output(['git','show',':'+path])
manifest=json.loads(blob('publication-manifest.json'))
allowed=set(manifest['files'])
tracked=set(subprocess.check_output(['git','ls-files','-z']).decode().split('\0'))-{''}
errors=[]
private=re.compile(r'(^|/)(admin|other materials?|archive|textbook)(/|$)|解答|正答|模範|answer.?key|solution.?key|\.DS_Store$|(^|/)~\$',re.I)
for path in sorted(tracked):
    if path not in allowed: errors.append('Not approved for publication: '+path)
    if private.search(path): errors.append('Private path is tracked: '+path)
for path in sorted(allowed-tracked): errors.append('Approved file missing from index: '+path)
for path,expected in {**manifest['reviewedStudentWorksheets'],**manifest['studentEditionPdfs']}.items():
    if path not in tracked:continue
    if hashlib.sha256(blob(path)).hexdigest()!=expected:
        errors.append('Student material changed; review for answers before approving its new hash: '+path)
for path in sorted(p for p in tracked if p.endswith('.xlsx')):
    if path not in manifest['reviewedStudentWorksheets']: errors.append('Unreviewed workbook: '+path);continue
    with zipfile.ZipFile(io.BytesIO(blob(path))) as z:
        xml=ET.fromstring(z.read('xl/workbook.xml'));ns={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for sheet in xml.findall('s:sheets/s:sheet',ns):
            if sheet.get('state','visible')!='visible' or re.search('解答|正答|模範|answer|solution',sheet.get('name',''),re.I):
                errors.append('Hidden or answer worksheet: '+path)
for path in sorted(p for p in tracked if p.startswith('content/weeks/') and p.endswith('.md')):
    for ref in re.findall(r'\]\(([^\n]+)\)\s*\{',blob(path).decode()):
        if ref.startswith(('https://','http://')):continue
        target=ref.split('?',1)[0].split('#',1)[0]
        if target not in allowed: errors.append('Course link points outside published files: '+target)
if errors:
    print('\n'.join(errors),file=sys.stderr);sys.exit(1)
print(f'Publication check passed: {len(tracked)} approved files; {len(manifest["reviewedStudentWorksheets"])} reviewed student workbooks; no private folders tracked.')
