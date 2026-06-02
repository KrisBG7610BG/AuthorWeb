const defaultSiteData = {
  author: {
    name: "Frozen Over The Moon",
    tagline: "Author of The Wandering Fairy, a LitRPG world-hopping fantasy about forbidden knowledge, soul weapons, and strange realms.",
    shortBio:
      "Frozen Over The Moon writes The Wandering Fairy, a Royal Road LitRPG about Soren, world-hopping mysteries, and power systems that keep getting stranger.",
    longBio:
      "Replace this biography with the author's real story. This area is meant for a warm, first-person author note: why The Wandering Fairy exists, what kinds of worlds it explores, and where readers can follow future releases.",
    email: "hello@example.com",
    socials: [
      { label: "Royal Road", url: "https://www.royalroad.com/fiction/94680/the-wandering-fairy-litrpg-world-hopping" },
      { label: "Amazon", url: "https://www.amazon.com/dp/B0GTVT7XG3?ref_=cm_sw_r_ffobk_cp_ud_dp_TS6SGE2W35YMMZR75NYB&bestFormat=true" },
      { label: "Goodreads", url: "https://example.com" },
      { label: "Discord", url: "https://example.com" }
    ]
  },
  links: {
    royalRoad: "https://www.royalroad.com/fiction/94680/the-wandering-fairy-litrpg-world-hopping",
    royalRoadChapter1: "https://www.royalroad.com/fiction/94680/the-wandering-fairy-litrpg-world-hopping/chapter/1822719/chapter-1-enchanted-forest",
    royalRoadChapter105: "https://www.royalroad.com/fiction/94680/the-wandering-fairy-litrpg-world-hopping/chapter/2101357/chapter-105-chronicled-failures",
    amazon: "https://www.amazon.com/dp/B0GTVT7XG3?ref_=cm_sw_r_ffobk_cp_ud_dp_TS6SGE2W35YMMZR75NYB&bestFormat=true",
    newsletterNote: "Occasional updates only. No spam, no cursed chain letters.",
    newsletterEndpoint: ""
  },
  latestPublished: {
    chapter: 301,
    title: "Castle within Castle within Castle",
    volume: "Vol. 4",
    volumeNumber: 4,
    totalVolumes: 10,
    plannedChapters: 750,
    volumeChapter: 30,
    volumePlannedChapters: 130,
    url: "https://www.royalroad.com/fiction/94680/the-wandering-fairy-litrpg-world-hopping/chapter/3472814/chapter-301-castle-within-castle-within-castle",
    checkedAt: "2026-05-31"
  },
  books: [
    {
      title: "The Wandering Fairy: Board of Fate",
      coverLabel: "Board of Fate",
      series: "The Wandering Fairy",
      description: "Soren follows a strange answer across worlds and dimensions, chasing forbidden knowledge through LitRPG systems, mythic powers, and faerie-touched danger.",
      status: "Book 1 available",
      links: [
        { label: "Buy on Amazon", url: "https://www.amazon.com/dp/B0GTVT7XG3?ref_=cm_sw_r_ffobk_cp_ud_dp_TS6SGE2W35YMMZR75NYB&bestFormat=true" },
        { label: "Read on Royal Road", url: "https://www.royalroad.com/fiction/94680/the-wandering-fairy-litrpg-world-hopping" }
      ]
    }
  ],
  projects: [
    { name: "Full Novel", percent: 40, phase: "10 planned volumes", note: "The full story is planned for 10 volumes. The current published arc is Volume 4." }
  ],
  gallery: [
    { title: "Soren's First Stop", artist: "Placeholder Artist", category: "Official artwork", credit: "https://example.com" },
    { title: "The Lands of Fantasia", artist: "Reader Name", category: "Fanart", credit: "https://example.com" },
    { title: "Soul Weapon Study", artist: "Placeholder Artist", category: "Official artwork", credit: "https://example.com" },
    { title: "Faerie Laboratory", artist: "Reader Name", category: "Fanart", credit: "https://example.com" },
    { title: "Board of Fate Cover Placeholder", artist: "Placeholder Artist", category: "Official artwork", credit: "https://example.com" },
    { title: "World-Hopper Sketch", artist: "Reader Name", category: "Fanart", credit: "https://example.com" }
  ],
  posts: [
    {
      slug: "welcome-to-the-new-site",
      title: "Welcome to The Wandering Fairy Home Page",
      date: "2026-05-01",
      author: "Frozen Over The Moon",
      tags: ["site news", "updates"],
      excerpt: "A fresh old-school corner for The Wandering Fairy links, progress notes, art, and reader updates.",
      content: [
        "This is placeholder post content. Replace it with a real launch note, release announcement, or personal update.",
        "The blog structure is local and data-driven for now, which keeps the project simple while leaving room for a CMS later."
      ]
    },
    {
      slug: "where-the-next-arc-stands",
      title: "Where the Next Arc Stands",
      date: "2026-05-12",
      author: "Frozen Over The Moon",
      tags: ["progress", "royal road"],
      excerpt: "A placeholder progress update for the next Royal Road chapter batch or story arc.",
      content: [
        "Use this post for chapter timing, rewrite notes, stub announcements, or arc progress.",
        "The progress page will keep the most useful numbers visible without turning every writing day into a public performance."
      ]
    },
    {
      slug: "fanart-friday",
      title: "Fanart Friday: Fairies, Stars, and Suspicious Rituals",
      date: "2026-05-24",
      author: "Frozen Over The Moon",
      tags: ["fanart", "community"],
      excerpt: "A little gallery update and a reminder to send credit links with every submission.",
      content: [
        "Fanart makes the world feel inhabited by more than one imagination. This post is a placeholder for community highlights.",
        "When adding real art, update the gallery data with title, artist, category, credit link, and alt text."
      ]
    }
  ]
};

