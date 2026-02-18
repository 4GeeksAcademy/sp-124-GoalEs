import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Demo } from "./pages/Demo";
import { Single } from "./pages/Single";

import { LoginAdmin } from "./pages/LoginAdmin.jsx";
import { PrivateAdmin } from "./pages/PrivateAdmin.jsx";
import SignupAdmin from "./pages/SignupAdmin";

import { User } from "./pages/User";
import { UserDetails } from "./pages/UserDetails";
import { CreateUser } from "./pages/CreateUser";
import { EditUser } from "./pages/EditUser";
import { SignupUser } from "./pages/SingUpUser";
import { LoginUser } from "./pages/LoginUser";
import { PrivateUser } from "./pages/PrivatePageUser";
import { CompleteProfileUser } from "./pages/CompleteProfile.jsx";

import Message from "./pages/Message";

import { Coaches } from "./pages/Coaches";
import { CoachDetails } from "./pages/CoachDetails";
import { CoachEdit } from "./pages/CoachEdit";
import { SingUpCoach } from "./pages/SingUpCoach.jsx";
import CoachLogin from "./pages/CoachLogin";
import CoachPrivate from "./pages/CoachPrivate";
import { CoachProfile } from "./pages/CoachProfile.jsx";
import { CreateCoach } from "./pages/CreateCoach";

import { MainSection } from "./pages/MainSection";

import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { EditCourse } from "./pages/EditCourse";
import { CreateCourse } from "./pages/CreateCourse";

import UserCourseFavorite from "./pages/UserFavorites";

import { UserCourses } from "./pages/UserCoursers";
import { UserCourseSelect } from "./pages/UserCourseSelect";

import RoleGuard from "./pages/RoleGuard.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found</h1>}>

      {/* Home */}
      <Route path="/" element={<Home />} />

      <Route path="/admin/signup" element={<SignupAdmin />} />
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin/home" element={ <RoleGuard roles={["admin"]}><PrivateAdmin /></RoleGuard>  } />
      <Route path="/admin/users" element={ <RoleGuard roles={["admin"]}><User /></RoleGuard> }/>
      <Route path="/admin/coaches" element={ <RoleGuard roles={["admin"]}><Coaches /></RoleGuard> }/>
      <Route path="/admin/courses" element={  <RoleGuard roles={["admin"]}><Courses /></RoleGuard> }/>
      <Route path="/admin/messages" element={ <RoleGuard roles={["admin"]}><Message /></RoleGuard> }/>


      <Route path="/users" element={<RoleGuard roles={["admin"]}><User /></RoleGuard>} />
      <Route path="/users/:id" element={<RoleGuard roles={["user","admin"]}><UserDetails /></RoleGuard>} />
      <Route path="/users/new" element={<RoleGuard roles={["admin"]}><CreateUser /></RoleGuard>} />
      <Route path="/users/:id/edit" element={<RoleGuard roles={["user","admin"]}><EditUser /></RoleGuard>} />

      <Route path="/users/singup" element={<SignupUser />} />
      <Route path="/users/login" element={<LoginUser />} />
      <Route path="/users/home" element={<RoleGuard roles={["user","admin"]}><PrivateUser /></RoleGuard>} />
      <Route path="/users/profile" element={<RoleGuard roles={["user","admin"]}><CompleteProfileUser /></RoleGuard>} />

      <Route path="/messages" element={<Message />} />

      <Route path="/demo" element={<Demo />} />

      <Route path="/coaches-edit/:id" element={<RoleGuard roles={["coach","admin"]}><CoachEdit /></RoleGuard>} />
      <Route path="/coaches-details/:id" element={<CoachDetails />} />
      <Route path="/coaches" element={<Coaches />} />
      <Route path="/coaches/new" element={<RoleGuard roles={["admin"]}><CreateCoach /></RoleGuard>} />
      <Route path="/coaches/login" element={<CoachLogin />} />
      <Route path="/coach/private" element={<RoleGuard roles={["coach","admin"]}><CoachPrivate /></RoleGuard>} />
      <Route path="/coach/create-course" element={<RoleGuard roles={["coach","admin"]}><CreateCourse /></RoleGuard>} />
      <Route path="/coach/edit-course/:id" element={<RoleGuard roles={["coach","admin"]}><EditCourse /></RoleGuard>} />

      <Route path="/main" element={<MainSection />} />

      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/courses/new" element={<RoleGuard roles={["coach","admin"]}><CreateCourse /></RoleGuard>} />
      <Route path="/courses/:id/edit" element={<RoleGuard roles={["coach","admin"]}><EditCourse /></RoleGuard>} />

      <Route path="/UserCourseFavorite" element={<RoleGuard roles={["user","admin"]}><UserCourseFavorite /></RoleGuard>} />

      <Route path="/users/:userId/courses/select" element={<RoleGuard roles={["user","admin"]}><UserCourseSelect /></RoleGuard>} />
      <Route path="/users/:userId/courses" element={<RoleGuard roles={["user","admin"]}><UserCourses /></RoleGuard>} />
      <Route path="/single/:theid" element={<Single />} />
      <Route path="/demo" element={<Demo />} />

      <Route path="/coaches/profile" element={<RoleGuard roles={["coach","admin"]}><CoachProfile /></RoleGuard>} /> 
      <Route path="/coaches/new" element={<SingUpCoach />} />
    </Route>
  )
);