import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        course: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/register", form);
            alert("Registered successfully");
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} required />
                <input name="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                <input name="course" placeholder="Course" onChange={handleChange} required />

                <button type="submit">Register</button>
            </form>

            <span className="link" onClick={() => navigate("/")}>
                Already have an account? Login
            </span>
        </div>
    );
};

export default Register;