let siteData = defaultSiteData;

const routes = {
  "/": renderHome,
  "/books": renderBooks,
  "/progress": renderProgress,
  "/gallery": renderGallery,
  "/blog": renderBlog,
  "/about": renderAbout,
  "/contact": renderContact
};

const main = document.querySelector("#main");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("#site-nav");

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

window.addEventListener("hashchange", renderRoute);
window.addEventListener("DOMContentLoaded", async () => {
  await loadSiteData();
  await loadLatestPublishedData();
  renderRoute();
});

async function loadSiteData() {
  try {
    const response = await fetch("content/site.json", { cache: "no-store" });
    if (!response.ok) return;
    siteData = await response.json();
  } catch {
    siteData = defaultSiteData;
  }
}

async function loadLatestPublishedData() {
  try {
    const latest = await fetchLatestPublished();
    if (latest) siteData.latestPublished = { ...siteData.latestPublished, ...latest };
  } catch {
    // Keep the bundled content fallback visible.
  }
}

function renderRoute() {
  const path = location.hash.replace("#", "") || "/";
  const postMatch = path.match(/^\/blog\/(.+)$/);
  updateNav(path);

  if (postMatch) {
    renderPost(postMatch[1]);
  } else {
    const render = routes[path] || renderNotFound;
    render();
  }

  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  main.focus({ preventScroll: true });
  hydrateLatestPublished();
}

function updateNav(path) {
  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    link.toggleAttribute("aria-current", href === `#${path}`);
  });
}

