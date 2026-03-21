import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Replace these with your actual Sanity project details
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'el3r3rtq',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-03-20', // use current date (YYYY-MM-DD) to target the latest API version
  // Use the proxy to bypass CORS issues in both dev and prod
  apiHost: window.location.origin + '/api/sanity',
  useProjectHostname: false 
});

const builder = imageUrlBuilder({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'el3r3rtq',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
});

export function urlFor(source: any) {
  return builder.image(source);
}
