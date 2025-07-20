import { Route, Routes, useNavigate } from "react-router-dom";
import { LeadAndCustomer } from "./leadAndCustomer";
import { ContractManagement } from "./Contracts/contractManagement";
import { AddContract } from "./Contracts/addContract";
import { ContractDetails } from "./Contracts/contractDetails";
import { CustomerDashboard } from "./Customers/customerDashboard";
import { LeadsHomePage } from "./Leads/leadHomePage";
import { DetailsOfTheLead } from "./Leads/detailsOfTheLead";
import { InterestedCustomerRegistration } from "./Leads/interestedCustomerRegistration";
import { UpdateCustomer } from "./Customers/updateCustomer";
import { CustomerStatusChanged } from "./Customers/CustomerStatusChanged";
import { CustomersList } from "./Customers/customersList"
import { LeadInteractions } from "./Interactions/leadIntersection";
import { InteractionForm } from "./Interactions/interactionForm";
import { useLeadsStore } from "../../../Stores/LeadAndCustomer/leadsStore";
import { Lead } from "shared-types";
import { NewCustomerPage } from "./Customers/newCustomer";

export const LeadAndCustomerRouting = () => {
    const nav = useNavigate()
    const {
        handleCreateInteraction
    } = useLeadsStore();
    return (
        <Routes>
            <Route path="/" element={<LeadAndCustomer />} />
            <Route path="customers" element={<CustomersList />} />
            <Route path="customers/update" element={<UpdateCustomer />} />
            <Route path="customers/new" element={<NewCustomerPage />} />
            {/* <Route path="customers/:customerId" element={<CustomerDetails />} /> */}
            <Route path="customers/updateStatus/:customerId" element={<CustomerStatusChanged />} />
            <Route path="customers/:customerId/contract" element={<ContractDetails />} />
            <Route path="customers/:customerId/dashboard" element={<CustomerDashboard />} />
            <Route path="contracts" element={<ContractManagement />} />
            <Route path="contracts/:customerId" element={<ContractDetails />} />
            <Route path="contracts/new" element={<AddContract />} />
            <Route path="leads" element={<LeadInteractions />} />
            <Route path="leads" element={<LeadInteractions />} />
            {/* <Route path="leads/:leadId" element={<DetailsOfTheLead />} /> */}
            
            <Route path="leads/interestedCustomerRegistration" element={<InterestedCustomerRegistration />} />
            <Route path="leads/intersections" element={<LeadInteractions />} />
            <Route path="leads/intersections/interestedCustomerRegistration" element={<InterestedCustomerRegistration />} />
            <Route path="leads/:leadId/addInteraction" element={<InteractionForm onSubmit={(lead: Lead) => handleCreateInteraction(lead)} onCancel={() => {
                nav('/leadAndCustomer/leads/intersections')
            }} />} />
        </Routes>
    );
};