// export default {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'avatars.githubusercontent.com',
//         search: ''
//       },
//       {
//         protocol: 'https',
//         hostname: '*.public.blob.vercel-storage.com',
//         search: ''
//       }
//     ]
//   }
// };

const nextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com', 
      'public.blob.vercel-storage.com',
      'uwja77bygk2kgfqe.public.blob.vercel-storage.com' 
    ],
  },
};

export default nextConfig;