function renderHome() {
  const latestPost = siteData.posts[0];
  main.innerHTML = `
    <section class="hero">
      <div class="panel hero-copy">
        <p class="eyebrow">LitRPG world-hopping from a stubborn little corner of the web</p>
        <h1>Frozen Over The Moon</h1>
        <p>${siteData.author.tagline}</p>
        <div class="hero-actions">
          <a class="button primary" href="${siteData.links.royalRoad}" target="_blank" rel="noreferrer">Read on Royal Road</a>
          <a class="button" href="${siteData.links.amazon}" target="_blank" rel="noreferrer">Buy Book 1</a>
          <a class="button" href="#/progress">When's the next chapter?</a>
        </div>
      </div>
      <aside class="panel parchment author-card" aria-label="Author introduction">
        <div class="portrait" role="img" aria-label="Author photo placeholder"></div>
        <h2>About the Author</h2>
        <p>${siteData.author.shortBio}</p>
        <div class="webring" aria-label="Retro badges">
          <span>Best viewed by torchlight</span>
          <span>Royal Road serial</span>
          <span>Amazon edition live</span>
        </div>
      </aside>
    </section>

    <section class="section two-column">
      <div>${renderNextBook()}</div>
      <div>${renderLatestPublished()}</div>
    </section>

    <section class="section two-column">
      <div class="panel">${renderNewsletter()}</div>
      <div class="panel parchment">
        <h2>How Progress Updates Work</h2>
        <p>Published chapter status can be refreshed from Royal Road. Drafting progress is author-updated, because only the author knows how far the next private batch has moved.</p>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>Featured Novel</h2>
        <a href="#/books">View novel page</a>
      </div>
      <div class="grid">${siteData.books.map(renderBookCard).join("")}</div>
    </section>

    <section class="section two-column">
      <article class="panel">
        <p class="eyebrow">Latest blog post</p>
        <h2>${latestPost.title}</h2>
        <p class="post-meta">${formatDate(latestPost.date)} by ${latestPost.author}</p>
        <p>${latestPost.excerpt}</p>
        <a class="button" href="#/blog/${latestPost.slug}">Read update</a>
      </article>
      <aside class="panel parchment">
        <h2>Read the Novel</h2>
        <p>The main reader paths are simple: continue the serial on Royal Road, or pick up the Book 1 edition on Amazon.</p>
        <div class="link-row">
          <a class="badge-link" href="${siteData.links.royalRoad}" target="_blank" rel="noreferrer">Royal Road</a>
          <a class="badge-link" href="${siteData.links.amazon}" target="_blank" rel="noreferrer">Amazon</a>
          <a class="badge-link" href="#/gallery">Art gallery</a>
        </div>
      </aside>
    </section>
  `;
  bindForms();
  bindPassport();
}

function renderBooks() {
  main.innerHTML = `
    <section class="panel">
      <p class="eyebrow">One webnovel, two reader paths</p>
      <h1>The Wandering Fairy</h1>
      <p>Begin with Book 1 on Amazon, or follow the ongoing serial archive on Royal Road.</p>
    </section>
    <section class="section grid">${siteData.books.map(renderBookCard).join("")}</section>
  `;
}

function renderProgress() {
  main.innerHTML = `
    <section class="panel parchment">
      <p class="eyebrow">Reader ritual</p>
      <h1>When's the Next Chapter?!</h1>
      <p>Published status can be refreshed from Royal Road. Drafting, editing, and bonus progress are updated by the author.</p>
    </section>
    <section class="section">${renderLatestPublished()}</section>
    <section class="section">${siteData.projects.map(renderProject).join("")}</section>
  `;
}

function renderLatestPublished() {
  const latest = siteData.latestPublished;
  return `
    <section class="latest-published panel" aria-labelledby="latest-published-title">
      <p class="eyebrow">Latest published</p>
      <h2 id="latest-published-title">${latest.volume}</h2>
      <p class="latest-chapter-number">Chapter <span data-latest-chapter>${latest.chapter}</span></p>
      <div class="latest-progress-label">
        <span>Volume progress</span>
        <strong><span data-latest-percent>${volumePercent(latest)}</span>%</strong>
      </div>
      <div class="meter latest-meter" aria-label="Published progress through ${latest.volume}">
        <span data-latest-meter style="--value:${volumePercent(latest)}%"></span>
      </div>
      <p class="phase"><span data-latest-percent>${volumePercent(latest)}</span>% through ${latest.volume}.</p>
      <p class="post-meta">Last checked: <span data-latest-checked>${latest.checkedAt}</span></p>
      <div class="link-row latest-actions">
        <a class="button primary" data-latest-link href="${latest.url}" target="_blank" rel="noreferrer">Open</a>
        <a class="button" href="#/progress">Progress</a>
      </div>
    </section>
  `;
}

function renderGallery(activeCategory = "All") {
  const categories = ["All", "Fanart", "Official artwork"];
  const items = activeCategory === "All"
    ? siteData.gallery
    : siteData.gallery.filter((item) => item.category === activeCategory);

  main.innerHTML = `
    <section class="panel">
      <p class="eyebrow">Reader halls and official art</p>
      <h1>Art Gallery</h1>
      <p>Fanart and official artwork for the worlds, characters, and mysteries of The Wandering Fairy.</p>
    </section>
    <section class="section">
      <div class="tabs" role="tablist" aria-label="Gallery categories">
        ${categories.map((category) => `<button class="tab" type="button" role="tab" aria-selected="${category === activeCategory}" data-category="${category}">${category}</button>`).join("")}
      </div>
      <div class="grid">${items.map(renderArtCard).join("")}</div>
    </section>
  `;

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => renderGallery(button.dataset.category));
  });
}

