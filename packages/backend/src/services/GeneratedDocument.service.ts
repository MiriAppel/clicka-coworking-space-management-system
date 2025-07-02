import { UUID } from 'crypto';
import { CustomerModel } from '../models/customer.model';
import {
    DocumentTemplateModel,
    DocumentType
} from '../models/document.model';
import { createClient } from "@supabase/supabase-js";
import { ID } from 'shared-types';
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || ""; // שימי לב לשם המדויק
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "חסרים ערכים ל־SUPABASE_URL או SUPABASE_SERVICE_KEY בקובץ הסביבה"
  );
}
const supabase = createClient(supabaseUrl, supabaseKey);


// Helper function
function generateDocumentId(): string {
    return 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

// Database Functions
export const getAllDocumentTemplates = async (): Promise<DocumentTemplateModel[]> => {
    const { data, error } = await supabase
        .from('document_template')
        .select('*')
        

    if (error) throw new Error(`Database error: ${error.message}`);
    return data || [];
};

export const getActiveDocumentTemplates = async (): Promise<DocumentTemplateModel[]> => {
    const { data, error } = await supabase
        .from('document_template')
        .select('*')
        .eq('active', true)
        // .order('created_at', { ascending: false })
        ;

    if (error) throw new Error(`Database error: ${error.message}`);
    return data || [];
};

export const createDocumentTemplate = async (templateData:DocumentTemplateModel,customer_id:ID): Promise<DocumentTemplateModel> => {

    const now = new Date().toISOString();
    // יצירת אובייקט פשוט ללא המודל
    const templateToInsert = {
       customer_id: customer_id,
        type: templateData.type ?? "RECEIPT",
        language: templateData.language ?? 'english',
        template: templateData.template ?? "",
        variables: templateData.variables ?? [],
        is_default: templateData.isDefault ?? false,
        active: templateData.active ?? true,
        created_at: now,
        updated_at: now
    };

    console.log('🔍 Inserting to DB:', templateToInsert);

    const { data, error } = await supabase
        .from('document_template')
        .insert([templateToInsert])
        .select()
        .single();
        console.log('🔍 Inserted data:', data);
    if (error) {
        console.error('❌ DB Error:', error);
        throw new Error(`Database error: ${error.message}`);
    }
    
    return data;
};
export const updateDocumentTemplate = async (id: string, updateData: Partial<DocumentTemplateModel>): Promise<DocumentTemplateModel | null> => {
    const updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
        .from('document_template')
        .update({ ...updateData, updated_at })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Database error: ${error.message}`);
    }
    return data;
};

export const deleteDocumentTemplate = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('document_template')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Database error: ${error.message}`);
    return true;
};

export const getDocumentTemplateById = async (id: string): Promise<DocumentTemplateModel | null> => {
    const { data, error } = await supabase
        .from('document_template')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Database error: ${error.message}`);
    }
    return data;
};

export const getDocumentTemplatesByType = async (type: DocumentType): Promise<DocumentTemplateModel[]> => {
    const { data, error } = await supabase
        .from('document_template')
        .select('*')
        .eq('type', type)
        // .order('updated_at', { ascending: false })
        ;

    if (error) throw new Error(`Database error: ${error.message}`);
    return data || [];
};

// Service Functions for Controller
export const getAllTemplates = async (): Promise<DocumentTemplateModel[]> => {
    try{
        return await getAllDocumentTemplates();
    }catch(error){
        console.error('Error fetching templates:', error);
        throw error;
    }
};

export const getActiveTemplates = async (): Promise<DocumentTemplateModel[]> => {
    return await getActiveDocumentTemplates();
};

export const addTemplate = async (templateData: DocumentTemplateModel, customer_id:ID): Promise<DocumentTemplateModel> => {
    return await createDocumentTemplate(templateData,customer_id);
};

export const updateTemplate = async (id: string, updatedTemplate: Partial<DocumentTemplateModel>): Promise<DocumentTemplateModel | null> => {
    return await updateDocumentTemplate(id, updatedTemplate);
};

export const deleteTemplate = async (id: string): Promise<boolean> => {
    return await deleteDocumentTemplate(id);
};

export const toggleTemplateStatus = async (id: string): Promise<DocumentTemplateModel | null> => {
    const template = await getDocumentTemplateById(id);
    if (!template) return null;
    return await updateDocumentTemplate(id, { active: !template.active });
};

// Utility Functions
export const injectVariables = (
    template: string,
    staticVariables: Record<string, string>,
    dynamicVariables: Record<string, string>
): string => {
    let result = Object.keys(staticVariables).reduce((res, key) => {
        return res.replace(new RegExp(`{{${key}}}`, 'g'), staticVariables[key]);
    }, template);
    
    result = Object.keys(dynamicVariables).reduce((res, key) => {
        return res.replace(new RegExp(`{{${key}}}`, 'g'), dynamicVariables[key]);
    }, result);
    
    return result;
};

export const formatCardNumber = (cardNumber: string): string => {
    if (!cardNumber || cardNumber.length < 4) return '*****';
    return `*****${cardNumber.slice(-4)}`;
};