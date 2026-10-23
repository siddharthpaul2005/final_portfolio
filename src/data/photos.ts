export interface Photo {
  id: number;
  title: string;
  description: string;
  location: string;
  image: string;
  category: string;
}

// PLACEHOLDER: set your own categories and photos (put images in public/assets/photos/).
export const categories = ['All', 'PLACEHOLDER'];

export const photos: Photo[] = [1, 2, 3, 4].map((id) => ({
  id,
  title: `PLACEHOLDER: Photo ${id} title`,
  description: 'PLACEHOLDER: A sentence about where and why you took it.',
  location: 'PLACEHOLDER: City, Country',
  image: '/assets/placeholder.svg',
  category: 'PLACEHOLDER',
}));
