import { Route, Routes } from "react-router-dom"
import App from "./App"
import { WorkspaceMap } from "./MainMenu/Workspace/Components/workspaceMap"
import { Billing } from "./MainMenu/Billing/Components/billing"
<<<<<<< HEAD
import { LeadAndCustomerRouting } from "./MainMenu/LeadAndCustomer/Components/LeadAndCustomerRouting"
=======
import { LeadAndCustomerRouting } from './MainMenu/LeadAndCustomer/Components/LeadAndCustomerRouting'
>>>>>>> a84e40f069b9706528654916bbe8cfad3d7258f6


export const routing = () => {
    return <>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
            <Route path="workspaceMap" element={< WorkspaceMap />} />
            <Route path="billing" element={< Billing />} />
        </Routes>
    </>
}