function renderBlog() {
  main.innerHTML = `
    <section class="panel parchment">
      <p class="eyebrow">Updates, release news, and notes</p>
      <h1>Blog</h1>
      <p>Release notes, Royal Road updates, personal notes, and site announcements from the author.</p>
    </section>
    <section class="section grid">${siteData.posts.map(renderPostCard).join("")}</section>
  `;
}

function renderPost(slug) {
  const post = siteData.posts.find((item) => item.slug === slug);
  if (!post) {
    renderNotFound();
    return;
  }

  main.innerHTML = `
    <article class="panel">
      <p class="eyebrow">Blog archive</p>
      <h1>${post.title}</h1>
      <p class="post-meta">${formatDate(post.date)} by ${post.author}</p>
      <ul class="tag-list">${post.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
      <div class="featured-image" role="img" aria-label="Featured image placeholder for ${post.title}"></div>
      ${post.content.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      <a class="button" href="#/blog">Back to blog</a>
    </article>
  `;
}

function renderAbout() {
  main.innerHTML = `
    <section class="two-column">
      <div class="panel">
        <p class="eyebrow">The person behind the portal</p>
        <h1>About ${siteData.author.name}</h1>
        <p>${siteData.author.longBio}</p>
        <p>This space can hold publication history, favorite tropes, convention availability, and a more personal note for readers.</p>
        <h2>Find the Author</h2>
        <div class="link-row">${siteData.author.socials.map((item) => `<a class="badge-link" href="${item.url}" target="_blank" rel="noreferrer">${item.label}</a>`).join("")}</div>
      </div>
      <aside class="panel parchment">
        <div class="portrait" role="img" aria-label="Author photo placeholder"></div>
        <h2>Business Inquiries</h2>
        <p>For rights, interviews, appearances, or professional contact, use the contact page or replace this email:</p>
        <p><a href="mailto:${siteData.author.email}">${siteData.author.email}</a></p>
      </aside>
    </section>
  `;
}

function renderContact() {
  main.innerHTML = `
    <section class="two-column">
      <div class="panel">
        <p class="eyebrow">Send a raven, or an email API later</p>
        <h1>Contact</h1>
        <p>For reader mail, art credits, interviews, rights questions, or business inquiries, send a note below.</p>
        <form class="contact-form" data-form="contact" novalidate>
          <label class="field">Name <input name="name" autocomplete="name" required></label>
          <label class="field">Email <input name="email" type="email" autocomplete="email" required></label>
          <label class="field">Subject <input name="subject" required></label>
          <label class="field">Message <textarea name="message" required></textarea></label>
          <button class="button primary" type="submit">Send message</button>
          <p class="form-message" role="status" aria-live="polite"></p>
        </form>
      </div>
      <aside class="panel parchment">
        <h2>Before you write</h2>
        <p>Use this space for guidance on fan mail, art permissions, ARC requests, interviews, translations, or business inquiries.</p>
      </aside>
    </section>
  `;
  bindForms();
}

function renderNotFound() {
  main.innerHTML = `
    <section class="panel parchment">
      <h1>404</h1>
      <p>This door is painted on the wall. Try the novel page instead.</p>
      <a class="button" href="#/">Go home</a>
    </section>
  `;
}

function renderNextBook() {
  const project = siteData.projects[0];
  return `
    <section class="panel" aria-labelledby="next-book-title">
      <p class="eyebrow">Series progress</p>
      <h2 id="next-book-title">Full Novel</h2>
      ${renderProject(project)}
    </section>
  `;
}

function renderNewsletter() {
  return `
    <h2>Mailing List</h2>
    <p>New releases, Royal Road updates, blog posts, and announcements.</p>
    <form class="newsletter" data-form="newsletter" novalidate>
      <label class="field">Email address <input name="email" type="email" autocomplete="email" required></label>
      <button class="button primary" type="submit">Sign up</button>
      <p class="form-message" role="status" aria-live="polite"></p>
    </form>
    <p><small>${siteData.links.newsletterNote}</small></p>
  `;
}

