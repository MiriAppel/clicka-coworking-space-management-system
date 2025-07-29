import { DateISO, ID } from 'shared-types';
import { DocumentTemplate ,DocumentType} from 'shared-types';

// Class
export class DocumentTemplateModel implements DocumentTemplate {
  id: ID;
  type: DocumentType;
  language: 'hebrew' | 'english';
  template: string;
  variables: string[];
  isDefault: boolean;
  active: boolean;
  createdAt: DateISO;
  updatedAt: DateISO;
  name: string;
  constructor(
  id: ID,
  type: DocumentType,
  language: 'hebrew' | 'english',
  template: string,
  variables: string[],
  isDefault: boolean,
  active: boolean,
  createdAt: DateISO,
  updatedAt: DateISO,
   name: string
  ) {
    this.id = id;
    this.type = type;
    this.language = language;
    this.template = template;
    this.variables = variables;
    this.isDefault = isDefault;
    this.active = active;
    this.createdAt = createdAt ?? new Date().toISOString();
    this.updatedAt = updatedAt ?? new Date().toISOString();
    this.name = name;
  }

  toDatabaseFormat() {
    return {
      type: this.type,
      language: this.language,
      template: this.template,
      variables: this.variables,
      isDefault: this.isDefault,
      active: this.active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name
    };
  }
}