import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Demo } from "./pages/Demo";
import { Single } from "./pages/Single";

import { LoginAdmin } from "./pages/LoginAdmin.jsx";
import SignupAdmin from "./pages/SignupAdmin";
import { PrivateAdmin } from "./pages/PrivateAdmin.jsx";

import { SignupUser } from "./pages/SingUpUser";
import { LoginUser } from "./pages/LoginUser";
import { PrivateUser } from "./pages/PrivatePageUser";
import { CompleteProfileUser } from "./pages/CompleteProfile.jsx";

import { User } from "./pages/User";
import { UserDetails } from "./pages/UserDetails";
import { CreateUser } from "./pages/CreateUser";
import { EditUser } from "./pages/EditUser";
import { ChatPage } from "./pages/ChatPage.jsx";
import { AvailableCoursesUser } from "./pages/AvailableCoursesUser.jsx";
import PaymentPage from "./pages/PaymentPage";

import { Coaches } from "./pages/Coaches";
import { CoachDetails } from "./pages/CoachDetails";
import { CoachEdit } from "./pages/CoachEdit";
import { SingUpCoach } from "./pages/SingUpCoach.jsx";
import CoachLogin from "./pages/CoachLogin";
import CoachPrivate from "./pages/CoachPrivate";
import { CoachProfile } from "./pages/CoachProfile.jsx";

import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { EditCourse } from "./pages/EditCourse";
import { CreateCourse } from "./pages/CreateCourse";

import { Categories } from "./pages/Categories";
import { Tags } from "./pages/Tags.jsx";

import Message from "./pages/Message";
import UserCourseFavorite from "./pages/UserFavorites";
import { UserCourses } from "./pages/UserCoursers";
import { UserCourseSelect } from "./pages/UserCourseSelect";
import { MainSection } from "./pages/MainSection";

import AdminLayout from "./pages/Layouts/AdminLayout";
import UserLayout from "./pages/Layouts/UserLayout";
import CoachLayout from "./pages/Layouts/CoachLayout";
import PublicLayout from "./pages/Layouts/PublicLayout";

import { FaceAnalyzer } from "./pages/FaceAnalyzer.jsx";

import { ReserveCoach } from "./pages/ReserveCoach";
import { MyAppointmentsUser } from "./pages/MyAppointmentsUser";
import { MyAppointmentsCoach } from "./pages/MyAppointmentsCoach";
import { AdminAppointments } from "./pages/AdminAppointments.jsx";

import { About } from "./pages/public/About.jsx";
import { Features } from "./pages/public/Features.jsx";
import { FAQ } from "./pages/public/FAQ.jsx";
import { Contact } from "./pages/public/Contact.jsx";
import { LegalPrivacy } from "./pages/public/LegalPrivacy.jsx";
import { LegalTerms } from "./pages/public/LegalTerms.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found</h1>}>

      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="single/:theid" element={<Single />} />
        <Route path="demo" element={<Demo />} />

        <Route path="admin" element={<SignupAdmin />} />
        <Route path="admin/login" element={<LoginAdmin />} />

        <Route path="users/signup" element={<SignupUser />} />
        <Route path="users/login" element={<LoginUser />} />

        <Route path="coaches" element={<Coaches />} />
        <Route path="coaches-details/:id" element={<CoachDetails />} />
        <Route path="coaches/login" element={<CoachLogin />} />
        <Route path="coaches/new" element={<SingUpCoach />} />

        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />

        <Route path="messages" element={<Message />} />

        <Route path="about" element={<About />} />
        <Route path="features" element={<Features />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="legal-privacy" element={<LegalPrivacy />} />
        <Route path="legal-terms" element={<LegalTerms />} />
      </Route>

      {/* ADMIN PRIVATE (only dashboard pages here) */}
      <Route element={<AdminLayout />}>
        <Route path="admin/home" element={<PrivateAdmin />} />
        <Route path="main" element={<MainSection />} />
        <Route path="UserCourseFavorite" element={<UserCourseFavorite />} />
        <Route path="/coaches-edit/:id" element={<CoachEdit />} />
        <Route path="admin/categories" element={<Categories />} />
        <Route path="admin/tags" element={<Tags />} />
        <Route path="admin/appointments" element={<AdminAppointments />} />
      </Route>

      {/* USER PRIVATE (user pages, but you can allow admin inside UserLayout too) */}
      <Route element={<UserLayout />}>
        <Route path="users/home" element={<PrivateUser />} />
        <Route path="users/profile" element={<CompleteProfileUser />} />
        <Route path="/users/faceanalyzer" element={<FaceAnalyzer />} />
        <Route path="coaches/:id/reserve" element={<ReserveCoach />} />
        <Route path="appointments/my" element={<MyAppointmentsUser />} />
        <Route path="/users/chats" element={<ChatPage />} />
        <Route path="/users/courses-available" element={<AvailableCoursesUser />} />
        <Route path="/payment/:courseId" element={<PaymentPage />} />
        


        {/* CRUD USERS (shared for user/admin) */}
        <Route path="users" element={<User />} />
        <Route path="users/new" element={<CreateUser />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="users/:id/edit" element={<EditUser />} />

        <Route path="users/:userId/courses/select" element={<UserCourseSelect />} />
        <Route path="users/:userId/courses" element={<UserCourses />} />
      </Route>

      {/* COACH PRIVATE */}
      <Route element={<CoachLayout />}>
        <Route path="coach/private" element={<CoachPrivate />} />
        <Route path="coaches/profile" element={<CoachProfile />} />
        <Route path="coach/create-course" element={<CreateCourse />} />
        <Route path="coach/edit-course/:id" element={<EditCourse />} />
        <Route path="coach/appointments/my" element={<MyAppointmentsCoach />} />
        <Route path="/coach/chats" element={<ChatPage />} />

        {/* optional aliases */}
        <Route path="courses/new" element={<CreateCourse />} />
        <Route path="courses/:id/edit" element={<EditCourse />} />
      </Route>

      <Route path="*" element={<h1>Not found</h1>} />
    </Route>
  )
);