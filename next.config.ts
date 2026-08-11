import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repositoryBasePath = "/gujarati-dayaro-radio";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? repositoryBasePath : "",
  assetPrefix: isGitHubPages ? repositoryBasePath : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
