//server/vendor.service.ts
import { ID, Vendor, CreateVendorRequest, PaymentMethod, VendorCategory, VendorStatus, PaymentTerms } from "shared-types"
import { VendorModel } from "../models/vendor.model";
import { supabase } from '../db/supabaseClient';
export async function create(
    request: CreateVendorRequest
): Promise<Vendor> {
    try {
        const newVendorModel = new VendorModel({
            name: request.name,
            contact_name: request.contact_name,
            phone: request.phone,
            email: request.email,
            address: request.address,
            website: (request as any).website, // אם קיים ב-CreateVendorRequest, ודא שהטיפוס כולל זאת
            tax_id: request.taxId,
            payment_terms: PaymentTerms.COD,
            preferred_payment_method: request.preferred_payment_method,
            category: request.category,
            status: VendorStatus.Inactive, // סטטוס ברירת מחדל אם לא נשלח
            notes: request.notes,
            document_ids: request.document_ids || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        const { data, error } = await supabase
            .from('vendor')
            .insert(newVendorModel.toDatabaseFormat())
            .select()
            .single();
        if (error) {
            console.error('Error creating vendor:', error);
            throw new Error('Failed to create vendor');
        }

        return new VendorModel({
            id: data.id,
            name: data.name,
            contact_name: data.contact_name,
            phone: data.phone,
            email: data.email,
            address: data.address,
            website: (data as any).website, // אם קיים ב-CreateVendorRequest, ודא שהטיפוס כולל זאת
            tax_id: data.taxId,
            payment_terms: data.payment_terms,
            preferred_payment_method: data.preferred_payment_method,
            category: data.category,
            status: data.status, // סטטוס ברירת מחדל אם לא נשלח
            notes: data.notes,
            document_ids: data.document_ids,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    } catch (e) {
        console.error('Exception in createLoungePricing:', e);
        throw e;
    }
}
export async function getAllVendors(): Promise<Vendor[] | null> {
    console.log('Fetching all vendors');
    try {
        const { data, error } = await supabase
            .from('vendor')
            .select('*')
            .eq('active', true);

        if (error) {
            console.error('Error fetching vendors:', error);
            throw new Error('Failed to fetch vendors');
        }

        if (!data) return null;
        return data.map((vendor) => new VendorModel({
            id: vendor.id,
            name: vendor.name,
            contact_name: vendor.contact_name,
            phone: vendor.phone,
            email: vendor.email,
            address: vendor.address,
            website: vendor.website,
            tax_id: vendor.taxId,
            payment_terms: vendor.payment_terms,
            preferred_payment_method: vendor.preferred_payment_method,
            category: vendor.category,
            status: vendor.status,
            notes: vendor.notes,
            document_ids: vendor.document_ids,
            createdAt: vendor.createdAt,
            updatedAt: vendor.updatedAt,
        }));
    } catch (e) {
        console.error('Exception in getAllVendors:', e);
        throw e;
    }
}
export async function getVendorById(id: string): Promise<Vendor | null> {
    try {
        const { data, error } = await supabase
            .from('vendor')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching vendor by ID:', error);
            throw new Error('Failed to fetch vendor');
        }
        if (!data) return null;
        return new VendorModel({
            id: data.id,
            name: data.name,
            contact_name: data.contact_name,
            phone: data.phone,
            email: data.email,
            address: data.address,
            website: (data as any).website,
            tax_id: data.taxId,
            payment_terms: data.payment_terms,
            preferred_payment_method: data.preferred_payment_method,
            category: data.category,
            status: data.status,
            notes: data.notes,
            document_ids: data.document_ids,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    } catch (e) {
        console.error('Exception in getVendorById:', e);
        throw e;
    }
}
export async function deleteVendor(id: ID): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('vendor')
            .update({ active: false, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Error deleting vendor:', error);
            throw new Error("Failed to delete vendor");
        }

        return true;
    } catch (e) {
        console.error('Exception in deleteLoungePricing:', e);
        throw e;
    }
}
