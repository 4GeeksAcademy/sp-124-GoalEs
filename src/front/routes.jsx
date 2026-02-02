import { Routes } from "react-router-dom";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Coaches } from "./pages/Coaches";
import { Demo } from "./pages/Demo";
import { CoachDetails } from "./pages/coachesDetails";
import { CreateCoach } from "./pages/createCoach";
import { MainSection } from "./pages/mainSection.jsx"

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        <Route path= "/" element={<Home />} />
        <Route path="/coaches" element={ <Coaches />} />
        <Route path="/singup" element={ <CreateCoach />} />
        <Route path="/home" element={<MainSection />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/coaches/:id" element={<CoachDetails />} />
      </Route>
    )
);