# Updating the weekly agenda

Each file in `content/weeks/` controls one expandable week on `agenda.html`.

1. Edit the front matter for the week: Japanese and English titles, date, `publish_at`, formula, image, and `prepare_en`.
2. Edit the Markdown sections for `Prepare`, `In class`, and `Materials`. Keep an English translation in parentheses at the end of every `In class` bullet.
3. Use material types to keep the student view organised: `primary` for Tsumura's 2026 lecture deck, `homework` / `homework-answer` for Tsumura exercises, `worksheet` / `answer` / `data` for other work files, and `yoh` for supplementary archive slides.
4. Refresh the website, then commit and publish. The agenda reads these Markdown files directly; there is no build step.

`publish_at` uses Japan time, for example:

```yaml
publish_at: 2026-10-14T09:00:00+09:00
```

Before that time, students see the week title but not its focus or resource cards. This is a presentation lock: the Markdown file is still part of the published website. For a strict pre-release lock later, keep the future file outside the published folder until its release date, or use scheduled publishing.
