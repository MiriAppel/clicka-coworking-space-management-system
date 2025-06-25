type ID = string;

interface TranslationRecord {
  id: ID;
  key: string;         // המילה או הביטוי המקורי במפתח
  en: string;          // תרגום לאנגלית
  he: string;          // תרגום לעברית
  es: string;          // תרגום לספרדית
  fr: string;          // תרגום לצרפתית
  de: string;          // תרגום לגרמנית
  createdAt: Date;
  updatedAt: Date;
}

export class TranslationModel implements TranslationRecord {
  id: ID;
  key: string;
  en: string;
  he: string;
  es: string;
  fr: string;
  de: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: ID,
    key: string,
    en: string,
    he: string,
    es: string,
    fr: string,
    de: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.key = key;
    this.en = en;
    this.he = he;
    this.es = es;
    this.fr = fr;
    this.de = de;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      key: this.key,
      en: this.en,
      he: this.he,
      es: this.es,
      fr: this.fr,
      de: this.de,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
