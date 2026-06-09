/**
 * Client-Side Dictionary Service
 * Calls free public APIs directly from the browser — no auth required.
 *
 * English: Free Dictionary API  https://api.dictionaryapi.dev
 * Japanese: Jisho API           https://jisho.org/api/v1/search/words
 */

export interface EnglishLookupResult {
  word: string;
  pos: string;
  phonetic: string;
  definition_en: string;
  example: string;
  audio_url: string;
  source: "freedictionary";
}

export interface JapaneseLookupResult {
  word: string;
  reading: string;
  pos: string;
  definition_en: string;
  source: "jisho";
}

export type DictResult = EnglishLookupResult | JapaneseLookupResult;

/** Look up an English word using the Free Dictionary API (no CORS issues) */
export async function lookupEnglish(word: string): Promise<EnglishLookupResult | null> {
  try {
    const resp = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!resp.ok) return null;
    const data: any[] = await resp.json();
    if (!data || !data.length) return null;

    const entry = data[0];
    const meanings = entry.meanings || [];
    let pos = "";
    let definition_en = "";
    let example = "";
    let audio_url = "";
    let phonetic = entry.phonetic || "";

    if (meanings.length) {
      const first = meanings[0];
      pos = first.partOfSpeech || "";
      const defs = first.definitions || [];
      if (defs.length) {
        definition_en = defs[0].definition || "";
        example = defs[0].example || "";
      }
    }

    // pick phonetic from phonetics array if not already set
    if (!phonetic) {
      for (const ph of entry.phonetics || []) {
        if (ph.text) { phonetic = ph.text; break; }
      }
    }

    for (const ph of entry.phonetics || []) {
      if (ph.audio) { audio_url = ph.audio; break; }
    }

    return { word: entry.word || word, pos, phonetic, definition_en, example, audio_url, source: "freedictionary" };
  } catch {
    return null;
  }
}

/** Look up a Japanese word using the Jisho API */
export async function lookupJapanese(word: string): Promise<JapaneseLookupResult | null> {
  try {
    const resp = await fetch(
      `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(word)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    const results: any[] = data.data || [];
    if (!results.length) return null;

    const entry = results[0];
    const jpInfo = (entry.japanese || [{}])[0];
    const reading = jpInfo.reading || jpInfo.word || word;
    const senses: any[] = entry.senses || [];
    let pos = "";
    let definition_en = "";

    if (senses.length) {
      const first = senses[0];
      const posList: string[] = first.parts_of_speech || [];
      pos = posList[0] || "";
      const engDefs: string[] = first.english_definitions || [];
      definition_en = engDefs.slice(0, 3).join("; ");
    }

    return { word, reading, pos, definition_en, source: "jisho" };
  } catch {
    return null;
  }
}

/** Auto-detect language and look up the word */
export async function lookupWord(word: string): Promise<DictResult | null> {
  const isJapanese = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(word);
  if (isJapanese) return lookupJapanese(word);
  return lookupEnglish(word);
}
