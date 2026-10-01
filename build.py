#!/usr/bin/env python3
"""
Assemble the site from partials/ and pages/.

    python build.py

Writes the root *.html files, which are what GitHub Pages serves.
Edit pages/<name>.html for page content and partials/ for anything
shared (header, footer, seal, assistant). Never edit the root HTML
files directly — they are overwritten on every build.
"""
import io, re, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent

# Bump on every release. It is appended to the CSS/JS URLs so visitors
# are not left on cached assets after a deploy.
VERSION = 21

# Member portal. Leave empty until the real URL is known; the Login
# button then renders inert and marked pending rather than pointing
# somewhere made up.
MAAKOM_URL = ""

BANNER = """    <!-- ============================================================
         GENERATED FILE — do not edit.
         Edit pages/{name} for this page's content, or partials/ for
         the shared header, footer, seal and assistant, then run:
             python build.py
         ============================================================ -->
"""

def read(p):
    return io.open(p, encoding="utf-8").read()

def partial(name):
    return read(ROOT / "partials" / f"{name}.html")

FRONT = re.compile(r"^<!--\s*(.*?)\s*-->\s*", re.S)

def parse(text):
    meta = {}
    m = FRONT.match(text)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        text = text[m.end():]
    return meta, text

def mark_active(html, active):
    if not active:
        return html
    return re.sub(r'(<a\b[^>]*\bdata-nav="%s"[^>]*?)(\s*>)' % re.escape(active),
                  lambda m: m.group(1) + ' aria-current="page"' + m.group(2), html)

def maakom(html):
    if MAAKOM_URL:
        return html.replace("{{MAAKOM_HREF}}", MAAKOM_URL).replace(
            "{{MAAKOM_ATTRS}}", ' target="_blank" rel="noopener"')
    return html.replace("{{MAAKOM_HREF}}", "#").replace(
        "{{MAAKOM_ATTRS}}", ' aria-disabled="true" data-portal-pending title="Member portal link pending"')

def build():
    head, seal, header = partial("head"), partial("seal"), partial("header")
    mobile, footer, chat = partial("mobile-nav"), partial("footer"), partial("chat")
    lightbox, scripts = partial("lightbox"), partial("scripts")
    pages = sorted((ROOT / "pages").glob("*.html"))
    if not pages:
        sys.exit("no pages/ found")
    for page in pages:
        meta, body = parse(read(page))
        attrs = ""
        if meta.get("title_key"):
            attrs += f' data-title-key="{meta["title_key"]}"'
        if meta.get("desc_key"):
            attrs += f' data-desc-key="{meta["desc_key"]}"'
        h = (head.replace("{{TITLE}}", meta.get("title", "SSCRS"))
                 .replace("{{DESC}}", meta.get("desc", ""))
                 .replace("{{HTML_ATTRS}}", attrs))
        active = meta.get("active", "")
        parts = [
            h,
            BANNER.format(name=page.name),
            seal, "",
            maakom(mark_active(header, active)), "",
            maakom(mark_active(mobile, active)), "",
            '    <main id="main">',
            body.rstrip(),
            "    </main>", "",
            footer, "",
            (lightbox if meta.get("lightbox") == "yes" else "").rstrip(),
            chat, "",
            scripts,
        ]
        out = "\n".join(p for p in parts if p is not None)
        out = out.replace("{{V}}", str(VERSION))
        (ROOT / page.name).write_text(out.rstrip() + "\n", encoding="utf-8")
        print(f"  built {page.name}")

if __name__ == "__main__":
    build()
