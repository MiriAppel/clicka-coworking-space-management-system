import { Route, Routes } from "react-router-dom"
import App from "./App"
//import { Billing } from "./MainMenu/Billing/Components"
//import { LeadAndCustomerRouting } from "./MainMenu/LeadAndCustomer/Components/LeadAndCustomerRouting"
import { WorkspaceMap } from "./MainMenu/Workspace/Components/workspaceMap"
import { BookingCalendar } from "./MainMenu/Workspace/Components/bookingCalendar"
import { AssignmentForm } from "./MainMenu/Workspace/Components/assignmentForm"


export const routing = () => {
    return <>
        <Routes>
            <Route path="/" element={<App />} />
            {/* <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} /> */}
            <Route path="workspaceMap" element={<WorkspaceMap />} />
            <Route path="bookingCalendar" element={<BookingCalendar />} />
            <Route path="assignmentForm" element={<AssignmentForm />} />
            {/* <Route path="billing" element={< Billing />} /> */}
        </Routes>
    </>
}