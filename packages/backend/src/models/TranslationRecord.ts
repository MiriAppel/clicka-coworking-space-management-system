type ID = string;

interface TranslationRecord {
  id: ID;
  key: string;         // המילה או הביטוי המקורי במפתח
  en: string;          // תרגום לאנגלית
  he: string;          // תרגום לעברית
  createdAt: Date;
  updatedAt: Date;
}

export class TranslationModel implements TranslationRecord {
  id: ID;
  key: string;
  en: string;
  he: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: ID,
    key: string,
    en: string,
    he: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.key = key;
    this.en = en;
    this.he = he;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      key: this.key,
      en: this.en,
      he: this.he,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
