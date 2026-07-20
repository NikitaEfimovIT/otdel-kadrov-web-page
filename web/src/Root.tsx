import { lazy, Suspense, useSyncExternalStore } from "react";
import App from "./App";

// Админка — отдельный ленивый чанк: публичные посетители её не скачивают.
const AdminApp = lazy(() => import("./admin/AdminApp"));

function subscribe(cb: () => void): () => void {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

export default function Root() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  if (hash.startsWith("#/officer")) {
    return (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    );
  }
  return <App />;
}
