import { HashRouter, Routes, Route } from "react-router-dom";
import { ProgressProvider } from "./hooks/useProgress";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { LessonPage } from "./pages/LessonPage";

// HashRouter (not BrowserRouter) is used deliberately: GitHub Pages serves
// static files with no history-mode fallback, so a direct link or refresh
// on e.g. /lesson/module-01-lesson-01 would 404 under BrowserRouter.
function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
          </Routes>
        </AppShell>
      </HashRouter>
    </ProgressProvider>
  );
}

export default App;
