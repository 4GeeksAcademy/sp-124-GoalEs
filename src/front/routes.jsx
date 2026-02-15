import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";

import { LoginAdmin } from "./pages/LoginAdmin.jsx";
import { PrivateAdmin } from "./pages/PrivateAdmin.jsx"; 
import SignupAdmin from "./pages/SignupAdmin";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Demo } from "./pages/Demo";
import { Single } from "./pages/Single";

import { User } from "./pages/User";
import { UserDetails } from "./pages/UserDetails";
import { CreateUser } from "./pages/CreateUser";
import { EditUser } from "./pages/EditUser";
import { SignupUser } from "./pages/SingUpUser";
import { LoginUser } from "./pages/LoginUser";
import { PrivateUser } from "./pages/PrivatePageUser";

import Message from "./pages/Message";

import { Coaches } from "./pages/Coaches";
import { CoachDetails } from "./pages/CoachDetails";
import { CoachEdit } from "./pages/CoachEdit";
import { CreateCoach } from "./pages/CreateCoach";
import CoachLogin from "./pages/CoachLogin";
import CoachPrivate from "./pages/CoachPrivate";

import { MainSection } from "./pages/MainSection";

import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { EditCourse } from "./pages/EditCourse";
import { CreateCourse } from "./pages/CreateCourse";

import UserCourseFavorite from "./pages/UserFavorites";

import { UserCourses } from "./pages/UserCoursers";
import { UserCourseSelect } from "./pages/UserCourseSelect";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found</h1>}>

      {/* Home */}
      <Route path="/" element={<Home />} />

      <Route path="/admin/signup" element={<SignupAdmin />} />

      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin/home" element={<PrivateAdmin />} />

      <Route path="/users" element={<User />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="/users/new" element={<CreateUser />} />
      <Route path="/users/:id/edit" element={<EditUser />} />

      <Route path="/users/singup" element={<SignupUser />} />
      <Route path="/users/login" element={<LoginUser />} />
      <Route path="/users/home" element={<PrivateUser />} />

      <Route path="/messages" element={<Message />} />

      <Route path="/demo" element={<Demo />} />

      <Route path="/coaches-edit/:id" element={<CoachEdit />} />
      <Route path="/coaches-details/:id" element={<CoachDetails />} />
      <Route path="/coaches" element={<Coaches />} />
      <Route path="/coaches/new" element={<CreateCoach />} />
      <Route path="/coaches/login" element={<CoachLogin />} />
      <Route path="/coach/private" element={<CoachPrivate />} />
      <Route path="/coach/create-course" element={<CreateCourse /> } /> 
      <Route path="/coach/edit-course/:id" element={<EditCourse />} />

      <Route path="/main" element={<MainSection />} />

      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/courses/new" element={<CreateCourse />} />
      <Route path="/courses/:id/edit" element={<EditCourse />} />

      <Route path="/UserCourseFavorite" element={<UserCourseFavorite />} />

      <Route path="/users/:userId/courses/select" element={<UserCourseSelect />} />
      <Route path="/users/:userId/courses" element={<UserCourses />} />
      <Route path="/single/:theid" element={<Single />} />
      <Route path="/demo" element={<Demo />} />

    </Route>
  )
);