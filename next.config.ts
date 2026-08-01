import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["web.test"],
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/workflows",
        permanent: true, // Triggers a 308 Permanent redirect
      },
    ];
  },
};

export default nextConfig;
