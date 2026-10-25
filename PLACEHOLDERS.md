# What's left to fill in

Find any remaining placeholder in the code with:

```bash
grep -rn PLACEHOLDER src
```

## Content
- [ ] **Gallery photos**: `src/data/photos.ts` (4 placeholder entries; put images in `public/assets/photos/`).
- [ ] **Ongoing projects**: add to `src/data/now.ts` (and to `projects.ts` once there's a repo). Planned ideas live in `src/data/ideas.ts`.
- [ ] **AI Toolkit**: review `src/data/uses.ts` and delete anything you couldn't talk about in an interview.

## Accounts (`.env`, see `.env.example`)
- [ ] `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: optional (page views, post reactions, visitor count).
- [ ] Giscus `repoId` / `categoryId` in `src/data/site.ts`: optional blog comments.

## Images
- [ ] Optional 1200×630 link-preview image (`DEFAULT_OG_IMAGE` in `og-meta.config.ts`; your photo is used for now).

## Template leftovers
Old template content and unused code were moved to `template-leftovers/` (git-ignored). Delete it whenever you like.
