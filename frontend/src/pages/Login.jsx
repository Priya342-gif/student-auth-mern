import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/login", form);
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

                <button type="submit">Login</button>
            </form>

            <span className="link" onClick={() => navigate("/register")}>
                New user? Register
            </span>
        </div>
    );
};

export default Login;