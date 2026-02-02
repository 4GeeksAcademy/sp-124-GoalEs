import React, { useEffect, useState } from "react";

const back_url = "https://glorious-engine-wr4pp7xr49g5c5gj9-3001.app.github.dev";
const User = () => {

    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");


//to create - POST
    const[form, setForm] = useState({name: "", surname: "", email: "", password: ""});

    // to edit - PUT
    const [edit, setEdit] = useState({name: "", surname: "", email: "", password: ""});
    const [editId, setEditId] = useState(null);

// GET

   const userFetch = async () => {
            try {
                const res = await fetch(`${back_url}/api/users`);
                if (!res.ok) throw new Error("Error to search users");
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.users ?? []);
                setUsers(list);
            } catch (e) {
                setError(e.message);
            }
        };

    useEffect(() => {
        userFetch();
    },[]);

    //POST

    const userCreate = async (e) => {
        e.preventDefault();

        if (!form.name || !form.surname || !form.email) {
            setError("Fill name, surname and email to complete.");
            return;
        }
        try {
            setError("");

            const res = await fetch(`${back_url}/api/users`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Error to create user");

            setForm({name: "", surname: "", email: "", password: ""});
            await userFetch();
        } catch (e) {
            setError(e.message);
        }
    };

    //DELETE

    const deleteUser = async (id) => {
        try {
            setError("");

            const res = await fetch(`${back_url}/api/users/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Error to delete user");
        } catch (e) {
            setError(e.message);
        }
    };

    // PUT

    const editUser = (user) => { 
        setEditId(user.id);
        setEdit({
            name: user.name || "",
            surname: user.surname || "",
            email: user.email || "",
            password: user.password || "",
        });
        setError("");
    };

    const cancelEdit = () => {
        setEditId(null);
        setEdit({name: "", surname: "", email: "", password: ""});
    };

    const changeUpddate = async (id) => {
        if (!edit.name || !edit.surname || !edit.email || !edit.password) {
            setError("Fill name, surname, email and password to update.");
            return;
        }

        try {
            setError("");

            const res = await fetch(`${back_url}/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(edit),
            });

            if (!res.ok) throw new Error("Error to update user");
            cancelEdit();
        } catch (e) {
            setError(e.message);
        }
    };

    // UI

    if (error) return <div style={{color: "red"}}>{error}</div>;

    return (
  <>
    <h1 className="container justify-content-center py-4">Users</h1>

    <form onSubmit={userCreate}>
        <h3 className="container align-items-center mb-4">Creating user</h3>
      <input
        placeholder="name"      
        value={form.name}
        onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
      />
      {" "}
      <input
      placeholder="surname"
        value={form.surname}
        onChange={(e) => setForm(p => ({ ...p, surname: e.target.value }))}
      />
      {" "}
      <input
      placeholder="email"
        value={form.email}
        onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
      />
      {" "}
      <input
      placeholder="password"
      value={form.password}
      onChange={(e) => setForm(p => ({...p, password: e.target.value}))}
      />
      {" "}
      <button className="btn btn-primary">Create</button>
    </form>

<h3 className="container justify-content-center py-4">Editing users</h3>
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {editId === user.id ? (
            // 
            <>
              <input
                placeholder="name"
                value={edit.name}
                onChange={(e) => setEdit(p => ({ ...p, name: e.target.value }))}
              />
              {" "}
              <input
                placeholder="surname"
                value={edit.surname}
                onChange={(e) => setEdit(p => ({ ...p, surname: e.target.value }))}
              />
              {" "}
              <input
                placeholder="email"
                value={edit.email}
                onChange={(e) => setEdit(p => ({ ...p, email: e.target.value }))}
              />
              {" "}
              <input
                placeholder="password"
                value={edit.password}
                onChange={(e) => setEdit(p => ({ ...p, password: e.target.value }))}
              />
              <button className="btn btn-primary" onClick={() => changeUpddate(user.id)}>Save</button> {" "}
              <button className="btn btn-primary"  onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
        
            <>
              <div> Full Name: {user.name} {user.surname} </div>
              <button className="btn btn-primary" onClick={() => editUser(user)}>Edit</button> {" "}
              <button className="btn btn-primary" onClick={() => deleteUser(user.id)}>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>

    <button className="d-grid gap-2 mx-auto btn btn-primary" onClick={userFetch}>Reload</button>
  </>
);
}

  
export default User