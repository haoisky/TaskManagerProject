import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    // Added confirmPassword to state
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // 1. Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // 2. Check password length (optional but good practice)
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            // Only send necessary data to backend (exclude confirmPassword)
            await axios.post('http://localhost:5000/api/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            alert("Registration Successful! Please login.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="brand-title">Create Account</h1>
                <p className="subtitle">Join us to manage your tasks efficiently.</p>
                
                {error && <p className="text-danger" style={{background: '#fef2f2', padding: '10px', borderRadius:'8px'}}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" placeholder="e.g. ShioDev" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" placeholder="name@example.com" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
                    </div>
                    {/* NEW CONFIRM PASSWORD FIELD */}
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} required />
                    </div>
                    
                    <button type="submit" className="btn-primary">Sign Up</button>
                </form>

                <div style={{marginTop: '20px'}}>
                    <span style={{color: '#64748b'}}>Already have an account? </span>
                    <Link to="/login" className="btn-secondary">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;