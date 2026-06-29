import { NextResponse, type NextRequest } from "next/server";

const BLOCKED_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Bytespider",
  "Google-Extended",
  "Applebot-Extended",
  "Diffbot",
  "Omgilibot",
  "ImagesiftBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "HeadlessChrome",
  "PhantomJS",
  "Playwright",
  "Puppeteer",
  "python-requests",
  "Scrapy",
  "curl",
  "wget",
];

export default function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const shouldBlock = BLOCKED_USER_AGENTS.some((agent) =>
    userAgent.toLowerCase().includes(agent.toLowerCase()),
  );

  if (shouldBlock) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: {
        "X-Robots-Tag": "noai, noimageai",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
