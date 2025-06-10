import { Route, Routes } from "react-router-dom"
import App from "./App"
import { WorkspaceMap } from "./MainMenu/workspace/workspaceMap"
import { Billing } from "./MainMenu/billing/billing"
import { LeadCustomer } from "./MainMenu/lead&customer/lead&customer"
import { CoreIntegration } from "./MainMenu/core&integration/core&integration"


export const routing = () => {
    return <>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="core&integration" element={<CoreIntegration />} />
            <Route path="lead&customer" element={< LeadCustomer />} />
            <Route path="workspaceMap" element={< WorkspaceMap />} />
            <Route path="billing" element={< Billing />} />
        </Routes>
    </>
}