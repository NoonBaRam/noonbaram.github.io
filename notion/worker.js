/* CONFIGURATION STARTS HERE */

/* Step 1: enter your domain name like fruitionsite.com */
const MY_DOMAIN = "YOUR DOMAIN";

/*
 * Step 2: enter your URL slug to page ID mapping
 * The key on the left is the slug (without the slash)
 * The value on the right is the Notion page ID
 */
const SLUG_TO_PAGE = {
  "": "0123456789abcdefghijkl" // 예시 슬러그 - 빈 슬러그는 기본 페이지로 리디렉션
};

/* Step 3: enter your page title and description for SEO purposes */
const PAGE_TITLE = "Fruition";
const PAGE_DESCRIPTION =
  "Free, Open Source Toolkit For Customizing Your Notion Page";

/* Step 4: enter a Google Font name, you can choose from https://fonts.google.com */
const GOOGLE_FONT = "Rubik";

/* Step 5: enter any custom scripts you'd like */
const CUSTOM_SCRIPT = ``;

/* CONFIGURATION ENDS HERE */

const PAGE_TO_SLUG = {};
const slugs = [];
const pages = [];
Object.keys(SLUG_TO_PAGE).forEach(slug => {
  const page = SLUG_TO_PAGE[slug];
  slugs.push(slug);
  pages.push(page);
  PAGE_TO_SLUG[page] = slug;
});

addEventListener("fetch", event => {
  event.respondWith(fetchAndApply(event.request));
});

// appendJavascript 함수 정의
function appendJavascript(response, SLUG_TO_PAGE) {
  const rewriter = new BodyRewriter(SLUG_TO_PAGE);
  const newResponse = new HTMLRewriter().on("body", rewriter).transform(response);
  return newResponse;
}

function generateSitemap() {
  let sitemap = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  slugs.forEach(
    (slug) =>
      (sitemap +=
        "<url><loc>https://" + MY_DOMAIN + "/" + slug + "</loc></url>")
  );
  sitemap += "</urlset>";
  return sitemap;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function handleOptions(request) {
  if (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    return new Response(null, { headers: corsHeaders });
  } else {
    return new Response(null, { headers: { Allow: "GET, HEAD, POST, PUT, OPTIONS" } });
  }
}

async function fetchAndApply(request) {
  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }
  let url = new URL(request.url);
  url.hostname = 'www.notion.so';  // 실제 요청할 Notion URL로 변경

  let response;

  // 리디렉션 처리: 페이지가 슬러그와 매칭되면 해당 Notion 페이지로 리디렉션
  if (slugs.includes(url.pathname.slice(1))) {
    const pageId = SLUG_TO_PAGE[url.pathname.slice(1)];
    const notionUrl = 'https://noonbaram.notion.site/' + pageId;
    return Response.redirect(notionUrl, 301);  // Notion 페이지로 리디렉션
  }

  // 페이지 ID 매칭이 안 되는 경우 루트 페이지로 리디렉션
  if (pages.indexOf(url.pathname.slice(1)) === -1 && url.pathname.slice(1).match(/[0-9a-f]{32}/)) {
    return Response.redirect('https://' + MY_DOMAIN, 301); // 리디렉션 처리
  }

  // API 요청 전달 (API 경로)
  if (url.pathname.startsWith("/api")) {
    response = await fetch(url.toString(), {
      body: url.pathname.startsWith('/api/v3/getPublicPageData') ? null : request.body,
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"
      },
      method: "POST"
    });
    response = new Response(response.body, response);
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }

  // 일반 HTML 페이지 요청 처리
  response = await fetch(url.toString(), {
    body: request.body,
    headers: request.headers,
    method: request.method
  });
  response = new Response(response.body, response);
  response.headers.delete("Content-Security-Policy");
  response.headers.delete("X-Content-Security-Policy");

  return appendJavascript(response, SLUG_TO_PAGE); // 수정된 부분
}

