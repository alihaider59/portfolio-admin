import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/login/Login";
import { ProtectedRoute } from "../routes/ProtectedRoutes";
import { CatchAllRedirect } from "../routes/CatchAllRedirect";
import { AdminLayout } from "../components/layout/AdminLayout";
import { DashboardPage } from "../pages/dashboard/dashboard";
import { ContactListPage } from "../pages/contacts/contactsList";
import { VisitorListPage } from "../pages/visitors/visitorsList";
import { TestimonialListPage } from "../pages/testimonials/testimonialsList";
import { ProjectListPage } from "../pages/projects/projectsList";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ContactListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitors"
          element={
            <ProtectedRoute>
              <VisitorListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/testimonials"
          element={
            <ProtectedRoute>
              <TestimonialListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectListPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<CatchAllRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};