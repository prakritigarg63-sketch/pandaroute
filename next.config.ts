import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server be reached from another device on the LAN (e.g. a
  // phone at http://192.168.x.x:3001) for real-device mobile testing. Dev
  // server only — has no effect on production builds.
  allowedDevOrigins: ["192.168.0.134"],
};

export default nextConfig;
