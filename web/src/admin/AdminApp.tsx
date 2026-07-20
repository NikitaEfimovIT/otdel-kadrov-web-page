import { useEffect, useState } from "react";
import "./admin.css";
import { getToken, getUser, logout as doLogout } from "./auth";
import { adminApi } from "./adminApi";
import { Sidebar, type AdminView } from "./Sidebar";
import { Login } from "./Login";
import { Dashboard } from "./screens/Dashboard";
import { NewsAdmin } from "./screens/NewsAdmin";
import { PollsAdmin } from "./screens/PollsAdmin";
import { RecruitAdmin } from "./screens/RecruitAdmin";
import { LinksAdmin } from "./screens/LinksAdmin";
import { SettingsAdmin } from "./screens/SettingsAdmin";

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => !!getToken());
  const [view, setView] = useState<AdminView>("dashboard");
  const [newApps, setNewApps] = useState(0);

  const refreshBadge = () => {
    adminApi.list("applications?filters[stage][$eq]=new").then((a) => setNewApps(a.length));
  };

  useEffect(() => {
    if (loggedIn) refreshBadge();
  }, [loggedIn]);

  if (!loggedIn) return <Login onSuccess={() => setLoggedIn(true)} />;

  const logout = () => {
    doLogout();
    setLoggedIn(false);
  };

  return (
    <div className="adm">
      <Sidebar view={view} onNavigate={setView} user={getUser()} onLogout={logout} newApps={newApps} />
      <main className="adm-main">
        <div className="adm-inner">
          {view === "dashboard" && <Dashboard onNavigate={setView} />}
          {view === "news" && <NewsAdmin />}
          {view === "polls" && <PollsAdmin />}
          {view === "recruit" && <RecruitAdmin onChanged={refreshBadge} />}
          {view === "links" && <LinksAdmin />}
          {view === "settings" && <SettingsAdmin />}
        </div>
      </main>
    </div>
  );
}
