# Public course files

This repository contains the published course website, its runtime assets, approved lecture PDFs/presentations, and reviewed blank student worksheets. Local archives, administrative material, textbook scans, authoring sources, tests and assignment answer keys are private.

`publication-manifest.json` is the exact allowlist. `.gitignore` denies all other files. Enable the local publication check with `git config core.hooksPath .githooks`; GitHub Actions repeats the check. Add a new published output deliberately to both the manifest and ignore exceptions after reviewing it. Do not broadly add private folders or use forced adds to bypass this policy.

Student worksheet downloads and the student editions of AL decks have reviewed hashes. A changed worksheet or protected deck must be reviewed again before updating its hash. The AL PDFs omit homework-answer/explanation pages; their editable instructor originals remain local.

Practice questions and worked examples intentionally taught during lectures remain published. A browser calculator is a teaching tool, not an assignment answer key. Homework-specific cell answers must never be embedded in a PDF, spreadsheet, preview, script, note or image.

Removing files from the latest branch does not erase historical commits, forks or cached GitHub views. Any history purge must be coordinated separately; never claim that `.gitignore` or a normal removal commit deletes past exposure.
