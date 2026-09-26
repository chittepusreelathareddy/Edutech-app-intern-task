import { Course } from '../store/courseStore';

/**
 * Curated collection of 4K / High-Definition Unsplash technology & design imagery.
 * Mapped to guarantee ultra-sharp, non-pixelated course thumbnails.
 */
export const PREMIUM_4K_IMAGES = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=90', // Full-Stack Code
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=90', // AI & Neural Mesh
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=90', // Mobile Engineering
  'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=90', // UI/UX Design System
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=90', // Cloud & Architecture
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=90', // Cybersecurity Shield
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=90', // DevOps & Infrastructure
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=90', // Data Analytics
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=90', // Matrix Cyber Code
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=90', // Tech Workspace
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=90', // Laptop Coding Setup
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=90', // Code Refactoring
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=90', // Engineering Team
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=90', // Web Developer Desk
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=90', // Hardware & Tech
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=90', // AI Robotics
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=90', // Futuristic Automation
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=90', // Web Studio
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=90', // Developer Collaboration
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90', // Modern 3D Mesh
];

/**
 * Returns a stable, ultra-sharp 4K image URL for a course.
 */
export function getStableThumbnail(course: Pick<Course, 'id' | 'thumbnail'>): string {
  // If course already has a high-res Unsplash photo, use it directly
  if (course.thumbnail && course.thumbnail.includes('images.unsplash.com')) {
    return course.thumbnail;
  }

  // Hash the course ID to deterministically assign a crystal-clear 4K photo
  const rawId = String(course.id ?? '0');
  let hash = 0;
  for (let i = 0; i < rawId.length; i++) {
    hash = (hash << 5) - hash + rawId.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PREMIUM_4K_IMAGES.length;
  return PREMIUM_4K_IMAGES[index];
}
