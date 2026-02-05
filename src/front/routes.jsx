import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";

import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found</h1>}>
      <Route path="/" element={<Home />} />

      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/new" element={<CreateCourse />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/courses/:id/edit" element={<EditCourse />} />
    </Route>
  )
);