import { prisma } from "./lib/prisma";
import { hashPassword } from "./lib/auth";

// Seed content per PRD Appendices 1-6 + Learning Content 12 (sample packs).
// Mirrors the SKU model in Appendix 13: LEX-ENG-G7-001, LEX-SAT-ADV-001,
// LEX-SPA-BEG-001, LEX-HEB-BEG-001.

const ENGLISH_WORDS = [
  ["Discipline", "noun", "The practice of training yourself to follow rules or a code of behavior.", "She showed great discipline by studying every day."],
  ["Resilient", "adjective", "Able to recover quickly from difficulties.", "He stayed resilient after losing the first game."],
  ["Integrity", "noun", "The quality of being honest and having strong moral principles.", "Her integrity made everyone trust her."],
  ["Empathy", "noun", "The ability to understand and share the feelings of others.", "Good friends show empathy when you are sad."],
  ["Persevere", "verb", "To continue trying despite difficulty.", "She persevered through the hard math problem."],
  ["Ambitious", "adjective", "Having a strong desire to succeed.", "He is ambitious about becoming a doctor."],
  ["Determination", "noun", "Firmness of purpose; resolve.", "Her determination helped her finish the race."],
  ["Accountable", "adjective", "Required to explain your actions; responsible.", "A good leader is accountable for mistakes."],
  ["Courageous", "adjective", "Able to face danger or fear without being stopped.", "The firefighter was courageous during the rescue."],
  ["Tenacious", "adjective", "Holding firmly to a course of action.", "The tenacious puppy would not let go of the rope."],
] as const;

const SAT_WORDS = [
  ["Ephemeral", "adjective", "Lasting for a very short time.", "The beauty of cherry blossoms is ephemeral."],
  ["Ubiquitous", "adjective", "Present, appearing, or found everywhere.", "Smartphones have become ubiquitous in modern life."],
  ["Pragmatic", "adjective", "Dealing with things sensibly and realistically.", "She took a pragmatic approach to the budget problem."],
  ["Meticulous", "adjective", "Showing great attention to detail.", "The scientist was meticulous in recording every result."],
  ["Ambivalent", "adjective", "Having mixed feelings about something.", "He felt ambivalent about moving to a new city."],
  ["Altruistic", "adjective", "Showing selfless concern for others.", "Her altruistic actions helped the entire community."],
  ["Synthesize", "verb", "To combine separate elements into a whole.", "The essay synthesizes ideas from three different sources."],
  ["Analyze", "verb", "To examine something in detail.", "Scientists analyze the data before drawing conclusions."],
  ["Evaluate", "verb", "To judge or determine the value of something.", "Teachers evaluate essays based on a clear rubric."],
  ["Eloquent", "adjective", "Fluent and persuasive in speaking or writing.", "The speaker gave an eloquent farewell address."],
] as const;

const SPANISH_WORDS = [
  ["Amigo", "Friend", "AH-mee-goh", "Mi amigo me ayuda con la tarea."],
  ["Familia", "Family", "fah-MEE-lee-ah", "Mi familia cena junta cada noche."],
  ["Feliz", "Happy", "feh-LEEZ", "Estoy feliz de verte hoy."],
  ["Casa", "House", "KAH-sah", "Vivo en una casa azul."],
  ["Corazon", "Heart", "koh-rah-SOHN", "Mi corazon late rapido."],
  ["Gracias", "Thank you", "GRAH-see-as", "Gracias por tu ayuda."],
  ["Facil", "Easy", "FAH-seel", "Este examen es facil."],
  ["Medio", "Half / Middle", "MEH-dee-oh", "Quiero medio sandwich."],
  ["Avanzado", "Advanced", "ah-vahn-SAH-doh", "Ella toma una clase avanzada."],
  ["Libro", "Book", "LEE-broh", "Estoy leyendo un libro nuevo."],
] as const;

