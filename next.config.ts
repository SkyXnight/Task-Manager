import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "hvrarnlwfpdcfbfqppcw.supabase.co",
                pathname: "/storage/v1/object/public/**",
            },
        ],
    },

    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },

    turbopack: {},
};

export default nextConfig;