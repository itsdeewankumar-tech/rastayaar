/** Shared by autocomplete, route filters and the graph. Aliases never depend on UI language. */
const groups: Record<string, string[]> = {
  khokhrapar: ["khokrapar", "کھوکھراپار"],
  "oak tower": ["اوک ٹاور"],
  muslim: ["muslim coach", "muslim cross"],
  iobm: [
    "cbm",
    "cbm university",
    "cbm campus",
    "cbm iobm",
    "iobm university",
    "institute of business management",
    "سی بی ایم",
    "آئی او بی ایم",
  ],
  "nipa chorangi": ["nipa", "nipa chowrangi", "نیپا", "نیپا چورنگی"],
  "ned university": ["ned", "ned university karachi", "این ای ڈی", "این ای ڈی یونیورسٹی"],
  saddar: ["sadar", "صدر"],
  gulberg: ["گلبرگ"],
  "water pump": ["واٹر پمپ"],
  "shaheen complex": ["شاہین کمپلیکس"],
  "arts council": ["art council", "آرٹس کونسل"],
  "press club": ["karachi press club", "پریس کلب"],
  "governor house": ["گورنر ہاؤس"],
  tower: ["ٹاور"],
  numaish: ["numaish chorangi", "numaish chowrangi", "نمائش"],
  "malir halt": ["maleer halt", "ملیر ہالٹ"],
  "korangi 6": ["korangi no 6", "korangi no.6", "korangi number 6", "کورنگی 6", "کورنگی چھ"],
  gulbai: ["gulbai chowk", "گلبائی"],
  "sher shah": ["shershah", "sher shah chowk", "شیر شاہ"],
  "fast university": ["fast", "fast nuces", "فاسٹ یونیورسٹی"],
  maskan: ["maskan gate", "muskan gate", "iba main campus", "iba karachi", "مسکن"],
  "sohrab goth": ["sohrab goth chorangi", "سہراب گوٹھ"],
  "gulshan chorangi": ["گلشن چورنگی"],
  "model colony": ["ماڈل کالونی"],
};
function basic(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[.,/()–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const aliases = new Map<string, string>();
for (const [key, values] of Object.entries(groups)) {
  for (const value of [key, ...values]) aliases.set(basic(value), key);
}
export function canonicalPlace(value: string): string {
  const key = basic(value).replace(/\s+(station|bus stop|terminal)$/, "");
  return aliases.get(key) ?? key;
}
export const URDU_PLACES: Record<string, string> = {
  "sohrab goth": "سہراب گوٹھ",
  nursery: "نرسری",
  quaidabad: "قائد آباد",
  "nagan chorangi": "ناگن چورنگی",
  banaras: "بنارس",
  sultanabad: "سلطان آباد",
  "korangi crossing": "کورنگی کراسنگ",
  "oak tower": "اوک ٹاور",
  "avari tower": "آواری ٹاور",
  "mehran hotel": "مہران ہوٹل",
  "zainab market": "زینب مارکیٹ",
  karsaz: "کارساز",
  "drigh road": "ڈرگ روڈ",
  "tariq road": "طارق روڈ",
  "noorani kabab": "نورانی کباب",
  "light house": "لائٹ ہاؤس",
  "jama cloth": "جامع کلاتھ",
  "machli chowk": "مچھلی چوک",
  "pakistan marine academy": "پاکستان میرین اکیڈمی",
  "yunus abad": "یونس آباد",
  "awami markaz": "عوامی مرکز",
  "baloch colony": "بلوچ کالونی",
  "colony gate": "کالونی گیٹ",
  "natha khan": "ناتھا خان",
  "chota gate": "چھوٹا گیٹ",
  "wireless gate": "وائرلیس گیٹ",
  "agra taj colony": "آگرہ تاج کالونی",
  "golden market": "گولڈن مارکیٹ",
  "truck adda": "ٹرک اڈہ",
  "taj complex": "تاج کمپلیکس",
  "gulshan e hadeed": "گلشن حدید",
  khokhrapar: "کھوکھراپار",
  dockyard: "ڈاکیارڈ",
  powerhouse: "پاور ہاؤس",
  "indus hospital": "انڈس ہسپتال",
  "nasir jump": "ناصر جمپ",
  "ibrahim hyderi": "ابراہیم حیدری",

  iobm: "آئی او بی ایم / سی بی ایم",
  "nipa chorangi": "نیپا چورنگی",
  "ned university": "این ای ڈی یونیورسٹی",
  saddar: "صدر",
  gulberg: "گلبرگ",
  "water pump": "واٹر پمپ",
  "shaheen complex": "شاہین کمپلیکس",
  "arts council": "آرٹس کونسل",
  "press club": "پریس کلب",
  "governor house": "گورنر ہاؤس",
  tower: "ٹاور",
  numaish: "نمائش",
  "malir halt": "ملیر ہالٹ",
  "korangi 6": "کورنگی 6",
  gulbai: "گلبائی",
  "sher shah": "شیر شاہ",
  "gulshan chorangi": "گلشن چورنگی",
  "model colony": "ماڈل کالونی",
};