const HEBREW_WORDS = [
  ["Shalom", "Peace / Hello", "shah-LOHM", "He said shalom when he arrived."],
  ["Toda", "Thank you", "toh-DAH", "Toda for your help today."],
  ["Yom", "Day", "yohm", "Every yom brings something new."],
  ["Bayit", "House", "BAH-yeet", "We are building a new bayit."],
  ["Ohev", "Love (he loves)", "oh-HEV", "He ohev his family very much."],
] as const;

const SPANISH_EXAMPLE_TRANSLATIONS: Record<string, string> = {
  Amigo: "My friend helps me with homework.",
  Familia: "My family eats dinner together every night.",
  Feliz: "I am happy to see you today.",
  Casa: "I live in a blue house.",
  Corazon: "My heart beats fast.",
  Gracias: "Thank you for your help.",
  Facil: "This test is easy.",
  Medio: "I want half a sandwich.",
  Avanzado: "She is taking an advanced class.",
  Libro: "I am reading a new book.",
};

const HEBREW_COMPANION_WORDS = [
  ["Layla", "Night", "LIE-lah", "We watched the stars every layla."],
  ["Ahava", "Love", "ah-hah-VAH", "Ahava is at the center of family life."],
] as const;

const SPANISH_COMPANION_WORDS = [
  ["Contento", "Content / Happy", "kohn-TEN-toh", "Estoy contento con mi trabajo."],
  ["Dificil", "Difficult", "dee-FEE-seel", "La prueba fue dificil."],
  ["Companero", "Friend / Companion", "kohm-pah-NYEH-roh", "Mi companero me espera en la escuela."],
] as const;

const SPANISH_TRANSLATIONS: Record<string, string> = {
  Discipline: "Disciplina",
  Resilient: "Resiliente",
  Integrity: "Integridad",
  Empathy: "Empatia",
  Persevere: "Perseverar",
  Ambitious: "Ambicioso",
  Determination: "Determinacion",
  Accountable: "Responsable",
  Courageous: "Valiente",
  Tenacious: "Tenaz",
  Ephemeral: "Efimero",
  Ubiquitous: "Ubicuo",
  Pragmatic: "Pragmatico",
  Meticulous: "Meticuloso",
  Ambivalent: "Ambivalente",
  Altruistic: "Altruista",
  Synthesize: "Sintetizar",
  Analyze: "Analizar",
  Evaluate: "Evaluar",
  Eloquent: "Elocuente",
  Brave: "Valiente",
  Diligence: "Diligencia",
  Compassion: "Compasion",
  Honorable: "Honorable",
  Responsible: "Responsable",
  Apathy: "Apatia",
  Reckless: "Imprudente",
  Driven: "Motivado",
  Fleeting: "Fugaz",
  Permanent: "Permanente",
  Widespread: "Extendido",
  Practical: "Practico",
  Thorough: "Minucioso",
  Careless: "Descuidado",
  Indecisive: "Indeciso",
  Resolute: "Resuelto",
  Selfless: "Desinteresado",
  Selfish: "Egoista",
  Articulate: "Articulado",
  Examine: "Examinar",
  Assess: "Evaluar",
  Combine: "Combinar",
};

