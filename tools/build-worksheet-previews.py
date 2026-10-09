"""Export read-only HTML previews of student worksheets listed in the agenda."""
from pathlib import Path
import re
import os
import html as html_module
import shutil
import subprocess
import tempfile
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
files = sorted({
    path for page in (ROOT / "content/weeks").glob("*.md")
    for path in re.findall(r"\]\(([^\n]+\.xlsx)\) \{worksheet\}", page.read_text())
})
output = ROOT / "assets/worksheet-previews"
output.mkdir(parents=True, exist_ok=True)
for relative in files:
    source = ROOT / relative
    number = re.match(r"weeks/(\d{2})-", relative)
    if not number or re.search(r"解答|answer|課題", relative, re.I):
        raise ValueError(f"Not a student AL worksheet: {relative}")
    with zipfile.ZipFile(source) as workbook:
        sheets = ET.fromstring(workbook.read("xl/workbook.xml")).findall("m:sheets/m:sheet", NS)
        if any(re.search(r"解答|answer", sheet.get("name", ""), re.I) or sheet.get("state", "visible") != "visible" for sheet in sheets):
            raise ValueError(f"Review hidden/answer sheets before export: {relative}")
    with tempfile.TemporaryDirectory(prefix="statsb-worksheet-") as temporary:
        # HTML keeps long questions and large datasets scrollable without print clipping.
        export_filter = 'html:HTML (StarCalc)'
        subprocess.run(["soffice", "--headless", "--convert-to", export_filter, "--outdir", temporary, str(source)], check=True, env={**os.environ, "FONTCONFIG_FILE": str(ROOT / "tools/worksheet-fonts.conf")})
        result = Path(temporary) / f"{source.stem}.html"
        if not result.exists():
            raise RuntimeError(f"HTML export failed: {relative}")
        destination = output / f"w{number[1]}"
        destination.mkdir(exist_ok=True)
        for asset in Path(temporary).iterdir():
            if asset.is_file():
                shutil.copyfile(asset, destination / ('index.html' if asset == result else asset.name))
        html = (destination / 'index.html').read_text()
        def question_row(match):
            row = match.group(0)
            cells = re.findall(r'<td\b[^>]*>.*?</td>', row, re.S)
            texts = [html_module.unescape(re.sub(r'<[^>]+>', '', cell)).strip() for cell in cells]
            if len(cells) > 1 and len(texts[0]) > 25 and not any(texts[1:]) and 'border-' not in row:
                columns = sum(int(re.search(r'colspan="?(\d+)', cell).group(1)) if re.search(r'colspan="?(\d+)', cell) else 1 for cell in cells)
                first = re.sub(r'\scolspan="?\d+"?', '', cells[0])
                first = first.replace('<td ', f'<td colspan="{columns}" ', 1)
                return '<tr>' + first + '</tr>'
            return row
        html = re.sub(r'<tr\b[^>]*>.*?</tr>', question_row, html, flags=re.S)
        html = re.sub(r'<comment\b[^>]*>.*?</comment>', '', html, flags=re.S)
        style = '<style>body{margin:24px;font-family:Arial,"Hiragino Sans",sans-serif;background:#fff;color:#292820}table{margin:20px 0;border-collapse:collapse}td,th{white-space:normal!important;overflow-wrap:break-word;min-width:60px;padding:5px;max-width:900px}a{color:#246f65}img{max-width:100%;height:auto}</style>'
        (destination / 'index.html').write_text(html.replace('</head>', style + '<link rel="stylesheet" href="../../worksheet-preview.css"></head>'))
        print(f"{relative} -> {destination.relative_to(ROOT)}")
