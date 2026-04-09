export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export const STYLES = [
  "Girl crush",
  "Bright / fresh",
  "Hip-hop",
  "Power",
  "Elegant",
  "Sexy",
  "School / youthful",
];

export const SKILL_TAGS = [
  "arm-heavy",
  "fast footwork",
  "groove",
  "isolation",
  "core control",
  "musicality",
  "stamina",
  "turns",
  "facials",
  "floorwork",
  "precision",
  "speed control",
  "hand details",
  "waacking-inspired",
];

/**
 * Hardcoded starter dataset.
 * Fields:
 * - id: stable unique id for routing
 * - artist, song
 * - group: used for filtering as well (can be same as artist for soloists)
 * - difficulty: Beginner | Intermediate | Advanced
 * - style: concept/style label
 * - skills: array of skill focus tags
 * - preview: YouTube video id for embedded preview (MV, performance, dance practice)
 * - tutorialUrl: YouTube tutorial link
 * - communityRating: 1..5 (placeholder for later community ratings)
 */
export const DANCES = [
  {
    id: "twice-tt",
    artist: "TWICE",
    group: "TWICE",
    song: "TT",
    difficulty: "Beginner",
    style: "Bright / fresh",
    skills: ["hand details", "precision", "musicality"],
    preview: { youtubeId: "ePpPVE-GGJw" }, // TWICE "TT" M/V
    tutorialUrl: "https://www.youtube.com/watch?v=2f9p2jGgkqA",
    communityRating: 4.6,
  },
  {
    id: "blackpink-ddd",
    artist: "BLACKPINK",
    group: "BLACKPINK",
    song: "DDU-DU DDU-DU",
    difficulty: "Intermediate",
    style: "Girl crush",
    skills: ["arm-heavy", "precision", "facials", "stamina"],
    preview: { youtubeId: "IHNzOHi8sJs" }, // Dance practice
    tutorialUrl: "https://www.youtube.com/watch?v=0wHzVQv-6Zo",
    communityRating: 4.7,
  },
  {
    id: "bts-dynamite",
    artist: "BTS",
    group: "BTS",
    song: "Dynamite",
    difficulty: "Beginner",
    style: "Bright / fresh",
    skills: ["groove", "musicality", "speed control"],
    preview: { youtubeId: "CVy9Sc7u8mI" }, // Dance practice
    tutorialUrl: "https://www.youtube.com/watch?v=9vV7J3Z3k0I",
    communityRating: 4.5,
  },
  {
    id: "itzy-wannabe",
    artist: "ITZY",
    group: "ITZY",
    song: "WANNABE",
    difficulty: "Intermediate",
    style: "Power",
    skills: ["arm-heavy", "stamina", "isolation", "precision"],
    preview: { youtubeId: "G_Lhkhxl8BU" }, // Dance practice
    tutorialUrl: "https://www.youtube.com/watch?v=5B1o5x7S8w8",
    communityRating: 4.6,
  },
  {
    id: "exo-love-shot",
    artist: "EXO",
    group: "EXO",
    song: "Love Shot",
    difficulty: "Intermediate",
    style: "Sexy",
    skills: ["groove", "core control", "facials", "precision"],
    preview: { youtubeId: "pSudEWBAYRE" }, // Dance practice
    tutorialUrl: "https://www.youtube.com/watch?v=Iu6q8M8kX8U",
    communityRating: 4.4,
  },
  {
    id: "le-sserafim-antifragile",
    artist: "LE SSERAFIM",
    group: "LE SSERAFIM",
    song: "ANTIFRAGILE",
    difficulty: "Advanced",
    style: "Hip-hop",
    skills: ["fast footwork", "stamina", "isolation", "groove", "speed control"],
    preview: { youtubeId: "dzwuR99Ry98" }, // Performance / practice
    tutorialUrl: "https://www.youtube.com/watch?v=0Zr0t1BqW8Q",
    communityRating: 4.8,
  },
  {
    id: "seventeen-left-right",
    artist: "SEVENTEEN",
    group: "SEVENTEEN",
    song: "Left & Right",
    difficulty: "Intermediate",
    style: "School / youthful",
    skills: ["groove", "musicality", "precision", "stamina"],
    preview: { youtubeId: "HdZdxocqzq4" }, // Dance practice
    tutorialUrl: "https://www.youtube.com/watch?v=9wX5dGZKfWQ",
    communityRating: 4.5,
  },
  {
    id: "aespa-next-level",
    artist: "aespa",
    group: "aespa",
    song: "Next Level",
    difficulty: "Advanced",
    style: "Girl crush",
    skills: ["isolation", "precision", "arm-heavy", "musicality"],
    preview: { youtubeId: "IM2ccPzJ8K0" }, // Dance practice
    tutorialUrl: "https://www.youtube.com/watch?v=y4xE3V2VjVQ",
    communityRating: 4.3,
  },
];

