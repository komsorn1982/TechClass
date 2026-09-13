import type { NextConfig } from "next";
const nextConfig:NextConfig={async redirects(){return[
{source:"/login",destination:"/",permanent:false},
{source:"/register",destination:"/",permanent:false},
{source:"/profile",destination:"/#profile",permanent:false},
{source:"/lessons/:path*",destination:"/",permanent:false},
{source:"/teacher/:path*",destination:"/",permanent:false}
]}};
export default nextConfig;