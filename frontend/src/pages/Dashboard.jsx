import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [course, setCourse] = useState("");
    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await API.get("/dashboard");
            setUser(res.data);
        } catch {
            navigate("/");
        }
    };

    const updateCourse = async () => {
        await API.put("/update-course", { course });
        alert("Course updated");
    };

    const updatePassword = async () => {
        await API.put("/update-password", password);
        alert("Password updated");
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="container">
            <h2>Welcome {user.name}</h2>

            <p><b>Email:</b> {user.email}</p>
            <p><b>Course:</b> {user.course}</p>

            <hr />

            <h3>Update Course</h3>
            <input onChange={(e) => setCourse(e.target.value)} placeholder="New Course" />
            <button onClick={updateCourse}>Update Course</button>

            <hr />

            <h3>Update Password</h3>
            <input type="password" placeholder="Old Password"
                onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })} />
            <input type="password" placeholder="New Password"
                onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} />
            <button onClick={updatePassword}>Update Password</button>

            <hr />

            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;