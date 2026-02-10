import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Demo } from "./pages/Demo";
import { Single } from "./pages/Single";

import User from "./pages/User";
import UserDetails from "./pages/UserDetails";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";

import Message from "./pages/Message";

import { Coaches } from "./pages/Coaches";
import { CoachDetails } from "./pages/CoachDetails";
import { CoachEdit } from "./pages/CoachEdit";
import { CreateCoach } from "./pages/CreateCoach";

import {MainSection} from "./pages/MainSection";

import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { EditCourse } from "./pages/EditCourse";
import { CreateCourse } from "./pages/CreateCourse";

import UserCourseFavorite from "./pages/UserFavorites";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found</h1>}>

      {/* Home */}
      <Route path="/" element={<Home />} />

      <Route path="/users" element={<User />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="/users/new" element={<CreateUser />} />
      <Route path="/users/:id/edit" element={<EditUser />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/messages" element={<Message />} />

      <Route path="/coaches-edit/:id" element={<CoachEdit />} />
      <Route path="/coaches-details/:id" element={<CoachDetails />} />
      <Route path="/coaches" element={<Coaches />} />
      <Route path="/coaches/singup" element={<CreateCoach />} />
      <Route path="/main" element={<MainSection />} />

      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/courses/new" element={<CreateCourse />} />
      <Route path="/courses/:id/edit" element={<EditCourse />} />

      <Route path="/UserCourseFavorite" element={<UserCourseFavorite />} />
      
      <Route path="/single/:theid" element={<Single />} />
      <Route path="/demo" element={<Demo />} />

    </Route>
  )
);