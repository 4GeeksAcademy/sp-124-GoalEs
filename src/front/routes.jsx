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

import Message from "./pages/Message";
import UserCourseFavorite from "./pages/UserFavorites";
import { UserCourses } from "./pages/UserCoursers";
import { UserCourseSelect } from "./pages/UserCourseSelect";
import { MainSection } from "./pages/MainSection";

import AdminLayout from "./pages/Layouts/AdminLayout";
import UserLayout from "./pages/Layouts/UserLayout";
import CoachLayout from "./pages/Layouts/CoachLayout";
import PublicLayout from "./pages/Layouts/PublicLayout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found</h1>}>

      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="single/:theid" element={<Single />} />
        <Route path="demo" element={<Demo />} />

        <Route path="admin/signup" element={<SignupAdmin />} />
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
      </Route>

      {/* ADMIN PRIVATE (only dashboard pages here) */}
      <Route element={<AdminLayout />}>
        <Route path="admin/home" element={<PrivateAdmin />} />
        <Route path="main" element={<MainSection />} />
        <Route path="UserCourseFavorite" element={<UserCourseFavorite />} />
        <Route path="/coaches-edit/:id" element={<CoachEdit />} />
      </Route>

      {/* USER PRIVATE (user pages, but you can allow admin inside UserLayout too) */}
      <Route element={<UserLayout />}>
        <Route path="users/home" element={<PrivateUser />} />
        <Route path="users/profile" element={<CompleteProfileUser />} />

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

        {/* optional aliases */}
        <Route path="courses/new" element={<CreateCourse />} />
        <Route path="courses/:id/edit" element={<EditCourse />} />
      </Route>

      <Route path="*" element={<h1>Not found</h1>} />
    </Route>
  )
);