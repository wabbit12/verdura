export type Plant = {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Primary display image (WebP). */
  image: string;
  /** Responsive WebP srcset for product / section displays. */
  imageSrcSet: string;
  /** Tiny WebP for search / cart thumbnails. */
  thumb: string;
  tag?: string;
};

/** Build responsive plant image URLs from a public/assets/plants basename. */
function plantMedia(basename: string) {
  const base = `/assets/plants/${basename}`;
  return {
    image: `${base}.webp`,
    imageSrcSet: `${base}-480.webp 480w, ${base}.webp 960w`,
    thumb: `${base}-thumb.webp`,
  };
}

export const assets = {
  heroBg: "/assets/hero-bg.webp",
  heroBgSrcSet: "/assets/hero-bg-800.webp 800w, /assets/hero-bg.webp 1600w",
  heroBgFallback: "/assets/hero-bg.jpg",
  logo: "/assets/logo-plant.png",
  search: "/assets/icon-search.png",
  bag: "/assets/icon-bag.png",
  plantHero: plantMedia("plant-hero"),
  plant1: plantMedia("plant-1"),
  plant2: plantMedia("plant-2"),
  plant3: plantMedia("plant-3"),
  plant4: plantMedia("plant-4"),
  plant5: plantMedia("plant-5"),
  plant6: plantMedia("plant-6"),
  avatarAlena: "/assets/avatar-alena.jpg",
  avatarMaxn: "/assets/avatar-maxn.jpg",
  avatarVenely: "/assets/avatar-venely.jpg",
  avatarLii: "/assets/avatar-lii.jpg",
} as const;

export const heroFeatured: Plant = {
  id: "hero-calathea",
  name: "Calathea Medallion",
  description: "Trendy House Plant",
  price: 49,
  ...assets.plantHero,
  tag: "Trendy House Plant",
};

export const heroCarousel: Plant[] = [
  heroFeatured,
  {
    id: "hero-haworthia",
    name: "Zebra Haworthia",
    description: "Desk Friendly Plant",
    price: 29,
    ...assets.plant1,
    tag: "Desk Friendly Plant",
  },
  {
    id: "hero-strelitzia",
    name: "Pot Cactus",
    description: "Statement House Plant",
    price: 59,
    ...assets.plant3,
    tag: "Statement House Plant",
  },
];

export const trendyPlants: Plant[] = [
  {
    id: "trendy-1",
    name: "Zebra Haworthia",
    description:
      "A compact speckled succulent in a mint pot. Perfect for desks, bright shelves, and low-water routines.",
    price: 49,
    ...assets.plant1,
  },
  {
    id: "trendy-2",
    name: "Pot Cactus",
    description:
      "Tall, architectural leaves in a clean white bowl. Brings tropical structure to sunny rooms and entryways.",
    price: 39,
    ...assets.plant3,
  },
];

export const topSelling: Plant[] = [
  {
    id: "top-1",
    name: "Zebra Haworthia",
    description:
      "Textured white-dotted leaves with almost no watering fuss. Ideal for desks and windowsills.",
    price: 29,
    ...assets.plant1,
  },
  {
    id: "top-2",
    name: "Mint Pot Succulent",
    description:
      "A cheerful mint ceramic pot paired with hardy foliage that thrives on bright light.",
    price: 39,
    ...assets.plant2,
    tag: "large-plant",
  },
  {
    id: "top-3",
    name: "Pot Cactus",
    description:
      "A compact desert cactus in a clean pot. Low water, strong shape, and easy bright-window care.",
    price: 59,
    ...assets.plant3,
  },
  {
    id: "top-4",
    name: "Traveler’s Palm Starter",
    description:
      "Fan-like foliage with soft lighting drama. Best in bright, indirect sun.",
    price: 49,
    ...assets.plant4,
  },
  {
    id: "top-5",
    name: "Strelitzia Green",
    description:
      "Deep green spears and a matte white pot for modern living rooms and studios.",
    price: 69,
    ...assets.plant5,
  },
  {
    id: "top-6",
    name: "Speckled Aloe Accent",
    description:
      "Thick pointed leaves in a stone-textured pot. Low care, high presence.",
    price: 39,
    ...assets.plant6,
  },
];

export const bestO2Slides = [
  {
    id: "o2-1",
    title: "Small Spaces. Stronger Air.",
    body: [
      "Our O2 collection pairs compact footprints with plants known for cleaner, fresher indoor air.",
      "Start with one statement piece, then build a corner that feels calmer every time you walk in.",
    ],
    ...assets.plantHero,
  },
  {
    id: "o2-2",
    title: "Fresh Air Starts With The Right Green Companion",
    body: [
      "Bring oxygen-rich foliage into compact spaces without sacrificing style or sunlight needs.",
      "Every plant is nursery-selected for resilience, leaf quality, and everyday indoor living.",
    ],
    ...assets.plant1,
  },
  {
    id: "o2-3",
    title: "Low Maintenance Plants With High Presence",
    body: [
      "From succulents to sculptural leaves, each pick balances beauty with realistic care routines.",
      "Explore collections designed for desks, corners, and quiet reading nooks.",
    ],
    ...assets.plant3,
  },
  {
    id: "o2-4",
    title: "A Greener Ritual For Everyday Living",
    body: [
      "Create a natural rhythm at home with plants that soften light and purify the air.",
      "Begin with one favorite — grow a collection that feels like yours.",
    ],
    ...assets.plant6,
  },
];

export const reviews = [
  {
    id: "r1",
    name: "Max Raval",
    avatar: assets.avatarMaxn,
    rating: 5,
    text: "The Calathea arrived healthy and packed with care. It instantly warmed up my studio and still looks lush after two months.",
  },
  {
    id: "r2",
    name: "Venely K.",
    avatar: assets.avatarVenely,
    rating: 5,
    text: "Beautiful plants, honest sizing photos, and fast shipping. The Snake Plant is perfect for my low-light hallway.",
  },
  {
    id: "r3",
    name: "Lii Thakur",
    avatar: assets.avatarLii,
    rating: 5,
    text: "Verdura made plant shopping simple. I ordered two desk plants and both are thriving with almost no effort.",
  },
];

export const plantTypes = [
  "Indoor Plants",
  "Air Purifying",
  "Succulents",
  "Flowering",
  "Pet Friendly",
];

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
