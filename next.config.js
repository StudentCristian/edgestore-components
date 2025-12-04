const { withBaml } = require('@boundaryml/baml-nextjs-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  
  // Transpilar el paquete docx linkeado (NO incluir en serverExternalPackages)
  transpilePackages: ['docx'],
  
  // Configurar webpack para resolver el paquete linkeado
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'docx': require.resolve('docx')
      };
    }
    
    // Importante para npm link: seguir symlinks
    config.resolve.symlinks = true;
    
    return config;
  },
  
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/single-image',
        permanent: false,
      },
    ];
  },
};

module.exports = withBaml()(nextConfig);
