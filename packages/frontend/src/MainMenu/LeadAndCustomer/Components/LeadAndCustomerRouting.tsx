import { Route, Routes } from "react-router-dom";
import { LeadAndCustomer } from "./leadAndCustomer";
import { CustomersList } from "./Customers/customersList";
import { CustomerDetails } from "./Customers/customerDetails";
import { ContractManagement } from "./Contracts/contractManagement";
import { AddContract } from "./Contracts/addContract";
import { ContractDetails } from "./Contracts/contractDetails";
import { CustomerDashboard } from "./Customers/customerDashboard";
import { LeadHomePage } from "./Leads/leadHomePage";
import { LeadIntersection } from "./Interactions/leadIntersection";
import { DetailsOfTheLead } from "./Leads/detailsOfTheLead";
import { InterestedCustomerRegistration } from "./Leads/interestedCustomerRegistration";
import { CustomerInteraction } from "./Interactions/customerInteraction";

export const LeadAndCustomerRouting = () => {
    return (
        <Routes>
            <Route path="/" element={<LeadAndCustomer />} />
            <Route path="customers" element={<CustomersList />} />
            <Route path="customers/:customerId" element={<CustomerDetails />} />
            <Route path="customers/:customerId/contract" element={<ContractDetails />} />
            <Route path="customers/:customerId/dashboard" element={<CustomerDashboard />} />
            <Route path="customers/intersections" element={<CustomerInteraction />} />
            <Route path="contractManagement" element={<ContractManagement />}/>
            <Route path="contractManagement/:customerId" element={<ContractDetails />} />
            <Route path="contractManagement/new" element={<AddContract />} />
            <Route path="leads" element={<LeadHomePage />} />
            <Route path="leads/:leadId" element={<DetailsOfTheLead />} />
            <Route path="leads/detailsOfTheLead" element={<DetailsOfTheLead />} />
            <Route path="leads/:leadId/interestedCustomerRegistration" element={<InterestedCustomerRegistration />} />
            <Route path="leads/intersections" element={<LeadIntersection />} />
        </Routes>
    );
};