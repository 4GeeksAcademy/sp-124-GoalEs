import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Coaches } from "./pages/Coaches";
import { CoachEdit } from "./pages/coachesEdit";
import { CreateCoach } from "./pages/createCoach";
import { MainSection } from "./pages/mainSection"
import { CoachDetails } from "./pages/coachesDetails";
import { Demo } from "./pages/Demo";
import { User } from "./pages/User";
import { EditUser } from "./pages/EditUser";
import { CreateUser } from "./pages/CreateUser";
import { UserDetails } from "./pages/UserDetails";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<User />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="/users/new" element={<CreateUser />} />
      <Route path="/users/:id/edit" element={<EditUser />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/coaches-edit/:id" element={<CoachEdit />} />
      <Route path="/coaches-details/:id" element={<CoachDetails />} />
      <Route path="/coaches" element={<Coaches />} />
      <Route path="/singup" element={<CreateCoach />} />
      <Route path="/main" element={<MainSection />} />
    </Route>
  )
);