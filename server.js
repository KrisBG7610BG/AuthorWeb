const http = require("http");
const fs = require("fs");
const https = require("https");
const path = require("path");

const argPort = process.argv.find((arg) => arg.startsWith("--port="))?.split("=")[1];
const port = Number(argPort || process.env.PORT || 4173);
const root = process.cwd();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8"
};

http
  .createServer(async (request, response) => {
    let pathname = decodeURIComponent(request.url.split("?")[0]);

    if (pathname === "/api/latest-chapter") {
      try {
        const latest = await fetchLatestChapter();
        response.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        });
        response.end(JSON.stringify(latest));
      } catch (error) {
        response.writeHead(502, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        });
        response.end(JSON.stringify({ error: error.message }));
      }
      return;
    }

    if (pathname === "/api/chapter-link") {
      try {
        const url = new URL(request.url, `http://${request.headers.host || "127.0.0.1"}`);
        const chapter = Number(url.searchParams.get("chapter"));
        if (!Number.isFinite(chapter) || chapter < 1) throw new Error("Missing chapter number.");

        const result = await fetchChapterLink(chapter);
        response.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        });
        response.end(JSON.stringify(result));
      } catch (error) {
        response.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        });
        response.end(JSON.stringify({ error: error.message }));
      }
      return;
    }

    if (pathname === "/") pathname = "/index.html";

    const filePath = path.join(root, pathname);
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
        "Cache-Control": "no-store"
      });
      response.end(data);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Author website running at http://127.0.0.1:${port}`);
  });

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "The Wandering Fairy author website" } }, (remoteResponse) => {
        if (remoteResponse.statusCode < 200 || remoteResponse.statusCode >= 300) {
          reject(new Error(`Royal Road returned ${remoteResponse.statusCode}`));
          remoteResponse.resume();
          return;
        }

        let body = "";
        remoteResponse.setEncoding("utf8");
        remoteResponse.on("data", (chunk) => {
          body += chunk;
        });
        remoteResponse.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"');
}

function volumeForChapter(chapter) {
  if (chapter >= 292) return { volume: "Vol. 4", volumeNumber: 4 };
  if (chapter >= 105) return { volume: "Royal Road archive", volumeNumber: 2 };
  return { volume: "Book 1", volumeNumber: 1 };
}

async function fetchLatestChapter() {
  const fictionUrl = "https://www.royalroad.com/fiction/94680/the-wandering-fairy-litrpg-world-hopping";
  const html = await fetchText(fictionUrl);
  const chapters = extractChapters(html);

  if (!chapters.length) throw new Error("No Royal Road chapters found.");

  chapters.sort((a, b) => b.chapter - a.chapter);
  const latest = chapters[0];
  const volume = volumeForChapter(latest.chapter);

  return {
    chapter: latest.chapter,
    title: latest.title,
    volume: volume.volume,
    volumeNumber: volume.volumeNumber,
    totalVolumes: 10,
    plannedChapters: 750,
    volumeChapter: Math.max(1, latest.chapter - 271),
    volumePlannedChapters: 130,
    url: latest.url,
    checkedAt: new Date().toISOString().slice(0, 10)
  };
}

async function fetchChapterLink(chapterNumber) {
  const fictionUrl = "https://www.royalroad.com/fiction/94680/the-wandering-fairy-litrpg-world-hopping";
  const html = await fetchText(fictionUrl);
  const chapter = extractChapters(html).find((item) => item.chapter === chapterNumber);

  if (chapter) {
    return {
      chapter: chapter.chapter,
      title: chapter.title,
      url: chapter.url,
      direct: true
    };
  }

  return {
    chapter: chapterNumber,
    title: `Chapter ${chapterNumber}`,
    url: fictionUrl,
    direct: false
  };
}

function extractChapters(html) {
  const chapterPattern = /<a[^>]+href="(?<href>\/fiction\/94680\/the-wandering-fairy-litrpg-world-hopping\/chapter\/[^"#]+)"[^>]*>\s*Chapter\s+(?<chapter>\d+):\s*(?<title>[^<]+)<\/a>/gi;
  const chapters = [];

  for (const match of html.matchAll(chapterPattern)) {
    chapters.push({
      chapter: Number(match.groups.chapter),
      title: decodeHtml(match.groups.title.trim()),
      url: `https://www.royalroad.com${match.groups.href}`
    });
  }

  return chapters;
}
