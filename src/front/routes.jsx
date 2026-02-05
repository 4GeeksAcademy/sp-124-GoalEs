import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import User from "./pages/User";
import EditUser from "./pages/EditUser";
import CreateUser from "./pages/CreateUser";
import UserDetails from "./pages/UserDetails";
import { Coaches } from "./pages/Coaches";
import { CoachesDetails } from "./pages/coachesDetails";
import { CoachesEdit } from "./pages/coachesEdit";
import { CreateCoach } from "./pages/createCoach";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<User />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="/users/new" element={<CreateUser />} />
      <Route path="/users/:id/edit" element={<EditUser />} />
      <Route path="/coaches" element={<Coaches />} />
      <Route path="/coaches/:id" element={<CoachesDetails />} />
      <Route path="/coaches/new" element={<CreateCoach />} />
      <Route path="/coaches/:id/edit" element={<CoachesEdit />} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />
    </Route>
  )
);