function renderBookCard(book) {
  return `
    <article class="book-card">
      <div class="cover" role="img" aria-label="Cover placeholder for ${book.title}">${book.coverLabel || book.title}</div>
      <div>
        <span class="status">${book.status}</span>
        <h3>${book.title}</h3>
        <p class="post-meta">${book.series}</p>
        <p>${book.description}</p>
        <div class="link-row">${book.links.map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`).join("")}</div>
      </div>
    </article>
  `;
}

function renderProject(project) {
  return `
    <article class="project-row">
      <div>
        <h3>${project.name}</h3>
        <p class="phase">${project.phase}</p>
      </div>
      <strong>${project.percent}%</strong>
      <div class="meter" aria-label="${project.name} is ${project.percent}% complete">
        <span style="--value:${project.percent}%"></span>
      </div>
      <p>${project.note}</p>
    </article>
  `;
}

function renderArtCard(item) {
  return `
    <article class="art-card">
      <div class="art-image" role="img" aria-label="${item.title} placeholder artwork"></div>
      <h3>${item.title}</h3>
      <p class="post-meta">${item.category} by ${item.artist}</p>
      <a href="${item.credit}" target="_blank" rel="noreferrer">Credit link</a>
    </article>
  `;
}

function renderPostCard(post) {
  return `
    <article class="post-card">
      <p class="post-meta">${formatDate(post.date)} by ${post.author}</p>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <ul class="tag-list">${post.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
      <a class="button" href="#/blog/${post.slug}">Read post</a>
    </article>
  `;
}

function bindForms() {
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const message = form.querySelector(".form-message");
      const required = Array.from(form.querySelectorAll("[required]"));
      const missing = required.some((field) => !field.value.trim());
      const email = form.querySelector('input[type="email"]');
      const badEmail = email && !email.validity.valid;

      message.className = "form-message";
      if (missing || badEmail) {
        message.textContent = "Please complete the required fields with a valid email address.";
        message.classList.add("error");
        return;
      }

      if (form.dataset.form === "newsletter") {
        await submitNewsletter(form, message);
        return;
      }

      message.textContent = "Preview form checked. Contact sending is not connected yet.";
      message.classList.add("success");
      form.reset();
    });
  });
}

async function submitNewsletter(form, message) {
  const endpoint = siteData.links.newsletterEndpoint?.trim();
  const email = form.querySelector('input[type="email"]').value.trim();

  message.className = "form-message";
  if (!endpoint) {
    message.textContent = "Newsletter endpoint missing. Add a Formspree, Buttondown, ConvertKit, or Mailchimp endpoint in Pages CMS.";
    message.classList.add("error");
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        source: "Frozen Over The Moon author website"
      })
    });

    if (!response.ok) throw new Error("Newsletter provider rejected the signup.");

    message.textContent = "Signed up. Please check your inbox if confirmation is required.";
    message.classList.add("success");
    form.reset();
  } catch {
    message.textContent = "Signup failed. Please try again or use the author's social links.";
    message.classList.add("error");
  }
}

async function hydrateLatestPublished() {
  const latestCard = document.querySelector(".latest-published");
  if (!latestCard) return;

  try {
    const latest = await fetchLatestPublished();
    if (!latest) return;
    const percent = volumePercent(latest);

    latestCard.querySelector("[data-latest-chapter]").textContent = latest.chapter;
    latestCard.querySelector("[data-latest-checked]").textContent = latest.checkedAt;
    latestCard.querySelector("[data-latest-link]").href = latest.url;
    latestCard.querySelector("#latest-published-title").textContent = latest.volume || "Latest Royal Road chapter";
    latestCard.querySelector("[data-latest-meter]").style.setProperty("--value", `${percent}%`);
    latestCard.querySelectorAll("[data-latest-percent]").forEach((node) => {
      node.textContent = percent;
    });
  } catch {
    // Static fallback stays visible when the JSON file is missing or the page is opened directly.
  }
}

async function fetchLatestPublished() {
  const response = await fetch("api/latest-chapter", { cache: "no-store" })
    .then((apiResponse) => {
      if (!apiResponse.ok) throw new Error("No live chapter API");
      return apiResponse;
    })
    .catch(() => fetch("latest-chapter.json", { cache: "no-store" }));

  if (!response.ok) return null;
  return response.json();
}

function volumePercent(latest) {
  const current = latest.volumeChapter || 30;
  const total = latest.volumePlannedChapters || 130;
  return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
}

function volumeNumberFromLabel(label = "") {
  const match = label.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}
