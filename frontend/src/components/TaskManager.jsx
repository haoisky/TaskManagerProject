import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaTrash, FaEdit, FaCheckCircle, FaRegCircle, FaPlus, FaSave, 
    FaSearch, FaTasks, FaExclamationCircle, FaClock, FaSortAmountDown,
    FaCalendarTimes, FaMoon, FaSun, FaList, FaCalendarAlt, FaTimes, FaCog, 
    FaSignOutAlt // Added Logout Icon
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';

const API_URL = 'http://localhost:5000/api/tasks';
const AVATAR_OPTIONS = ['👨‍💻', '👩‍💻', '🐶', '🐱', '🦊', '🐸', '🤖', '👽', '💀', '👻', '🎃', '🌟'];

const TaskManager = ({ logout }) => {
    
    // --- STATES ---
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'Medium', category: 'Personal', dueDate: '' });
    const [editingId, setEditingId] = useState(null);
    const [filter, setFilter] = useState('All'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Newest');
    
    // UI STATES
    const [view, setView] = useState('list'); 
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    
    // MODAL STATES
    const [taskToDelete, setTaskToDelete] = useState(null); 
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // NEW: Logout Modal State

    const username = localStorage.getItem('username') || 'User';
    const userInitial = username.charAt(0);
    const [avatar, setAvatar] = useState(() => localStorage.getItem('userAvatar') || null);

    // --- EFFECTS ---
    useEffect(() => {
        if (darkMode) { document.body.classList.add('dark-mode'); localStorage.setItem('theme', 'dark'); } 
        else { document.body.classList.remove('dark-mode'); localStorage.setItem('theme', 'light'); }
    }, [darkMode]);

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            setTasks(response.data);
        } catch (error) { toast.error("Failed to load tasks."); }
    };

    const getLocalISOString = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const offset = d.getTimezoneOffset() * 60000;
        const localDate = new Date(d.getTime() - offset);
        return localDate.toISOString().split('T')[0];
    };

    // --- HANDLERS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) { toast.warning("Title is required!"); return; }
        try {
            if (editingId) {
                const response = await axios.put(`${API_URL}/${editingId}`, formData);
                setTasks(tasks.map(t => (t._id === editingId ? response.data : t)));
                setEditingId(null);
                toast.info("Task updated successfully!");
            } else {
                const response = await axios.post(API_URL, formData);
                setTasks([response.data, ...tasks]);
                toast.success("New task added!");
            }
            setFormData({ title: '', description: '', priority: 'Medium', category: 'Personal', dueDate: '' });
        } catch (error) { toast.error("Error saving task."); }
    };

    const handleEdit = (task) => {
        setEditingId(task._id);
        setFormData({
            title: task.title, description: task.description || '', priority: task.priority, category: task.category || 'Personal',
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
        });
        if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const confirmDelete = (id) => setTaskToDelete(id);

    const executeDelete = async () => {
        if (!taskToDelete) return;
        try {
            await axios.delete(`${API_URL}/${taskToDelete}`);
            setTasks(tasks.filter(task => task._id !== taskToDelete));
            toast.success("Task deleted.");
            setTaskToDelete(null);
        } catch (error) { toast.error("Failed to delete."); }
    };

    const toggleComplete = async (task) => {
        try {
            const response = await axios.put(`${API_URL}/${task._id}`, { isCompleted: !task.isCompleted });
            setTasks(tasks.map(t => (t._id === task._id ? response.data : t)));
            if(!task.isCompleted) toast.success("Task completed! 🎉");
        } catch (error) { console.error(error); }
    };

    const saveAvatar = (selectedEmoji) => {
        setAvatar(selectedEmoji);
        localStorage.setItem('userAvatar', selectedEmoji);
        setShowProfileModal(false);
        toast.success("Avatar updated!");
    };

    // --- NEW LOGOUT LOGIC ---
    const confirmLogout = () => {
        setShowLogoutModal(true); // Open the Nice Modal instead of Window Alert
    };

    const executeLogout = () => {
        logout();
        setShowLogoutModal(false);
        toast.success("Logged out successfully! 👋"); // Show Toast
    };

    // --- HELPERS ---
    const checkOverdue = (task) => {
        if (!task.dueDate || task.isCompleted) return false;
        const todayStr = getLocalISOString(new Date());
        const taskDateStr = task.dueDate.split('T')[0];
        return taskDateStr < todayStr;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = getLocalISOString(date);
            const tasksForDay = tasks.filter(t => t.dueDate && t.dueDate.split('T')[0] === dateStr);
            if (tasksForDay.length > 0) {
                return (
                    <div className="dot-container">
                        {tasksForDay.slice(0, 3).map((t, i) => ( 
                            <div key={i} className={`calendar-dot ${t.isCompleted ? 'dot-completed' : t.priority === 'High' ? 'dot-high' : t.priority === 'Medium' ? 'dot-medium' : 'dot-low'}`} />
                        ))}
                    </div>
                );
            }
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (view === 'calendar') {
            if (!task.dueDate) return false;
            return getLocalISOString(selectedDate) === task.dueDate.split('T')[0];
        } else {
            if (filter === 'Completed' && !task.isCompleted) return false;
            if (filter === 'Pending' && task.isCompleted) return false;
            if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        }
    }).sort((a, b) => {
        if (sortBy === 'Deadline') return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
        if (sortBy === 'Priority') { const map = { High: 1, Medium: 2, Low: 3 }; return map[a.priority] - map[b.priority]; }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityCount = tasks.filter(t => t.priority === 'High' && !t.isCompleted).length;

    return (
        <div className="app-container">
            <div className="header-container">
                <div className="profile-section" onClick={() => setShowProfileModal(true)} title="Change Avatar">
                    <div className="user-avatar">{avatar ? avatar : userInitial}</div>
                    <div>
                        <h1 className="brand-title">Task Manager</h1>
                        <p className="brand-subtitle">Let's be productive today, <b>{username}</b>!</p>
                    </div>
                    <FaCog style={{color: 'var(--text-muted)', marginLeft: '5px'}}/>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => setDarkMode(!darkMode)} style={{background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '50%', cursor: 'pointer', color: darkMode ? '#fbbf24' : '#64748b', display: 'flex', fontSize: '1.2rem'}}>{darkMode ? <FaSun /> : <FaMoon />}</button>
                    {/* BUTTON OPENS MODAL NOW */}
                    <button onClick={confirmLogout} style={{background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: 'var(--text-muted)'}}>Logout</button>
                </div>
            </div>

            <div className="main-grid">
                <div className="left-panel">
                    <div className="stats-grid">
                        <div className="stat-card"><div className="stat-icon-box stat-blue"><FaTasks /></div><div className="stat-info"><h4>Total</h4><p>{totalTasks}</p></div></div>
                        <div className="stat-card"><div className="stat-icon-box stat-orange"><FaClock /></div><div className="stat-info"><h4>Pending</h4><p>{pendingTasks}</p></div></div>
                        <div className="stat-card"><div className="stat-icon-box stat-green"><FaCheckCircle /></div><div className="stat-info"><h4>Done</h4><p>{completedTasks}</p></div></div>
                        <div className="stat-card"><div className="stat-icon-box stat-red"><FaExclamationCircle /></div><div className="stat-info"><h4>High</h4><p>{highPriorityCount}</p></div></div>
                    </div>

                    <form onSubmit={handleSubmit} className="input-group">
                        <h3 style={{margin: '0 0 10px 0', fontSize: '1.2rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            {editingId ? <><FaEdit/> Edit Task</> : <><FaPlus/> Add New Task</>}
                        </h3>
                        <input type="text" name="title" placeholder="Task Title" value={formData.title} onChange={handleChange} />
                        <textarea name="description" placeholder="Description / Notes" value={formData.description} onChange={handleChange} rows="3" style={{resize: 'vertical'}}/>
                        <div className="flex-row">
                            <select name="category" value={formData.category} onChange={handleChange} style={{flex: 1}}><option value="Personal">Personal</option><option value="Work">Work</option><option value="School">School</option><option value="Shopping">Shopping</option><option value="Health">Health</option></select>
                            <select name="priority" value={formData.priority} onChange={handleChange} style={{flex: 1}}><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select>
                        </div>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
                        
                        <button type="submit" className="btn-primary">{editingId ? 'Update Task' : 'Add Task'}</button>
                        {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({ title: '', description: '', priority: 'Medium', category: 'Personal', dueDate: '' })}} style={{background: 'var(--text-muted)', color: 'white', border:'none', cursor:'pointer', padding: '10px', borderRadius: '8px', fontWeight: '600'}}>Cancel Edit</button>}
                    </form>
                </div>

                <div className="right-panel">
                    <div className="controls-bar">
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input type="text" placeholder="Search tasks..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} disabled={view === 'calendar'} />
                        </div>
                        
                        {view === 'list' && (
                            <div style={{position: 'relative'}}>
                                <FaSortAmountDown style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)'}}/>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{paddingLeft: '30px', cursor: 'pointer', height: '100%', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)'}}>
                                    <option value="Newest">Newest</option>
                                    <option value="Deadline">Deadline</option>
                                    <option value="Priority">Priority</option>
                                </select>
                            </div>
                        )}

                        <div className="view-toggle">
                            <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><FaList /> List</button>
                            <button className={`view-btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}><FaCalendarAlt /> Calendar</button>
                        </div>
                    </div>

                    {view === 'list' && (
                        <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                            {['All', 'Pending', 'Completed'].map(f => (
                                <button key={f} onClick={() => setFilter(f)} style={{background: filter === f ? 'var(--primary)' : 'var(--bg-card)', color: filter === f ? 'white' : 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s'}}>{f}</button>
                            ))}
                        </div>
                    )}

                    <div>
                        {view === 'calendar' ? (
                            <div className="calendar-container">
                                <Calendar onChange={setSelectedDate} value={selectedDate} tileContent={tileContent} />
                                <div style={{marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '15px'}}>
                                    <h4 style={{margin: '0 0 10px 0', color: 'var(--text-muted)'}}>Tasks for {selectedDate.toDateString()}:</h4>
                                    {filteredTasks.length === 0 ? <p style={{color: 'var(--text-muted)', fontStyle: 'italic'}}>No tasks for this day.</p> : null}
                                </div>
                            </div>
                        ) : null}

                        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                            {filteredTasks.map((task) => {
                                const isOverdue = checkOverdue(task);
                                return (
                                    <div key={task._id} className={`task-card priority-${task.priority}`}>
                                        <div style={{display:'flex', alignItems:'flex-start', gap: '15px', flex: 1}}>
                                            <button onClick={() => toggleComplete(task)} className={`action-btn check-btn ${task.isCompleted ? 'completed' : ''}`} style={{marginTop: '2px'}}>{task.isCompleted ? <FaCheckCircle /> : <FaRegCircle />}</button>
                                            <div>
                                                <h3 style={{margin: 0, fontSize: '1.2rem', textDecoration: task.isCompleted ? 'line-through' : 'none', color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-main)'}}>{task.title}</h3>
                                                {task.description && <p style={{margin: '6px 0', fontSize: '0.95rem', color: 'var(--text-muted)'}}>{task.description}</p>}
                                                <div style={{display:'flex', gap: '8px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                                                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                                                    <span style={{background: 'var(--bg-app)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', border: '1px solid var(--border-color)'}}>{task.category}</span>
                                                    
                                                    <span className={isOverdue ? "text-overdue" : ""} style={{fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px'}}>
                                                        {isOverdue && <FaExclamationCircle color="var(--danger)"/>}
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "🗓 No deadline set"}
                                                        {isOverdue && " Overdue"}
                                                    </span>

                                                </div>
                                            </div>
                                        </div>
                                        <div style={{display: 'flex', gap: '8px'}}>
                                            <button onClick={() => handleEdit(task)} className="action-btn edit-btn"><FaEdit /></button>
                                            <button onClick={() => confirmDelete(task._id)} className="action-btn delete-btn"><FaTrash /></button>
                                        </div>
                                    </div>
                                );
                            })}
                            {view === 'list' && filteredTasks.length === 0 && (
                                <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                                    <p>No tasks found. Time to relax! 🌿</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* AVATAR MODAL */}
            {showProfileModal && (
                <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 style={{margin: '0 0 10px 0'}}>Choose Avatar</h2>
                        <div className="avatar-grid">
                            {AVATAR_OPTIONS.map(emoji => (
                                <div key={emoji} className={`avatar-option ${avatar === emoji ? 'selected' : ''}`} onClick={() => saveAvatar(emoji)}>{emoji}</div>
                            ))}
                        </div>
                        <button className="btn-cancel" onClick={() => setShowProfileModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {taskToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <FaExclamationCircle style={{fontSize: '3rem', color: 'var(--danger)', marginBottom: '15px'}} />
                        <h2 style={{margin: '0 0 10px 0'}}>Are you sure?</h2>
                        <p style={{color: 'var(--text-muted)', marginBottom: '25px'}}>Do you really want to delete this task?</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setTaskToDelete(null)}>Cancel</button>
                            <button className="btn-confirm" onClick={executeDelete}>Yes, Delete it</button>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW LOGOUT MODAL */}
            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <FaSignOutAlt style={{fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '15px'}} />
                        <h2 style={{margin: '0 0 10px 0'}}>Log Out</h2>
                        <p style={{color: 'var(--text-muted)', marginBottom: '25px'}}>Are you sure you want to log out?</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className="btn-confirm" onClick={executeLogout}>Yes, Log Out</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManager;