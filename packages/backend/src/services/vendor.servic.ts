// vendor-service.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { VendorModel } from '../models/vendor.model';
// import { VendorModel } from '../models/Vendor';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export class VendorService {
    async createVendor(vendor: VendorModel): Promise<VendorModel | null> {
  try {
    const { data, error } = await supabase
      .from('vendor')
      .insert([vendor.toDatabaseFormat()])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase Insert Error:', error);
      return null;
    }

    return data as VendorModel;
  } catch (err) {
    console.error('❌ Unexpected Error in createVendor:', err);
    return null;
  }
}


    async getAllVendors(): Promise<VendorModel[] | null> {
  const { data, error } = await supabase.from('vendor').select('*');
  if (error) {
    console.error('❌ Supabase Select Error:', error);
    return null;
  }
  return data as VendorModel[];
}

    async getVendorById(id: string): Promise<VendorModel | null> {
        const { data, error } = await supabase.from('vendors').select('*').eq('id', id).single();
        if (error) return null;
        return data as VendorModel;
    }

    async updateVendor(id: string, vendor: VendorModel): Promise<VendorModel | null> {
        const { data, error } = await supabase.from('vendors').update([vendor.toDatabaseFormat()]).eq('id', id).select().single();
        if (error) return null;
        return data as VendorModel;
    }

    async deleteVendor(id: string): Promise<boolean> {
        const { error } = await supabase.from('vendors').delete().eq('id', id);
        return !error;
    }
}

