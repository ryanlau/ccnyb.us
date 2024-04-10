/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'xgxntawymgcwzpgmkuzk.supabase.co',
				pathname: '/storage/v1/object/public/predictions/**',
			}
		],
	}
};

export default nextConfig;
