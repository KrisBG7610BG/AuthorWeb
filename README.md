# The Wandering Fairy Author Website

Static author website for `The Wandering Fairy`, with an early 2000s personal-site mood and modern responsive code.

## Run

Open `index.html` in a browser, or serve the folder locally:

```powershell
npm run dev
```

Then visit `http://127.0.0.1:4173`.

## Edit Content

Editable content lives in `content/site.json`. Pages CMS uses `.pages.yml` to expose that file in a friendly editor.

- Edit the novel: update `books` with `title`, `series`, `description`, `status`, and `links`.
- Add a progress bar: add an object to `projects` with `name`, `percent`, `phase`, and `note`.
- Add gallery art: add an object to `gallery` with `title`, `artist`, `category`, and `credit`.
- Add a blog post: add an object to `posts` with `slug`, `title`, `date`, `author`, `tags`, `excerpt`, and `content`.

Replace newsletter copy, author bio, email, and social links in `content/site.json`. The Amazon and Royal Road URLs are already wired into `links`.

## Pages CMS

This repo includes `.pages.yml` for Pages CMS. After the site is on GitHub, connect the repository at `https://pagescms.org/`; editors can update `content/site.json` through the CMS and commit changes back to GitHub.

For GitHub Pages, keep the project as static files. The site loads `content/site.json` in the browser.

## Newsletter

GitHub Pages cannot store email signups by itself. To make the mailing list collect real emails, create a form endpoint with a provider such as Formspree, Buttondown, ConvertKit, Mailchimp, or Resend, then paste that URL into `links.newsletterEndpoint` in `content/site.json` through Pages CMS.

The newsletter form posts JSON with:

```json
{
  "email": "reader@example.com",
  "source": "Frozen Over The Moon author website"
}
```

## Updating Progress

There are two different kinds of progress:

- Latest published chapter: while running `node server.js`, the site checks Royal Road through `/api/latest-chapter` and updates the visible latest-chapter card.
- Static fallback: run `node update-latest-chapter.js` to refresh `latest-chapter.json` for deployments without the Node server.
- GitHub Pages auto update: `.github/workflows/update-latest-chapter.yml` runs `npm run update:latest` every 6 hours and commits `latest-chapter.json` when Royal Road has a newer chapter. The `Open` button on the Latest Published card uses that JSON URL.
- Writing/editing progress bars: edit `projects` in `content/site.json`. Those are manual because Royal Road cannot know the author's private draft progress.

The published progress bar uses estimated total chapters so it can move 40%, 41%, 42%, and so on as chapters publish. The current estimate is `plannedChapters: 750`; change that number in `app.js`, `server.js`, and `update-latest-chapter.js` if the author expects a different total.

## Notes

The newsletter form is ready to send to a configured provider endpoint. The contact form is still frontend-only until a contact/email endpoint is added.