const BADGES = [
  // Scanning
  { code: "first_scan", name: "First Scan", description: "Scanned your very first LexLoo tile.", requirement: { type: "first_scan" } },
  { code: "scan_explorer", name: "Scan Explorer", description: "Scanned 5 LexLoo tiles.", requirement: { type: "scans", count: 5 } },
  { code: "scan_master", name: "Scan Master", description: "Scanned 25 LexLoo tiles.", requirement: { type: "scans", count: 25 } },
  // Streaks
  { code: "streak_3", name: "On a Roll", description: "Practiced 3 days in a row.", requirement: { type: "streak", count: 3 } },
  { code: "streak_7", name: "7-Day Streak", description: "Learned something for 7 days in a row.", requirement: { type: "streak", count: 7 } },
  { code: "streak_14", name: "Two-Week Warrior", description: "Kept your streak alive for 14 days.", requirement: { type: "streak", count: 14 } },
  { code: "streak_30", name: "Monthly Master", description: "30 days without missing a beat.", requirement: { type: "streak", count: 30 } },
  // Words learned milestones
  { code: "words_10", name: "First Steps", description: "Learned your first 10 words.", requirement: { type: "words_learned", count: 10 } },
  { code: "words_25", name: "Word Sprout", description: "Learned 25 words.", requirement: { type: "words_learned", count: 25 } },
  { code: "words_50", name: "50 Words Learned", description: "Learned 50 words.", requirement: { type: "words_learned", count: 50 } },
  { code: "words_100", name: "Century Scholar", description: "Learned 100 words.", requirement: { type: "words_learned", count: 100 } },
  // Words mastered milestones
  { code: "words_mastered_10", name: "Sharp Mind", description: "Mastered 10 words.", requirement: { type: "words_mastered", count: 10 } },
  { code: "words_mastered_25", name: "Memory Master", description: "Mastered 25 words.", requirement: { type: "words_mastered", count: 25 } },
  { code: "words_mastered_50", name: "Elite Recall", description: "Mastered 50 words.", requirement: { type: "words_mastered", count: 50 } },
  { code: "words_mastered_100", name: "100 Words Mastered", description: "Mastered 100 words.", requirement: { type: "words_mastered", count: 100 } },
  // Quiz milestones
  { code: "quiz_champion", name: "Quiz Champion", description: "Completed your first quiz.", requirement: { type: "quiz_complete", count: 1 } },
  { code: "quiz_regular", name: "Quiz Regular", description: "Completed 5 quizzes.", requirement: { type: "quiz_complete", count: 5 } },
  { code: "quiz_veteran", name: "Quiz Veteran", description: "Completed 10 quizzes.", requirement: { type: "quiz_complete", count: 10 } },
  // Word collecting milestones
  { code: "word_collector", name: "Word Collector", description: "Saved 10 words to your collection.", requirement: { type: "words_collected", count: 10 } },
  { code: "word_hoarder", name: "Avid Collector", description: "Saved 25 words to your collection.", requirement: { type: "words_collected", count: 25 } },
  { code: "word_archivist", name: "Word Archivist", description: "Saved 50 words to your collection.", requirement: { type: "words_collected", count: 50 } },
];

const MISSIONS = [
  { code: "scan_1_tile", title: "Scan 1 tile", missionType: "daily", requirement: { type: "scan_tile", count: 1 }, xpReward: 10 },
  { code: "learn_3_words", title: "Learn 3 words", missionType: "daily", requirement: { type: "learn_words", count: 3 }, xpReward: 15 },
  { code: "complete_1_quiz", title: "Complete 1 quiz", missionType: "daily", requirement: { type: "complete_quiz", count: 1 }, xpReward: 15 },
  { code: "review_2_saved", title: "Review 2 saved words", missionType: "daily", requirement: { type: "review_saved", count: 2 }, xpReward: 10 },
];

