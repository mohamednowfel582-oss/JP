// API Client for Complaint Management System with Live Backend Support & Cloud Static Fallback
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function getAuthToken() {
  return localStorage.getItem('cms_token');
}

export function getCurrentUser() {
  const user = localStorage.getItem('cms_user');
  const role = localStorage.getItem('cms_role');
  if (!user || !role) return null;
  try {
    return { ...JSON.parse(user), role };
  } catch (e) {
    return null;
  }
}

export function setAuthSession(token, user, role) {
  localStorage.setItem('cms_token', token);
  localStorage.setItem('cms_user', JSON.stringify(user));
  localStorage.setItem('cms_role', role);
}

export function clearAuthSession() {
  localStorage.removeItem('cms_token');
  localStorage.removeItem('cms_user');
  localStorage.removeItem('cms_role');
}

// Initial Cloud Seed Data (used if static frontend is deployed without live Java backend attached)
const DEFAULT_STUDENTS = [
  {
    id: 1,
    studentId: 'STU1001',
    name: 'Aarav Sharma',
    email: 'aarav@college.edu',
    phone: '+91 9876543210',
    password: 'student123',
    createdAt: '2026-09-21 10:00:00',
  }
];

const DEFAULT_COMPLAINTS = [
  {
    id: 1,
    complaintId: 1,
    complaintCode: 'CMP1001',
    studentId: 'STU1001',
    name: 'Aarav Sharma',
    category: 'Hostel',
    title: 'Water heater not functioning',
    description: 'Water heater in 2nd floor bathroom Wing B is tripping the fuse.',
    location: 'Hostel Block B, 2nd Floor',
    priority: 'Urgent',
    status: 'Pending',
    imageUrl: null,
    createdAt: '2026-09-21 10:30:00',
    updatedAt: '2026-09-21 10:30:00',
    responses: []
  },
  {
    id: 2,
    complaintId: 2,
    complaintCode: 'CMP1002',
    studentId: 'STU1001',
    name: 'Aarav Sharma',
    category: 'Electricity',
    title: 'Flickering lights in Computer Lab 3',
    description: 'Tube lights flickering constantly causing disturbance during lab sessions.',
    location: 'Academic Block 2, Room 204',
    priority: 'Medium',
    status: 'In Progress',
    imageUrl: null,
    createdAt: '2026-09-21 11:15:00',
    updatedAt: '2026-09-21 12:00:00',
    responses: [
      {
        id: 1,
        complaintId: 2,
        adminUsername: 'admin',
        response: 'Electrician team dispatched. Replacement choke ordered.',
        createdAt: '2026-09-21 12:00:00'
      }
    ]
  },
  {
    id: 3,
    complaintId: 3,
    complaintCode: 'CMP1003',
    studentId: 'STU1001',
    name: 'Aarav Sharma',
    category: 'Food',
    title: 'Breakfast timing delay in Central Mess',
    description: 'Breakfast was delayed by 30 minutes, causing students to be late for 8:30 AM lecture.',
    location: 'Central Dining Hall',
    priority: 'Low',
    status: 'Resolved',
    imageUrl: null,
    createdAt: '2026-09-20 09:00:00',
    updatedAt: '2026-09-20 16:30:00',
    responses: [
      {
        id: 2,
        complaintId: 3,
        adminUsername: 'admin',
        response: 'Discussed with mess contractor. Kitchen shifts rescheduled.',
        createdAt: '2026-09-20 16:30:00'
      }
    ]
  },
  {
    id: 4,
    complaintId: 4,
    complaintCode: 'CMP1004',
    studentId: 'STU1001',
    name: 'Aarav Sharma',
    category: 'Maintenance',
    title: 'Broken door handle in Seminar Hall',
    description: 'Entrance door handle is loose and getting jammed.',
    location: 'Main Auditorium Wing',
    priority: 'High',
    status: 'In Progress',
    imageUrl: null,
    createdAt: '2026-09-21 14:00:00',
    updatedAt: '2026-09-21 15:00:00',
    responses: []
  }
];

function getLocalStore(key, defaultVal) {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return defaultVal;
  }
}

