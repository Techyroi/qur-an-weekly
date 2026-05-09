export type PlanDay = {
  day: number;
  title: string;
  startSurah: string;
  startSurahArabic?: string;
  endSurah: string;
  endSurahArabic?: string;
  estimatedPages: number;
  reciterUrl?: string;
  verse?: { ar: string; en: string };
};

// Backwards-compat alias for existing components
export type ManzilDay = PlanDay & {
  startSurahArabic: string;
  endSurahArabic: string;
  surahCount: number;
};

export type PlanType = "7" | "15" | "30";

export const PLAN_7: PlanDay[] = [
  { day: 1, title: "Manzil 1", startSurah: "Al-Fatihah", startSurahArabic: "الفاتحة", endSurah: "An-Nisa", endSurahArabic: "النساء", estimatedPages: 105, reciterUrl: "https://quran.com/1",
    verse: { ar: "وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا", en: "And recite the Qur'an with measured recitation. (73:4)" } },
  { day: 2, title: "Manzil 2", startSurah: "Al-Ma'idah", startSurahArabic: "المائدة", endSurah: "At-Tawbah", endSurahArabic: "التوبة", estimatedPages: 96, reciterUrl: "https://quran.com/5",
    verse: { ar: "إِنَّ هَـٰذَا ٱلْقُرْءَانَ يَهْدِى لِلَّتِى هِىَ أَقْوَمُ", en: "Indeed, this Qur'an guides to that which is most upright. (17:9)" } },
  { day: 3, title: "Manzil 3", startSurah: "Yunus", startSurahArabic: "يونس", endSurah: "An-Nahl", endSurahArabic: "النحل", estimatedPages: 88, reciterUrl: "https://quran.com/10",
    verse: { ar: "أَحَبُّ ٱلْأَعْمَالِ إِلَى ٱللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ", en: "The most beloved deeds to Allah are those done consistently, even if small." } },
  { day: 4, title: "Manzil 4", startSurah: "Al-Isra", startSurahArabic: "الإسراء", endSurah: "Al-Furqan", endSurahArabic: "الفرقان", estimatedPages: 84, reciterUrl: "https://quran.com/17",
    verse: { ar: "وَنُنَزِّلُ مِنَ ٱلْقُرْءَانِ مَا هُوَ شِفَآءٌ وَرَحْمَةٌ", en: "And We send down of the Qur'an that which is healing and mercy. (17:82)" } },
  { day: 5, title: "Manzil 5", startSurah: "Ash-Shu'ara", startSurahArabic: "الشعراء", endSurah: "Ya-Sin", endSurahArabic: "يس", estimatedPages: 84, reciterUrl: "https://quran.com/26",
    verse: { ar: "ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ", en: "Verily, in the remembrance of Allah do hearts find rest. (13:28)" } },
  { day: 6, title: "Manzil 6", startSurah: "As-Saffat", startSurahArabic: "الصافات", endSurah: "Al-Hujurat", endSurahArabic: "الحجرات", estimatedPages: 86, reciterUrl: "https://quran.com/37",
    verse: { ar: "وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ", en: "And We have certainly made the Qur'an easy for remembrance. (54:17)" } },
  { day: 7, title: "Manzil 7", startSurah: "Qaf", startSurahArabic: "ق", endSurah: "An-Nas", endSurahArabic: "الناس", estimatedPages: 61, reciterUrl: "https://quran.com/50",
    verse: { ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ ٱلْقُرْءَانَ وَعَلَّمَهُ", en: "The best of you are those who learn the Qur'an and teach it. (Bukhari)" } },
];

// 15-day plan — balanced ~40 pages each
export const PLAN_15: PlanDay[] = [
  { day: 1, title: "Day 1", startSurah: "Al-Fatihah", endSurah: "Al-Baqarah 141", estimatedPages: 40, reciterUrl: "https://quran.com/1" },
  { day: 2, title: "Day 2", startSurah: "Al-Baqarah 142", endSurah: "Aal-Imran", estimatedPages: 40, reciterUrl: "https://quran.com/2" },
  { day: 3, title: "Day 3", startSurah: "An-Nisa", endSurah: "Al-Ma'idah 81", estimatedPages: 40, reciterUrl: "https://quran.com/4" },
  { day: 4, title: "Day 4", startSurah: "Al-Ma'idah 82", endSurah: "Al-A'raf 87", estimatedPages: 40, reciterUrl: "https://quran.com/5" },
  { day: 5, title: "Day 5", startSurah: "Al-A'raf 88", endSurah: "At-Tawbah 92", estimatedPages: 40, reciterUrl: "https://quran.com/7" },
  { day: 6, title: "Day 6", startSurah: "At-Tawbah 93", endSurah: "Hud 5", estimatedPages: 40, reciterUrl: "https://quran.com/9" },
  { day: 7, title: "Day 7", startSurah: "Hud 6", endSurah: "Yusuf 52", estimatedPages: 40, reciterUrl: "https://quran.com/11" },
  { day: 8, title: "Day 8", startSurah: "Yusuf 53", endSurah: "An-Nahl 128", estimatedPages: 40, reciterUrl: "https://quran.com/12" },
  { day: 9, title: "Day 9", startSurah: "Al-Isra", endSurah: "Al-Kahf 74", estimatedPages: 40, reciterUrl: "https://quran.com/17" },
  { day: 10, title: "Day 10", startSurah: "Al-Kahf 75", endSurah: "Al-Hajj", estimatedPages: 40, reciterUrl: "https://quran.com/18" },
  { day: 11, title: "Day 11", startSurah: "Al-Mu'minun", endSurah: "Al-Furqan", estimatedPages: 40, reciterUrl: "https://quran.com/23" },
  { day: 12, title: "Day 12", startSurah: "Ash-Shu'ara", endSurah: "Al-Ahzab", estimatedPages: 40, reciterUrl: "https://quran.com/26" },
  { day: 13, title: "Day 13", startSurah: "Saba", endSurah: "Ya-Sin", estimatedPages: 40, reciterUrl: "https://quran.com/34" },
  { day: 14, title: "Day 14", startSurah: "As-Saffat", endSurah: "Adh-Dhariyat", estimatedPages: 40, reciterUrl: "https://quran.com/37" },
  { day: 15, title: "Day 15", startSurah: "At-Tur", endSurah: "An-Nas", estimatedPages: 44, reciterUrl: "https://quran.com/52" },
];

// 30-day plan — one Juz per day
export const PLAN_30: PlanDay[] = Array.from({ length: 30 }, (_, i) => {
  const ranges = [
    ["Al-Fatihah", "Al-Baqarah 141"],
    ["Al-Baqarah 142", "Al-Baqarah 252"],
    ["Al-Baqarah 253", "Aal-Imran 92"],
    ["Aal-Imran 93", "An-Nisa 23"],
    ["An-Nisa 24", "An-Nisa 147"],
    ["An-Nisa 148", "Al-Ma'idah 81"],
    ["Al-Ma'idah 82", "Al-An'am 110"],
    ["Al-An'am 111", "Al-A'raf 87"],
    ["Al-A'raf 88", "Al-Anfal 40"],
    ["Al-Anfal 41", "At-Tawbah 92"],
    ["At-Tawbah 93", "Hud 5"],
    ["Hud 6", "Yusuf 52"],
    ["Yusuf 53", "Ibrahim"],
    ["Al-Hijr", "An-Nahl"],
    ["Al-Isra", "Al-Kahf 74"],
    ["Al-Kahf 75", "Ta-Ha"],
    ["Al-Anbiya", "Al-Hajj"],
    ["Al-Mu'minun", "Al-Furqan 20"],
    ["Al-Furqan 21", "An-Naml 55"],
    ["An-Naml 56", "Al-Ankabut 45"],
    ["Al-Ankabut 46", "Al-Ahzab 30"],
    ["Al-Ahzab 31", "Ya-Sin 27"],
    ["Ya-Sin 28", "Az-Zumar 31"],
    ["Az-Zumar 32", "Fussilat 46"],
    ["Fussilat 47", "Al-Jathiya"],
    ["Al-Ahqaf", "Adh-Dhariyat 30"],
    ["Adh-Dhariyat 31", "Al-Hadid"],
    ["Al-Mujadila", "At-Tahrim"],
    ["Al-Mulk", "Al-Mursalat"],
    ["An-Naba", "An-Nas"],
  ];
  const [s, e] = ranges[i];
  return { day: i + 1, title: `Juz ${i + 1}`, startSurah: s, endSurah: e, estimatedPages: 20, reciterUrl: "https://quran.com/" };
});

export function getPlan(type: PlanType): PlanDay[] {
  if (type === "7") return PLAN_7;
  if (type === "15") return PLAN_15;
  return PLAN_30;
}

// Legacy export
export const MANZIL_PLAN = PLAN_7.map((d) => ({
  ...d,
  startSurahArabic: d.startSurahArabic ?? "",
  endSurahArabic: d.endSurahArabic ?? "",
  surahCount: 1,
})) as ManzilDay[];
