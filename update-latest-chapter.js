const fs = require("fs");
const https = require("https");

const fictionUrl = "https://www.royalroad.com/fiction/94680/the-wandering-fairy-litrpg-world-hopping";

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "The Wandering Fairy author website updater" } }, (response) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`Request failed with status ${response.statusCode}`));
          response.resume();
          return;
        }

        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => resolve(body));
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

async function main() {
  const html = await fetchText(fictionUrl);
  const chapterPattern = /<a[^>]+href="(?<href>\/fiction\/94680\/the-wandering-fairy-litrpg-world-hopping\/chapter\/[^"#]+)"[^>]*>\s*Chapter\s+(?<chapter>\d+):\s*(?<title>[^<]+)<\/a>/gi;
  const chapters = [];

  for (const match of html.matchAll(chapterPattern)) {
    chapters.push({
      chapter: Number(match.groups.chapter),
      title: decodeHtml(match.groups.title.trim()),
      url: `https://www.royalroad.com${match.groups.href}`
    });
  }

  if (!chapters.length) {
    throw new Error("No Royal Road chapters found.");
  }

  chapters.sort((a, b) => b.chapter - a.chapter);
  const latest = chapters[0];
  const volume = volumeForChapter(latest.chapter);
  const output = {
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

  fs.writeFileSync("latest-chapter.json", `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Latest chapter updated: Chapter ${output.chapter}: ${output.title}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
