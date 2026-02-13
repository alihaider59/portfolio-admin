import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/login/Login";
import { ProtectedRoute } from "../routes/ProtectedRoutes";
import { AdminLayout } from "../components/layout/AdminLayout";
import { DashboardPage } from "../pages/dashboard/dashboard";
import { ContactListPage } from "../pages/contacts/contactsList";
import { VisitorListPage } from "../pages/visitors/visitorsList";
import { TestimonialListPage } from "../pages/testimonials/testimonialsList";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

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

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};