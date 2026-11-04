# Student-facing attribution

- Do not add retrospective references such as “Yohの2025年講義”, “from Yoh’s 2025 slides”, or “Yoh 2025” to slides, activities, captions, or resource labels. Present the material directly.
- Keep useful classroom-model assumptions, textbook references, and required source or license credits.
- Preserve existing archive filenames and link paths; a historical year in a storage path is not a student-facing attribution.
- Teaching notes should teach the material directly, without commentary referring to Tsumura's slides or slide numbers. Keep useful textbook references.

# Worked exercise answers

- Pair every exercise answer with a graphic or chart that explains the result, in addition to the given values, symbolic formula, substitution, and solution. Use a follow-up visual slide when the calculation slide would become crowded.
- Highlight the outcomes included in the probability. For expected value and variance, show the distribution and mark its mean. Label any tail aggregation, approximation, and table rounding.

# Bilingual statistical terminology

- Always pair key Japanese statistical terms with their English equivalents in authored lecture slides. Keep Japanese primary and English smaller and visually secondary, using a consistent style across the deck.
- Add book-style hiragana furigana above key Japanese terms using semantic ruby text. Keep readings above their kanji, leave okurigana unannotated, and keep the English equivalent below.
- Keep formulas prominent and story/photo slides uncluttered. Use a shared terminology component and glossary so repeated English labels remain consistent.
- Commit and push completed course updates after each task, excluding unrelated personal files and Finder metadata.

# Publication boundary

- Only publish exact files approved in `publication-manifest.json`; keep its list and `.gitignore` exceptions aligned.
- Never stage admin, other material, archive, textbook, authoring-source or answer-key files, even when a file was historically tracked.
- Keep reviewed blank student worksheets downloadable. Preserve the student-only AL PDFs; do not overwrite them with answer-bearing instructor originals.
- Run `python3 scripts/check-publication.py` against the staged tree before every commit. Changed protected student materials require a fresh answer-content review before changing their approved hash.
- Do not upload authoring sources, audit reports, tests or local private backups. Preserve them locally.
- A normal commit does not remove private files from old history. Obtain approval for any destructive history rewrite, and report the remaining exposure accurately.
