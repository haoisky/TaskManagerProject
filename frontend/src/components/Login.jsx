import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// 1. IMPORT TOAST
import { toast } from 'react-toastify'; 

const Login = ({ setToken }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://taskmanager-dx2w.onrender.com/api/auth/login', formData);
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            setToken(res.data.token);
            
            // 2. SHOW SUCCESS TOAST
            toast.success("Logged in successfully! 🚀");
            
            navigate('/');
        } catch (err) {
            // 3. SHOW ERROR TOAST (Optional but good)
            toast.error("Invalid email or password");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="brand-title">Welcome Back</h1>
                <p className="subtitle">Enter your credentials to access your tasks.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-primary">Login</button>
                </form>

                <div style={{marginTop: '20px'}}>
                    <span style={{color: 'var(--text-muted)'}}>No account yet? </span>
                    <Link to="/register" className="btn-secondary">Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;