export type ManzilDay = {
  day: number;
  startSurah: string;
  startSurahArabic: string;
  endSurah: string;
  endSurahArabic: string;
  surahCount: number;
  estimatedPages: number;
  reciterUrl: string;
  verse?: { ar: string; en: string };
};

export const MANZIL_PLAN: ManzilDay[] = [
  {
    day: 1,
    startSurah: "Al-Fatihah",
    startSurahArabic: "الفاتحة",
    endSurah: "An-Nisa",
    endSurahArabic: "النساء",
    surahCount: 4,
    estimatedPages: 105,
    reciterUrl: "https://quran.com/1",
    verse: {
      ar: "وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا",
      en: "And recite the Qur'an with measured recitation. (73:4)",
    },
  },
  {
    day: 2,
    startSurah: "Al-Ma'idah",
    startSurahArabic: "المائدة",
    endSurah: "At-Tawbah",
    endSurahArabic: "التوبة",
    surahCount: 5,
    estimatedPages: 96,
    reciterUrl: "https://quran.com/5",
    verse: {
      ar: "إِنَّ هَـٰذَا ٱلْقُرْءَانَ يَهْدِى لِلَّتِى هِىَ أَقْوَمُ",
      en: "Indeed, this Qur'an guides to that which is most upright. (17:9)",
    },
  },
  {
    day: 3,
    startSurah: "Yunus",
    startSurahArabic: "يونس",
    endSurah: "An-Nahl",
    endSurahArabic: "النحل",
    surahCount: 7,
    estimatedPages: 88,
    reciterUrl: "https://quran.com/10",
    verse: {
      ar: "أَحَبُّ ٱلْأَعْمَالِ إِلَى ٱللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
      en: "The most beloved deeds to Allah are those done consistently, even if small.",
    },
  },
  {
    day: 4,
    startSurah: "Al-Isra",
    startSurahArabic: "الإسراء",
    endSurah: "Al-Furqan",
    endSurahArabic: "الفرقان",
    surahCount: 9,
    estimatedPages: 84,
    reciterUrl: "https://quran.com/17",
    verse: {
      ar: "وَنُنَزِّلُ مِنَ ٱلْقُرْءَانِ مَا هُوَ شِفَآءٌ وَرَحْمَةٌ",
      en: "And We send down of the Qur'an that which is healing and mercy. (17:82)",
    },
  },
  {
    day: 5,
    startSurah: "Ash-Shu'ara",
    startSurahArabic: "الشعراء",
    endSurah: "Ya-Sin",
    endSurahArabic: "يس",
    surahCount: 11,
    estimatedPages: 84,
    reciterUrl: "https://quran.com/26",
    verse: {
      ar: "ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ",
      en: "Verily, in the remembrance of Allah do hearts find rest. (13:28)",
    },
  },
  {
    day: 6,
    startSurah: "As-Saffat",
    startSurahArabic: "الصافات",
    endSurah: "Al-Hujurat",
    endSurahArabic: "الحجرات",
    surahCount: 13,
    estimatedPages: 86,
    reciterUrl: "https://quran.com/37",
    verse: {
      ar: "وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
      en: "And We have certainly made the Qur'an easy for remembrance, so is there any who will remember? (54:17)",
    },
  },
  {
    day: 7,
    startSurah: "Qaf",
    startSurahArabic: "ق",
    endSurah: "An-Nas",
    endSurahArabic: "الناس",
    surahCount: 65,
    estimatedPages: 61,
    reciterUrl: "https://quran.com/50",
    verse: {
      ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ ٱلْقُرْءَانَ وَعَلَّمَهُ",
      en: "The best of you are those who learn the Qur'an and teach it. (Bukhari)",
    },
  },
];
