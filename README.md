# The Wandering Fairy Author Website

Static author website for `The Wandering Fairy`, with an early 2000s personal-site mood and modern responsive code.

## Run

Open `index.html` in a browser, or serve the folder locally:

```powershell
npm run dev
```

Then visit `http://127.0.0.1:4173`.

## Edit Content

Editable content now lives in a few small JSON files so Pages CMS is easier to use:

- `content/site.json` for author info, links, latest-publication fallback, and progress bars
- `content/books.json` for books
- `content/gallery.json` for gallery items
- `content/posts.json` for blog posts

This means the author can add a new book or blog post in Pages CMS without digging through one giant content file.

- Add a book in `content/books.json` with `title`, `coverImage`, `series`, `description`, `status`, and `links`.
- Add a progress bar in `content/site.json` under `projects`.
- Add gallery art in `content/gallery.json` with `title`, `image`, `alt`, `artist`, `category`, and optional credit fields.
- Add a blog post in `content/posts.json` with `slug`, `title`, `date`, `featuredImage`, `tags`, `excerpt`, and `content`.

Replace newsletter copy, author bio, email, and social links in `content/site.json`. The Amazon and Royal Road URLs are already wired into `links`.

## Pages CMS

This repo includes `.pages.yml` for Pages CMS. After the site is on GitHub, connect the repository at `https://pagescms.org/`; editors will see separate CMS sections for site settings, books, gallery, and blog posts.

The CMS media folder is now `images/web/`, so uploaded art and covers can be selected directly inside the editor. Use web-sized JPG or PNG files here; very large originals can fail on GitHub and Pages CMS.

For GitHub Pages, keep the project as static files. The site loads the JSON content files directly in the browser.

## Newsletter

GitHub Pages cannot store email signups by itself. This site is wired for MailerLite embedded forms.

In MailerLite, create an Embedded form, open its embed code, and copy the form `action` URL. It usually looks like:

```text
https://assets.mailerlite.com/jsonp/ACCOUNT_ID/forms/FORM_ID/subscribe
```

Paste that URL into `links.newsletterEndpoint` in `content/site.json` through Pages CMS. Keep `links.newsletterProvider` set to `mailerlite`.

## Updating Progress

There are two different kinds of progress:

- Latest published chapter: while running `node server.js`, the site checks Royal Road through `/api/latest-chapter` and updates the visible latest-chapter card.
- Static fallback: run `node update-latest-chapter.js` to refresh `latest-chapter.json` for deployments without the Node server.
- GitHub Pages auto update: `.github/workflows/update-latest-chapter.yml` runs `npm run update:latest` every 6 hours and commits `latest-chapter.json` when Royal Road has a newer chapter. The `Open` button on the Latest Published card uses that JSON URL.
- Writing/editing progress bars: edit `projects` in `content/site.json`. Those are manual because Royal Road cannot know the author's private draft progress.

The published progress bar uses estimated total chapters so it can move 40%, 41%, 42%, and so on as chapters publish. The current estimate is `plannedChapters: 750`; change that number in `app.js`, `server.js`, and `update-latest-chapter.js` if the author expects a different total.

## Notes

The newsletter form is ready for a MailerLite embedded form action URL. The contact form is still frontend-only until a contact/email endpoint is added.
