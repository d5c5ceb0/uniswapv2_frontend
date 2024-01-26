/** @type {import('next').NextConfig} */

//change
const production = true;

const nextConfig = {
  output: "export",
  basePath: production === true ? "/uniswapv2_frontend" : undefined,
  assetPrefix: production === true ? "/uniswapv2_frontend/" : undefined,
};

module.exports = nextConfig;