async function main() {
  console.log("Seeding LexLoo database...");

  const english = await prisma.language.upsert({
    where: { code: "en" }, update: {}, create: { code: "en", name: "English", nativeName: "English", direction: "ltr" },
  });
  const spanish = await prisma.language.upsert({
    where: { code: "es" }, update: {}, create: { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr" },
  });
  const hebrew = await prisma.language.upsert({
    where: { code: "he" }, update: {}, create: { code: "he", name: "Hebrew", nativeName: "עברית", direction: "rtl" },
  });

  const engPack = await prisma.wordPack.upsert({
    where: { slug: "english-grade-7" }, update: {},
    create: { name: "English Vocabulary: Grade 7", slug: "english-grade-7", languageId: english.id, level: "grade_7", category: "english", sku: "LEX-ENG-G7-001", status: "published", description: "Core vocabulary words for 7th grade readers." },
  });
  const satPack = await prisma.wordPack.upsert({
    where: { slug: "sat-advanced" }, update: {},
    create: { name: "SAT Advanced Vocabulary", slug: "sat-advanced", languageId: english.id, level: "sat_advanced", category: "sat", sku: "LEX-SAT-ADV-001", status: "published", description: "High-value SAT/ACT vocabulary words." },
  });
  const spaPack = await prisma.wordPack.upsert({
    where: { slug: "spanish-beginner" }, update: {},
    create: { name: "Spanish for Beginners", slug: "spanish-beginner", languageId: english.id, targetLanguageId: spanish.id, level: "beginner", category: "language", sku: "LEX-SPA-BEG-001", status: "published", description: "Everyday Spanish words for new learners." },
  });
  const hebPack = await prisma.wordPack.upsert({
    where: { slug: "hebrew-beginner" }, update: {},
    create: { name: "Hebrew for Beginners", slug: "hebrew-beginner", languageId: english.id, targetLanguageId: hebrew.id, level: "beginner", category: "language", sku: "LEX-HEB-BEG-001", status: "published", description: "Everyday Hebrew words for new learners." },
  });

  let tileCounter = 1000;
  async function nextTileCode() {
    tileCounter += 1;
    return `LEX${tileCounter}`;
  }

  async function seedEnglishLikeWord(
    [text, pos, def, example]: readonly [string, string, string, string],
    languageId: string,
    pack: { id: string },
    difficulty: number
  ) {
    const word = await prisma.word.upsert({
      where: { id: `${pack.id}-${text}` },
      update: {},
      create: {
        id: `${pack.id}-${text}`,
        text,
        normalizedText: text.toLowerCase(),
        languageId,
        partOfSpeech: pos,
        difficultyScore: difficulty,
        gradeLevel: "general",
        status: "published",
        content: { create: { shortDefinition: def, longDefinition: def, phonetic: null, funFact: null } },
        examples: { create: [{ exampleText: example, level: "standard" }] },
        translations: { create: [{ targetLanguageId: spanish.id, translation: SPANISH_TRANSLATIONS[text] ?? text }] },
      },
    });
    await prisma.packWord.upsert({
      where: { packId_wordId: { packId: pack.id, wordId: word.id } },
      update: {},
      create: { packId: pack.id, wordId: word.id, tileRequired: true },
    });
    const tileCode = await nextTileCode();
    await prisma.tile.upsert({
      where: { tileCode },
      update: {},
      create: { tileCode, qrPayload: `lexloo://tile/${tileCode}`, packId: pack.id, wordId: word.id, status: "published" },
    });
    return { word, tileCode };
  }

  async function seedLanguageWord(
    [text, translation, transliteration, example]: readonly [string, string, string, string],
    targetLanguageId: string,
    pack: { id: string },
    exampleTranslation?: string
  ) {
    const word = await prisma.word.upsert({
      where: { id: `${pack.id}-${text}` },
      update: {},
      create: {
        id: `${pack.id}-${text}`,
        text,
        normalizedText: text.toLowerCase(),
        languageId: targetLanguageId,
        partOfSpeech: "noun",
        difficultyScore: 1,
        gradeLevel: "beginner",
        status: "published",
        content: { create: { shortDefinition: translation, longDefinition: translation } },
        translations: {
          create: [{ targetLanguageId: english.id, translation, transliteration, exampleTranslation: exampleTranslation ?? example }],
        },
        examples: { create: [{ exampleText: example, level: "beginner" }] },
      },
    });
    await prisma.packWord.upsert({
      where: { packId_wordId: { packId: pack.id, wordId: word.id } },
      update: {},
      create: { packId: pack.id, wordId: word.id, tileRequired: true },
    });
    const tileCode = await nextTileCode();
    await prisma.tile.upsert({
      where: { tileCode },
      update: {},
      create: { tileCode, qrPayload: `lexloo://tile/${tileCode}`, packId: pack.id, wordId: word.id, status: "published" },
    });
    return { word, tileCode };
  }

  const tileCodes: { pack: string; word: string; tileCode: string }[] = [];

  for (const w of ENGLISH_WORDS) {
    const { word, tileCode } = await seedEnglishLikeWord(w, english.id, engPack, 2);
    tileCodes.push({ pack: "English Grade 7", word: word.text, tileCode });
  }
  for (const w of SAT_WORDS) {
    const { word, tileCode } = await seedEnglishLikeWord(w, english.id, satPack, 7);
    tileCodes.push({ pack: "SAT Advanced", word: word.text, tileCode });
  }
  for (const w of SPANISH_WORDS) {
    const { word, tileCode } = await seedLanguageWord(w, spanish.id, spaPack, SPANISH_EXAMPLE_TRANSLATIONS[w[0]]);
    tileCodes.push({ pack: "Spanish Beginner", word: word.text, tileCode });
  }
  for (const w of HEBREW_WORDS) {
    const { word, tileCode } = await seedLanguageWord(w, hebrew.id, hebPack);
    tileCodes.push({ pack: "Hebrew Beginner", word: word.text, tileCode });
  }

  // Companion words give the Spanish/Hebrew beginner packs synonym/antonym
  // relations, matching the English/SAT packs (not assigned to any pack/tile).
  async function seedLanguageCompanionWord(
    [text, translation, transliteration, example]: readonly [string, string, string, string],
    targetLanguageId: string
  ) {
    const id = `companion-${targetLanguageId}-${text}`;
    return prisma.word.upsert({
      where: { id },
      update: {},
      create: {
        id,
        text,
        normalizedText: text.toLowerCase(),
        languageId: targetLanguageId,
        partOfSpeech: "adjective",
        difficultyScore: 1,
        gradeLevel: "beginner",
        status: "published",
        content: { create: { shortDefinition: translation, longDefinition: translation } },
        translations: { create: [{ targetLanguageId: english.id, translation, transliteration, exampleTranslation: example }] },
        examples: { create: [{ exampleText: example, level: "beginner" }] },
      },
    });
  }

  const languageCompanionWords = new Map<string, { id: string }>();
  for (const w of SPANISH_COMPANION_WORDS) {
    languageCompanionWords.set(w[0], await seedLanguageCompanionWord(w, spanish.id));
  }
  for (const w of HEBREW_COMPANION_WORDS) {
    languageCompanionWords.set(w[0], await seedLanguageCompanionWord(w, hebrew.id));
  }

  // Synonyms/antonyms for the English and SAT packs (Screen 24: Word Detail
  // Synonyms — "Content: Synonyms, antonyms"). Companion words below exist
  // solely to give every pack word at least one real related word; they are
  // not assigned to any pack/tile.
  const COMPANION_WORDS = [
    ["Brave", "adjective", "Able to face danger without fear; courageous."],
    ["Diligence", "noun", "Careful and persistent effort or work."],
    ["Compassion", "noun", "Sympathetic concern for the suffering of others."],
    ["Honorable", "adjective", "Acting with honesty and strong moral principles."],
    ["Responsible", "adjective", "Required to account for one's actions; reliable."],
    ["Apathy", "noun", "A lack of interest, concern, or feeling."],
    ["Reckless", "adjective", "Without thought or care for the consequences of an action."],
    ["Driven", "adjective", "Highly motivated to succeed; ambitious."],
    ["Fleeting", "adjective", "Passing swiftly; not lasting long."],
    ["Permanent", "adjective", "Lasting or remaining without essential change."],
    ["Widespread", "adjective", "Found or distributed over a large area; very common."],
    ["Practical", "adjective", "Concerned with the actual doing of something rather than theory."],
    ["Thorough", "adjective", "Complete with great attention to every detail."],
    ["Careless", "adjective", "Not giving sufficient attention or thought to avoiding harm or errors."],
    ["Indecisive", "adjective", "Unable to make decisions quickly or effectively."],
    ["Resolute", "adjective", "Admirably purposeful, determined, and unwavering."],
    ["Selfless", "adjective", "Concerned more with the needs of others than with one's own."],
    ["Selfish", "adjective", "Lacking consideration for others; concerned mainly with one's own profit or pleasure."],
    ["Articulate", "adjective", "Able to express oneself fluently and coherently."],
    ["Examine", "verb", "To inspect or scrutinize carefully."],
    ["Assess", "verb", "To evaluate or estimate the nature, ability, or quality of something."],
    ["Combine", "verb", "To merge or unite into a single entity."],
  ] as const;

  const companionWords = new Map<string, { id: string }>();
  for (const [text, pos, def] of COMPANION_WORDS) {
    const id = `companion-${text}`;
    const word = await prisma.word.upsert({
      where: { id },
      update: {},
      create: {
        id,
        text,
        normalizedText: text.toLowerCase(),
        languageId: english.id,
        partOfSpeech: pos,
        difficultyScore: 4,
        gradeLevel: "general",
        status: "published",
        content: { create: { shortDefinition: def, longDefinition: def } },
        examples: { create: [{ exampleText: `The word ${text.toLowerCase()} helps describe an important idea clearly.`, level: "standard" }] },
        translations: { create: [{ targetLanguageId: spanish.id, translation: SPANISH_TRANSLATIONS[text] ?? text }] },
      },
    });
    companionWords.set(text, word);
  }

  async function addRelation(wordId: string, relatedWordId: string, relationType: "synonym" | "antonym") {
    await prisma.wordRelation.upsert({
      where: { id: `${wordId}-${relatedWordId}` },
      update: {},
      create: { id: `${wordId}-${relatedWordId}`, wordId, relatedWordId, relationType },
    });
    await prisma.wordRelation.upsert({
      where: { id: `${relatedWordId}-${wordId}` },
      update: {},
      create: { id: `${relatedWordId}-${wordId}`, wordId: relatedWordId, relatedWordId: wordId, relationType },
    });
  }

  async function relatePackWord(packId: string, text: string, companionText: string, relationType: "synonym" | "antonym") {
    const word = await prisma.word.findUnique({ where: { id: `${packId}-${text}` } });
    const companion = companionWords.get(companionText);
    if (word && companion) await addRelation(word.id, companion.id, relationType);
  }

  async function relatePackWords(packId: string, textA: string, textB: string, relationType: "synonym" | "antonym") {
    const wordA = await prisma.word.findUnique({ where: { id: `${packId}-${textA}` } });
    const wordB = await prisma.word.findUnique({ where: { id: `${packId}-${textB}` } });
    if (wordA && wordB) await addRelation(wordA.id, wordB.id, relationType);
  }

  await relatePackWords(engPack.id, "Resilient", "Tenacious", "synonym");
  await relatePackWords(engPack.id, "Persevere", "Tenacious", "synonym");
  await relatePackWords(engPack.id, "Determination", "Tenacious", "synonym");
  await relatePackWord(engPack.id, "Discipline", "Diligence", "synonym");
  await relatePackWord(engPack.id, "Integrity", "Honorable", "synonym");
  await relatePackWord(engPack.id, "Empathy", "Compassion", "synonym");
  await relatePackWord(engPack.id, "Empathy", "Apathy", "antonym");
  await relatePackWord(engPack.id, "Ambitious", "Driven", "synonym");
  await relatePackWord(engPack.id, "Accountable", "Responsible", "synonym");
  await relatePackWord(engPack.id, "Courageous", "Brave", "synonym");
  await relatePackWord(engPack.id, "Courageous", "Reckless", "antonym");

  await relatePackWords(satPack.id, "Analyze", "Synthesize", "antonym");
  await relatePackWords(satPack.id, "Analyze", "Evaluate", "synonym");
  await relatePackWord(satPack.id, "Ephemeral", "Fleeting", "synonym");
  await relatePackWord(satPack.id, "Ephemeral", "Permanent", "antonym");
  await relatePackWord(satPack.id, "Ubiquitous", "Widespread", "synonym");
  await relatePackWord(satPack.id, "Pragmatic", "Practical", "synonym");
  await relatePackWord(satPack.id, "Meticulous", "Thorough", "synonym");
  await relatePackWord(satPack.id, "Meticulous", "Careless", "antonym");
  await relatePackWord(satPack.id, "Ambivalent", "Indecisive", "synonym");
  await relatePackWord(satPack.id, "Ambivalent", "Resolute", "antonym");
  await relatePackWord(satPack.id, "Altruistic", "Selfless", "synonym");
  await relatePackWord(satPack.id, "Altruistic", "Selfish", "antonym");
  await relatePackWord(satPack.id, "Eloquent", "Articulate", "synonym");
  await relatePackWord(satPack.id, "Analyze", "Examine", "synonym");
  await relatePackWord(satPack.id, "Evaluate", "Assess", "synonym");
  await relatePackWord(satPack.id, "Synthesize", "Combine", "synonym");

  async function relateLanguagePackWord(packId: string, text: string, companionText: string, relationType: "synonym" | "antonym") {
    const word = await prisma.word.findUnique({ where: { id: `${packId}-${text}` } });
    const companion = languageCompanionWords.get(companionText);
    if (word && companion) await addRelation(word.id, companion.id, relationType);
  }

  await relateLanguagePackWord(spaPack.id, "Feliz", "Contento", "synonym");
  await relateLanguagePackWord(spaPack.id, "Facil", "Dificil", "antonym");
  await relateLanguagePackWord(spaPack.id, "Amigo", "Companero", "synonym");

  await relateLanguagePackWord(hebPack.id, "Yom", "Layla", "antonym");
  await relateLanguagePackWord(hebPack.id, "Ohev", "Ahava", "synonym");

  for (const b of BADGES) {
    await prisma.badge.upsert({
      where: { code: b.code },
      update: {},
      create: { code: b.code, name: b.name, description: b.description, requirementJson: JSON.stringify(b.requirement) },
    });
  }

  for (const m of MISSIONS) {
    await prisma.mission.upsert({
      where: { code: m.code },
      update: {},
      create: { code: m.code, title: m.title, missionType: m.missionType, requirementJson: JSON.stringify(m.requirement), xpReward: m.xpReward },
    });
  }

  // Demo accounts so the app is testable immediately without registering.
  const adminEmail = "admin@lexloo.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: await hashPassword("LexLooAdmin123!"),
        displayName: "LexLoo Admin",
        role: "admin",
      },
    });
  }

  const demoEmail = "demo@lexloo.com";
  const existingDemo = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!existingDemo) {
    const demoUser = await prisma.user.create({
      data: {
        email: demoEmail,
        passwordHash: await hashPassword("LexLooDemo123!"),
        displayName: "Demo Student",
        role: "student",
      },
    });
    const demoProfile = await prisma.profile.create({
      data: { userId: demoUser.id, profileType: "student", name: "Demo Student", ageRange: "11-14", gradeLevel: "grade_7" },
    });
    await prisma.streak.create({ data: { profileId: demoProfile.id } });
  }

  console.log("Seed complete.");
  console.log("Admin login: admin@lexloo.com / LexLooAdmin123!");
  console.log("Demo login: demo@lexloo.com / LexLooDemo123!");
  console.log("Sample tile codes (first 5):", tileCodes.slice(0, 5));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
