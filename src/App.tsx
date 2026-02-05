import { Suspense } from "react";

import { AppRoutes } from "@/routes/AppRoutes";

function App() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading…</p>}>
      <AppRoutes />
    </Suspense>
  );
}

export default App;