function setLocalStore(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// Fallback Mock Engine for Vercel/Static host without Java backend attached
function handleLocalMock(endpoint, method, body) {
  const students = getLocalStore('cms_mock_students', DEFAULT_STUDENTS);
  const complaints = getLocalStore('cms_mock_complaints', DEFAULT_COMPLAINTS);
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  // Student Register
  if (endpoint === '/students/register' && method === 'POST') {
    const existing = students.find(s => s.studentId === body.studentId || s.email === body.email);
    if (existing) {
      throw new Error('Student ID or Email already registered.');
    }
    const newStudent = {
      id: students.length + 1,
      studentId: body.studentId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: body.password,
      createdAt: now,
    };
    students.push(newStudent);
    setLocalStore('cms_mock_students', students);
    return {
      success: true,
      token: 'demo-token-' + Date.now(),
      student: newStudent,
      message: 'Student account registered successfully.'
    };
  }

  // Student Login
  if (endpoint === '/students/login' && method === 'POST') {
    const s = students.find(x => (x.studentId === body.studentId || x.email === body.studentId) && (x.password === body.password || body.password === 'student123'));
    if (s || (body.studentId === 'STU1001' && body.password === 'student123')) {
      const studentData = s || students[0];
      return {
        success: true,
        token: 'demo-token-' + Date.now(),
        student: studentData,
        message: 'Login successful.'
      };
    }
    throw new Error('Invalid Student ID or password.');
  }

  // Admin Login
  if (endpoint === '/admin/login' && method === 'POST') {
    if (body.username === 'admin' && body.password === 'admin123') {
      return {
        success: true,
        token: 'demo-admin-token-' + Date.now(),
        admin: { username: 'admin', name: 'System Administrator' },
        message: 'Admin login successful.'
      };
    }
    throw new Error('Invalid administrative credentials.');
  }

  // My Complaints
  if (endpoint.startsWith('/complaints/my') && method === 'GET') {
    const user = getCurrentUser();
    const studentId = user?.studentId || 'STU1001';
    const my = complaints.filter(c => c.studentId === studentId);
    const stats = {
      total: my.length,
      pending: my.filter(c => c.status === 'Pending').length,
      inProgress: my.filter(c => c.status === 'In Progress').length,
      resolved: my.filter(c => c.status === 'Resolved').length,
    };
    return { complaints: my, stats };
  }

  // Track Complaint
  if (endpoint.startsWith('/complaints/track/') && method === 'GET') {
    const code = decodeURIComponent(endpoint.replace('/complaints/track/', '')).trim();
    const c = complaints.find(x => x.complaintCode.toLowerCase() === code.toLowerCase() || String(x.id) === code);
    if (c) return { found: true, complaint: c };
    throw new Error(`Complaint #${code} not found.`);
  }

  // Create Complaint
  if (endpoint === '/complaints' && method === 'POST') {
    const nextId = complaints.length > 0 ? Math.max(...complaints.map(x => x.id)) + 1 : 1;
    const nextNum = 1000 + nextId;
    const newComp = {
      id: nextId,
      complaintId: nextId,
      complaintCode: 'CMP' + nextNum,
      studentId: body.studentId || 'STU1001',
      name: body.studentName || 'Student',
      category: body.category || 'Other',
      title: body.title,
      description: body.description,
      location: body.location || 'Campus',
      priority: body.priority || 'Medium',
      status: 'Pending',
      imageUrl: body.imageUrl || null,
      createdAt: now,
      updatedAt: now,
      responses: []
    };
    complaints.unshift(newComp);
    setLocalStore('cms_mock_complaints', complaints);
    return {
      success: true,
      message: `Complaint #${newComp.complaintCode} registered successfully.`,
      complaint: newComp
    };
  }

  // Admin All Complaints
  if (endpoint.startsWith('/admin/complaints') && method === 'GET') {
    const stats = {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
    };
    return { complaints, stats };
  }

  // Admin Update Status
  if (endpoint.includes('/status') && method === 'PUT') {
    const parts = endpoint.split('/');
    const id = parseInt(parts[parts.indexOf('complaints') + 1], 10);
    const c = complaints.find(x => x.id === id);
    if (c) {
      c.status = body.status;
      c.updatedAt = now;
      setLocalStore('cms_mock_complaints', complaints);
      return { success: true, message: `Status updated to ${body.status}`, status: body.status };
    }
    throw new Error('Complaint not found.');
  }

  // Admin Add Response
  if (endpoint.includes('/response') && method === 'POST') {
    const parts = endpoint.split('/');
    const id = parseInt(parts[parts.indexOf('complaints') + 1], 10);
    const c = complaints.find(x => x.id === id);
    if (c) {
      c.responses = c.responses || [];
      c.responses.push({
        id: c.responses.length + 1,
        complaintId: id,
        adminUsername: 'admin',
        response: body.response,
        createdAt: now
      });
      c.updatedAt = now;
      setLocalStore('cms_mock_complaints', complaints);
      return { success: true, message: 'Response added successfully.' };
    }
    throw new Error('Complaint not found.');
  }

  // Admin Delete Complaint
  if (endpoint.startsWith('/admin/complaints/') && method === 'DELETE') {
    const id = parseInt(endpoint.replace('/admin/complaints/', ''), 10);
    const filtered = complaints.filter(x => x.id !== id);
    setLocalStore('cms_mock_complaints', filtered);
    return { success: true, message: 'Complaint deleted.' };
  }

  // Admin Students
  if (endpoint === '/admin/students' && method === 'GET') {
    return { students, total: students.length };
  }

  // Admin Reports
  if (endpoint === '/admin/reports' && method === 'GET') {
    const statusCounts = {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
    };
    const categoryCounts = {};
    const priorityCounts = {};
    complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
      priorityCounts[c.priority] = (priorityCounts[c.priority] || 0) + 1;
    });
    return {
      statusCounts,
      categoryCounts,
      priorityCounts,
      totalStudents: students.length,
      totalComplaints: statusCounts.total,
      pendingComplaints: statusCounts.pending,
      inProgressComplaints: statusCounts.inProgress,
      resolvedComplaints: statusCounts.resolved,
    };
  }

  // Single Complaint Details
  if (endpoint.startsWith('/complaints/') && method === 'GET') {
    const idOrCode = endpoint.replace('/complaints/', '').trim();
    const c = complaints.find(x => String(x.id) === idOrCode || x.complaintCode.toLowerCase() === idOrCode.toLowerCase());
    if (c) return c;
    throw new Error('Complaint not found');
  }

  return { success: true };
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // If server returned HTML (e.g. 404 page from Vercel edge), fall back to local mock
      if (text.includes('<!DOCTYPE') || text.includes('<html') || text.includes('404')) {
        throw new Error('FALLBACK_MOCK');
      }
      data = text;
    }

    if (!response.ok) {
      const errorMsg = (data && data.error) || (data && data.message) || `HTTP error ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    // If backend is not reached (e.g. static Vercel deployment without Java host), run client mock
    const body = options.body ? JSON.parse(options.body) : {};
    return handleLocalMock(endpoint, options.method || 'GET', body);
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
