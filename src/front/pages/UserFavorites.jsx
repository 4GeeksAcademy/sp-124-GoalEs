import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/userFavoritesFromAdmin.css"

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
    <div className="admin-favorites-layout">

      <div className="admin-favorites-container">

        <div className="admin-favorites-header">

          <h1 className="admin-favorites-title">
            User Course Favorites
          </h1>

        </div>

        {users.map(user => (

          <div key={user.id} className="admin-user-card">

            <div className="admin-user-header">
              <h3>
                {user.name} {user.surname}
              </h3>
            </div>

            {/* ===== FAVORITES LIST ===== */}
            <div className="admin-favorites-list">

              {favoritesByUser[user.id]?.length === 0 && (
                <span className="admin-muted">
                  No favorites
                </span>
              )}

              {favoritesByUser[user.id]?.map(fav => (
                <div
                  key={fav.id}
                  className="admin-favorite-item"
                >
                  <span className="admin-favorite-title">
                    {fav.course.title}
                  </span>

                  <button
                    className="admin-remove-btn"
                    onClick={() =>
                      deleteFavorite(user.id, fav.course.id)
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}

            </div>

            {/* ===== ADD FAVORITE ===== */}
            <select
              className="admin-select"
              onChange={(e) => {
                if (e.target.value !== "") {
                  addFavorite(user.id, e.target.value);
                  e.target.value = "";
                }
              }}
            >
              <option value="">
                ➕ Add course to favorites
              </option>

              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}

            </select>

          </div>

        ))}

      </div>
    </div>
  );
};

export default UserCourseFavorite;