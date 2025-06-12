import { ID } from "../types/core";
import { CustomerModel } from "../models/customer.model";
import{CustomerStatus} from '../types/customer'

export const getAllCustomers = async (): Promise<CustomerModel[]> => {
    //אמור לשלוף את כל הלקוחות
    return []; // להחזיר מערך של לקוחות
}

export const getCustomerById = async (id: string): Promise<CustomerModel | null> =>{
    //שולף לקוח לפי ID
return null;
}

export const getCustomerByName = async (name:string):Promise<CustomerModel | null>=>{
    //שולף לקוח לפי שם
return null;
}

export const getCustomerByEmail = async (email:string):Promise<CustomerModel|null>=>{
    //שולף לקוח לפי אימייל
    return null;
}

export const getCustomerByPhone = async (phone:string):Promise<CustomerModel|null>=>{
    //שולף לקוח לפי טלפון
    return null;
}

export const getCustomerByStatus = async (status:CustomerStatus):Promise<CustomerModel[]|null>=>{
    //שליפת לקוחות לפי סטטוס
    return [];
}

export const getByDateJoin= async (dateFrom:Date,dateEnd:Date):Promise<CustomerModel[]|null>=>{
    //חיפוש לקוחות לפי תאריך הצטרפות(מ- עד)
    return null;
}

export const putCustomer = async (id:ID):Promise<void>=>{
//עדכון פרטי לקוח
}