export interface MediaItem {
  src: string;
  type: "image" | "video";
  alt?: string;
  poster?: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  year: number;
  client?: string;
  description?: string;
  credits?: { role: string; name: string }[];
  thumbnail: MediaItem;
  media: MediaItem[];
  previewVideo?: string;
  vimeoId?: string;
}

export const projects: Project[] = [
  {
    slug: "international-klein-blue",
    title: "INTERNATIONAL KLEIN BLUE",
    year: 2026,
    description: "A visual exploration of Yves Klein's iconic blue.",
    previewVideo: "/media/international-klein-blue/preview.mp4",
    thumbnail: {
      src: "/media/international-klein-blue/01.png",
      type: "image",
      alt: "International Klein Blue",
      width: 2544,
      height: 1914,
    },
    media: [
      {
        src: "/media/international-klein-blue/01.png",
        type: "image",
        alt: "International Klein Blue — stone archway by the sea",
        width: 2544,
        height: 1914,
      },
      {
        src: "/media/international-klein-blue/02.jpg",
        type: "image",
        alt: "International Klein Blue — still 2",
        width: 1920,
        height: 1280,
      },
      {
        src: "/media/international-klein-blue/03.jpg",
        type: "image",
        alt: "International Klein Blue — still 3",
        width: 1920,
        height: 1280,
      },
    ],
  },
  {
    slug: "dolce-gabbana",
    title: "DOLCE & GABBANA",
    year: 2025,
    client: "Dolce & Gabbana",
    previewVideo: "/media/dolce-gabbana/preview.mp4",
    vimeoId: "1135681066",
    thumbnail: {
      src: "/media/dolce-gabbana/thumb.jpg",
      type: "image",
      alt: "Dolce & Gabbana",
      width: 1920,
      height: 1080,
    },
    media: [
      {
        src: "/media/dolce-gabbana/thumb.jpg",
        type: "image",
        alt: "Dolce & Gabbana — silver embellished fashion",
        width: 1920,
        height: 1080,
      },
      {
        src: "/media/dolce-gabbana/01.jpg",
        type: "image",
        alt: "Dolce & Gabbana — still 2",
        width: 1920,
        height: 1280,
      },
      {
        src: "/media/dolce-gabbana/02.jpg",
        type: "image",
        alt: "Dolce & Gabbana — still 3",
        width: 1920,
        height: 1280,
      },
    ],
  },
  {
    slug: "ball-on-ice",
    title: "BALL ON ICE",
    year: 2025,
    thumbnail: {
      src: "/media/ball-on-ice/thumb.jpg",
      type: "image",
      alt: "Ball on Ice",
      width: 1920,
      height: 1080,
    },
    media: [
      {
        src: "/media/ball-on-ice/01.jpg",
        type: "image",
        alt: "Ball on Ice — still 1",
        width: 1920,
        height: 1280,
      },
      {
        src: "/media/ball-on-ice/02.jpg",
        type: "image",
        alt: "Ball on Ice — still 2",
        width: 1920,
        height: 1280,
      },
      {
        src: "/media/ball-on-ice/03.jpg",
        type: "image",
        alt: "Ball on Ice — still 3",
        width: 1920,
        height: 1280,
      },
    ],
  },
  {
    slug: "the-altar",
    title: "THE ALTAR",
    year: 2024,
    thumbnail: {
      src: "/media/the-altar/thumb.jpg",
      type: "image",
      alt: "The Altar",
      width: 1920,
      height: 1080,
    },
    media: [
      {
        src: "/media/the-altar/01.jpg",
        type: "image",
        alt: "The Altar — still 1",
        width: 1920,
        height: 1280,
      },
      {
        src: "/media/the-altar/02.jpg",
        type: "image",
        alt: "The Altar — still 2",
        width: 1920,
        height: 1280,
      },
      {
        src: "/media/the-altar/03.jpg",
        type: "image",
        alt: "The Altar — still 3",
        width: 1920,
        height: 1280,
      },
    ],
  },
  {
    slug: "turkish-oil-wrestling",
    title: "TURKISH OIL WRESTLING",
    year: 2024,
    description:
      "A cinematic exploration of the ancient tradition of Turkish oil wrestling. Gold at the 2025 Young Director Award in Cannes.",
    previewVideo: "/media/turkish-oil-wrestling/preview.mp4",
    vimeoId: "941619989",
    thumbnail: {
      src: "/media/turkish-oil-wrestling/thumb.jpg",
      type: "image",
      alt: "Turkish Oil Wrestling",
      width: 1920,
      height: 1080,
    },
    media: [
      {
        src: "/media/turkish-oil-wrestling/thumb.jpg",
        type: "image",
        alt: "Turkish Oil Wrestling — YDA Gold 2025",
        width: 1920,
        height: 1080,
      },
      {
        src: "/media/turkish-oil-wrestling/01.jpg",
        type: "image",
        alt: "Turkish Oil Wrestling — still 2",
        width: 1920,
        height: 1280,
      },
      {
        src: "/media/turkish-oil-wrestling/02.jpg",
        type: "image",
        alt: "Turkish Oil Wrestling — still 3",
        width: 1920,
        height: 1280,
      },
    ],
  },
  {
    slug: "le-sage-solange",
    title: 'LE SAGE "SOLANGE"',
    year: 2023,
    client: "Chanel x Vogue",
    previewVideo: "/media/le-sage-solange/preview.mp4",
    vimeoId: "1019736680",
    thumbnail: {
      src: "/media/le-sage-solange/01.jpg",
      type: "image",
      alt: 'Le Sage "Solange"',
      width: 1920,
      height: 1080,
    },
    media: [
      {
        src: "/media/le-sage-solange/01.jpg",
        type: "image",
        alt: "Dua Lipa — The Chanel 25 Handbag",
        width: 1920,
        height: 1080,
      },
      {
        src: "/media/le-sage-solange/02.jpg",
        type: "image",
        alt: 'Le Sage "Solange" — still 2',
        width: 1920,
        height: 1280,
      },
      {
        src: "/media/le-sage-solange/03.jpg",
        type: "image",
        alt: 'Le Sage "Solange" — still 3',
        width: 1920,
        height: 1280,
      },
    ],
  },
];
