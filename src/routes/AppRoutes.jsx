import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RankingsPage from "../pages/RankingsPage";
import UserProfilePage from "../pages/UserProfilePage";
import FighterComparisonPage from "../pages/FighterComparisonPage";
import FightersPage from "../pages/FightersPage";
import EventsPage from "../pages/EventsPage";
import HighlightsPage from "../pages/HighlightsPage";
import ForumPage from "../pages/ForumPage";
import PredictionPage from "../pages/PredictionPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/rankings" element={<RankingsPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/compare" element={<FighterComparisonPage />} />
      <Route path="/fighters" element={<FightersPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/highlights" element={<HighlightsPage />} />
      <Route path="/forum" element={<ForumPage />} />
      <Route path="/predict" element={<PredictionPage />} />
      <Route path="/live" element={<div className="pt-20 text-center">Ver en Vivo (Próximamente)</div>} />
    </Routes>
  );
};

export default AppRoutes;