// 메타 태그 수정
class MetaRewriter {
  element(element) {
    // 페이지 제목 수정
    if (typeof PAGE_TITLE === "string" && PAGE_TITLE.trim() !== "") {
      if (
        element.getAttribute("property") === "og:title" ||
        element.getAttribute("name") === "twitter:title"
      ) {
        element.setAttribute("content", PAGE_TITLE);
      }
      if (element.tagName === "title") {
        element.setInnerContent(PAGE_TITLE);  // title 태그의 내용 수정
      }
    }

    // 페이지 설명 수정
    if (typeof PAGE_DESCRIPTION === "string" && PAGE_DESCRIPTION.trim() !== "") {
      if (
        element.getAttribute("name") === "description" ||
        element.getAttribute("property") === "og:description" ||
        element.getAttribute("name") === "twitter:description"
      ) {
        element.setAttribute("content", PAGE_DESCRIPTION);
      }
    }

    // og:url 및 twitter:url 수정
    if (
      element.getAttribute("property") === "og:url" ||
      element.getAttribute("name") === "twitter:url"
    ) {
      element.setAttribute("content", MY_DOMAIN);
    }
  }
}

// 헤드 요소 처리
class HeadRewriter {
  element(element) {
    // GOOGLE_FONT이 빈 문자열이 아닌지 확인
    if (typeof GOOGLE_FONT === "string" && GOOGLE_FONT.trim() !== "") {
      element.append(
        `<link href='https://fonts.googleapis.com/css?family=${GOOGLE_FONT.replace(' ', '+')}:Regular,Bold,Italic&display=swap' rel='stylesheet'>
        <style>* { font-family: "${GOOGLE_FONT}" !important; }</style>`,
        { html: true }
      );
    }

    // 스타일링 관련 코드 추가
    element.append(
      `<style>
        div.notion-topbar > div > div:nth-child(3) { display: none !important; }
        div.notion-topbar > div > div:nth-child(4) { display: none !important; }
        div.notion-topbar > div > div:nth-child(5) { display: none !important; }
        div.notion-topbar > div > div:nth-child(6) { display: none !important; }
        div.notion-topbar-mobile > div:nth-child(3) { display: none !important; }
        div.notion-topbar-mobile > div:nth-child(4) { display: none !important; }
        div.notion-topbar > div > div:nth-child(1n).toggle-mode { display: block !important; }
        div.notion-topbar-mobile > div:nth-child(1n).toggle-mode { display: block !important; }
      </style>`,
      { html: true }
    );
  }
}

// 본문 처리
class BodyRewriter {
  constructor(SLUG_TO_PAGE) {
    this.SLUG_TO_PAGE = SLUG_TO_PAGE;
  }
  element(element) {
    element.append(
      `<script>
        window.CONFIG.domainBaseUrl = 'https://${MY_DOMAIN}';
        const SLUG_TO_PAGE = ${JSON.stringify(this.SLUG_TO_PAGE)}; 
        const PAGE_TO_SLUG = {};
        const slugs = [];
        const pages = [];
        const el = document.createElement('div');
        let redirected = false;
        Object.keys(SLUG_TO_PAGE).forEach(slug => {
          const page = SLUG_TO_PAGE[slug];
          slugs.push(slug);
          pages.push(page);
          PAGE_TO_SLUG[page] = slug;
        });
        function getPage() {
          return location.pathname.slice(-32);
        }
        function getSlug() {
          return location.pathname.slice(1);
        }
        function updateSlug() {
          const slug = PAGE_TO_SLUG[getPage()];
          if (slug != null) {
            history.replaceState(history.state, '', '/' + slug);
          }
        }
        function onDark() {
          el.innerHTML = '<div title="Change to Light Mode" style="margin-left: auto; margin-right: 14px; min-width: 0px;"><div role="button" tabindex="0" style="cursor: pointer;">Change to Light Mode</div></div>';
          document.querySelector("body").style.backgroundColor = "black";
        }
        </script>`,
      { html: true }
    );
  }
}
