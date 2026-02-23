import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserCourseFavorite = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [favoritesByUser, setFavoritesByUser] = useState({});

  const token =
    localStorage.getItem("token-user") ||
    localStorage.getItem("token-admin");

  useEffect(() => {
    fetch(`${BACKEND_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUsers(data.users || []));
  }, []);

  useEffect(() => {
    users.forEach(user => {
      fetch(`${BACKEND_URL}/users/${user.id}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setFavoritesByUser(prev => ({
            ...prev,
            [user.id]: data.favorites || []
          }));
        });
    });
  }, [users]);

  // Load all courses (for add favorite)
  useEffect(() => {
    fetch(`${BACKEND_URL}/course`)
      .then(res => res.json())
      .then(data => setCourses(data.courses || []));
  }, []);

  // Load favorites for a user
  const loadFavorites = (userId) => {
    fetch(`${BACKEND_URL}/users/${userId}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setFavoritesByUser(prev => ({
          ...prev,
          [userId]: data.favorites || []
        }));
      });
  };

  //Delete favorite
  const deleteFavorite = (userId, courseId) => {
    fetch(`${BACKEND_URL}/users/${userId}/favorites/${courseId}`, {
      method: "DELETE",
      //added by arash
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => loadFavorites(userId));
  };

  //  Add favorite
  const addFavorite = (userId, courseId) => {
    fetch(`${BACKEND_URL}/users/${userId}/favorites/${courseId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => loadFavorites(userId));
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-4">
        <h1>User Course Favorites</h1>
        <button className="btn btn-secondary" onClick={() => navigate("/admin/home")}>
          Back to Admin Dashboard
        </button>
      </div>

      {users.map(user => (
        <div key={user.id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <h4>
              {user.name} {user.surname}
            </h4>

            {/* Favorites list */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              {favoritesByUser[user.id]?.length === 0 && (
                <span className="text-muted">No favorites</span>
              )}

              {favoritesByUser[user.id]?.map(fav => (
                <div
                  key={fav.id}
                  className="border rounded px-3 py-2 d-flex align-items-center gap-2"
                >
                  <span>{fav.course.title}</span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      deleteFavorite(user.id, fav.course.id)
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add favorite */}
            <select
              className="form-select"
              onChange={(e) => {
                if (e.target.value !== "") {
                  addFavorite(user.id, e.target.value);
                  e.target.value = "";
                }
              }}
            >
              <option value="">➕ Add course to favorites</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCourseFavorite;