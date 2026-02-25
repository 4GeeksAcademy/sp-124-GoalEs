import React, { useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const Home = () => {

	const navigate = useNavigate();

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	const isAdmin = !!localStorage.getItem("token-admin");
	const isUser = !!localStorage.getItem("token-user");
	const isCoach = !!localStorage.getItem("token-coach") || !!localStorage.getItem("coach");

	const isPublic = !isAdmin && !isUser && !isCoach;

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>
			<p className="lead">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />

			</p>

			{/* Publico */}
			{isPublic && (
				<>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/admin/login")} >Go to Login Admin </button>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/coaches/new")}>Go to Singup Coach</button>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/users/singup")}>Go to Singup User</button>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/coaches")}>Go to Coaches</button>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/courses")}>Go to Courses</button>
				</>
			)}

			{/* Exclusivo Admin */}
			{(localStorage.getItem("token-admin")) &&
				<>
					<button className="btn btn-success ms-3" onClick={() => navigate("/admin/home")}> Admin Dashboard</button>
					
				</>
			}

			{/* Exclusivo user */}
			{(localStorage.getItem("token-user")) &&
				<>
					<button className="btn btn-success ms-3" onClick={() => navigate("/users/home")}> User Dashboard</button>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/users/profile")}>Edit Profile</button>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/coaches")}>Go to Coaches</button>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/courses")}>Go to courses</button>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/appointments/my")}>My Appointments</button>

				</>
			}

			{/* Exclusivo coache */}
			{(localStorage.getItem("token-coach") || localStorage.getItem("coach")) &&
				<>
					<button className="btn btn-success ms-3" onClick={() => navigate("/coach/private")}> Coach Dashboard</button>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/messages")}>Go to Message</button>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/courses")}>Go to courses</button>
					<button className="btn btn-primary ms-3" onClick={() => navigate("/users")}>Go to Users</button>
				</>
			}

			<div className="alert alert-info">
				{store.message ? (
					<div>
						<span>{store.message}</span>
					</div>
				) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)}
			</div>
		</div>
	);
}; 