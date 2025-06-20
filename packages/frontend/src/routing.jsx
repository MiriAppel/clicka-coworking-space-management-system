import { Route, Routes } from "react-router-dom"
import App from "./App"
import { WorkspaceMap } from "./MainMenu/Workspace/Components/workspaceMap"
import { Billing } from "./MainMenu/Billing/Components/billing"
import { LeadAndCustomer } from "./MainMenu/LeadAndCustomer/Components/leadAndCustomer"


export const routing = () => {
    return <>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="leadAndCustomer" element={< LeadAndCustomer />} />
            <Route path="workspaceMap" element={< WorkspaceMap />} />
            <Route path="billing" element={< Billing />} />
        </Routes>
    </>
}