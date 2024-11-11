/** @type {import('next').NextConfig} */
const nextConfig = {
	 /*output: 'export', // Habilita la exportación estática*/
	 images: {
		domains: ['picsum.photos'],
		unoptimized: true, // Deshabilita la optimización de imágenes
	  },
};

export default nextConfig;
