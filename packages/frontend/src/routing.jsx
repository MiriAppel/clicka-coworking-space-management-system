import { Route, Routes } from "react-router-dom"
import App from "./App"
import { Billing } from "./MainMenu/Billing/Components/billing"
import { LeadAndCustomerRouting } from "./MainMenu/LeadAndCustomer/Components/LeadAndCustomerRouting"
import { WorkspaceMap } from "./MainMenu/Workspace/Components/workspaceMap"


export const routing = () => {
    return <>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
            <Route path="workspaceMap" element={<WorkspaceMap />} />
            <Route path="billing" element={< Billing />} />
        </Routes>
    </>
}