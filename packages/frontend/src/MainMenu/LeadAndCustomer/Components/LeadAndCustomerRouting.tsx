import { Route, Routes } from "react-router-dom";
import { LeadAndCustomer } from "./leadAndCustomer";
import { ContractManagement } from "./Contracts/contractManagement";
import { AddContract } from "./Contracts/addContract";
import { ContractDetails } from "./Contracts/contractDetails";
import { CustomerDashboard } from "./Customers/customerDashboard";
import { LeadsHomePage } from "./Leads/leadHomePage";
import { LeadIntersection } from "./Interactions/leadIntersection";
import { DetailsOfTheLead } from "./Leads/detailsOfTheLead";
import { InterestedCustomerRegistration } from "./Leads/interestedCustomerRegistration";
// import { CustomerInteraction } from "./Interactions/";
import { UpdateCustomer } from "./Customers/updateCustomer";
import { CustomerStatusChanged } from "./Customers/CustomerStatusChanged";
import { CustomersList } from "./Customers/customersList"
import { LeadInteractions } from "./Leads/leadIntegration";

export const LeadAndCustomerRouting = () => {
    return (
        <Routes>
            <Route path="/" element={<LeadAndCustomer />} />
            <Route path="customers" element={<CustomersList />} />
            <Route path="customers/update" element={<UpdateCustomer />} />
            {/* <Route path="customers/:customerId" element={<CustomerDetails />} /> */}
            <Route path="customers/updateStatus/:customerId" element={<CustomerStatusChanged />} />
            <Route path="customers/:customerId/contract" element={<ContractDetails />} />
            <Route path="customers/:customerId/dashboard" element={<CustomerDashboard />} />
            {/* <Route path="customers/intersections" element={<CustomerInteraction />} /> */}
            <Route path="contracts" element={<ContractManagement />}/>
            <Route path="contracts/:customerId" element={<ContractDetails />} />
            <Route path="contracts/new" element={<AddContract />} />
            <Route path="leads" element={<LeadInteractions />} />
            {/* <Route path="leads/:leadId" element={<DetailsOfTheLead />} /> */}
            <Route path="leads/interestedCustomerRegistration" element={<InterestedCustomerRegistration />} />
            <Route path="leads/intersections" element={<LeadIntersection />} />
        </Routes>
    );
};