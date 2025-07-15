
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async ()=>{
  const supabase = createClient(Deno.env.get("URL"), Deno.env.get("SERVICE_ROLE_KEY"));
  const today = new Date().toISOString().split("T")[0]; // פורמט YYYY-MM-DD
  console.log('i am here!!🤹');
  // 1. עדכון סטטוס ל-"ACTIVE" אם contract_start_date הגיע
  const { error: startError, data: activeCustomers } = await supabase.from("customer").update({
    status: "ACTIVE"
  }).eq("contract_start_date", today) // תאריך התחלה
  .neq("status", "ACTIVE");
  // 2. עדכון סטטוס ל-"EXITED" אם contract_end_date עבר
  const { error: exitError, data: exitedCustomers } = await supabase.from("customer").update({
    status: "EXITED"
  }).lte("contract_end_date", today) // תאריך סיום
  .neq("status", "EXITED");
  // טיפול בשגיאות
  if (startError || exitError) {
    console.error("Error updating statuses", {
      startError,
      exitError
    });
    return new Response("Error updating statuses", {
      status: 500
    });
  }
  return new Response("Statuses updated successfully", {
    status: 200
  });
});
