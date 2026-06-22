import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialLectures = [
  { id: 1, title: 'English Literature: The Portrait of a Lady', teacher: 'Mrs. Anjali Sen', time: '09:30 AM', duration: '45 mins', notesName: 'portrait_of_lady_notes.pdf', isLive: false },
  { id: 2, title: 'Mathematics: Quadratic Equations', teacher: 'Mr. Rajesh Kumar', time: '11:00 AM', duration: '50 mins', notesName: 'quadratic_eq_notes.pdf', isLive: false },
  { id: 3, title: 'Physics: Laws of Motion', teacher: 'Dr. S. K. Singh', time: '01:30 PM', duration: '40 mins', notesName: 'laws_of_motion_notes.pdf', isLive: true },
  { id: 4, title: 'Chemistry: Carbon and its Compounds', teacher: 'Ms. Priya Sharma', time: '03:00 PM', duration: '45 mins', notesName: 'carbon_compounds_notes.pdf', isLive: false }
];

const initialNcertResources = [
  { id: 1, title: 'First Flight (Class 10 English Literature)', size: '4.8 MB', subject: 'English' },
  { id: 2, title: 'Footprints Without Feet (Class 10 Supplementary Reader)', size: '3.2 MB', subject: 'English' },
  { id: 3, title: 'Mathematics Textbook for Class X', size: '12.4 MB', subject: 'Mathematics' },
  { id: 4, title: 'Science Textbook for Class X', size: '15.1 MB', subject: 'Science' },
  { id: 5, title: 'India and the Contemporary World II (History)', size: '8.6 MB', subject: 'Social Science' }
];

const initialTeachers = [
  { id: 1, name: 'Mrs. Anjali Sen', subject: 'English Literature', email: 'anjali.sen@englishzone.edu', experience: '12 Years', rating: '4.9', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: 'Mr. Rajesh Kumar', subject: 'Mathematics', email: 'rajesh.kumar@englishzone.edu', experience: '8 Years', rating: '4.8', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop' },
  { id: 3, name: 'Dr. S. K. Singh', subject: 'Physics', email: 'sk.singh@englishzone.edu', experience: '15 Years', rating: '5.0', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' },
  { id: 4, name: 'Ms. Priya Sharma', subject: 'Chemistry & Biology', email: 'priya.sharma@englishzone.edu', experience: '6 Years', rating: '4.7', photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=200&auto=format&fit=crop' }
];

const initialExamResults = [
  { id: 1, subject: 'English Literature', marks: '94/100', grade: 'A1', remarks: 'Excellent essay writing and vocabulary.' },
  { id: 2, subject: 'Mathematics', marks: '88/100', grade: 'A2', remarks: 'Good analytical skills, minor calculation errors.' },
  { id: 3, subject: 'Physics', marks: '91/100', grade: 'A1', remarks: 'Outstanding understanding of laws of motion.' },
  { id: 4, subject: 'Chemistry', marks: '85/100', grade: 'A2', remarks: 'Good grasp of equations, needs practice in labs.' },
  { id: 5, subject: 'Social Science', marks: '90/100', grade: 'A1', remarks: 'Very thorough with historical dates and maps.' }
];

const initialExamSchedule = [
  { id: 1, date: '2026-07-10', day: 'Friday', time: '09:00 AM', subject: 'English Grammar & Composition', type: 'Unit Test II', syllabus: 'Tenses, Prepositions, Report Writing, Letter Writing' },
  { id: 2, date: '2026-07-13', day: 'Monday', time: '09:00 AM', subject: 'Mathematics (Algebra)', type: 'Unit Test II', syllabus: 'Quadratic Equations, Arithmetic Progressions' },
  { id: 3, date: '2026-07-15', day: 'Wednesday', time: '09:00 AM', subject: 'Science (Physics & Chemistry)', type: 'Unit Test II', syllabus: 'Refraction of Light, Periodic Classification of Elements' }
];

const initialAdmitCards = [
  { id: 1, examName: 'First Term Board-Pattern Exams (September 2026)', releaseDate: '2026-08-25', status: 'Available' },
  { id: 2, examName: 'Unit Test II Exams (July 2026)', releaseDate: '2026-06-20', status: 'Available' }
];

const initialInvoices = [
  { id: 'INV-2026-001', description: 'June Tuition Fee', type: 'Tuition', amount: 2500, transportFee: 800, date: '2026-06-01', dueDate: '2026-06-20', status: 'Pending' },
  { id: 'INV-2026-002', description: 'May Tuition & Lab Charges', type: 'Tuition + Lab', amount: 3200, transportFee: 800, date: '2026-05-01', dueDate: '2026-05-20', status: 'Paid' },
  { id: 'INV-2026-003', description: 'April Tuition Fee', type: 'Tuition', amount: 2500, transportFee: 800, date: '2026-04-01', dueDate: '2026-04-20', status: 'Paid' },
  { id: 'INV-2026-004', description: 'Annual Book Deposit & Library Fee', type: 'Administrative', amount: 4500, transportFee: 0, date: '2026-03-15', dueDate: '2026-03-30', status: 'Overdue' }
];

const weekdaySchedules = {
  Monday: [
    { id: 1, subject: 'English Literature', room: 'Room 101', time: '09:30 AM - 10:15 AM', teacher: 'Mrs. Anjali Sen' },
    { id: 2, subject: 'Mathematics', room: 'Room 204', time: '11:00 AM - 11:50 AM', teacher: 'Mr. Rajesh Kumar' },
    { id: 3, subject: 'Physics', room: 'Lab 2', time: '01:30 PM - 02:10 PM', teacher: 'Dr. S. K. Singh' }
  ],
  Tuesday: [
    { id: 1, subject: 'Chemistry', room: 'Lab 1', time: '09:30 AM - 10:15 AM', teacher: 'Ms. Priya Sharma' },
    { id: 2, subject: 'English Grammar', room: 'Room 101', time: '11:00 AM - 11:50 AM', teacher: 'Mrs. Anjali Sen' },
    { id: 3, subject: 'Mathematics', room: 'Room 204', time: '01:30 PM - 02:10 PM', teacher: 'Mr. Rajesh Kumar' }
  ],
  Wednesday: [
    { id: 1, subject: 'Biology', room: 'Room 105', time: '09:30 AM - 10:15 AM', teacher: 'Ms. Priya Sharma' },
    { id: 2, subject: 'Physics', room: 'Lab 2', time: '11:00 AM - 11:50 AM', teacher: 'Dr. S. K. Singh' },
    { id: 3, subject: 'Social Science', room: 'Room 103', time: '01:30 PM - 02:10 PM', teacher: 'Mrs. Anjali Sen' }
  ],
  Thursday: [
    { id: 1, subject: 'English Literature', room: 'Room 101', time: '09:30 AM - 10:15 AM', teacher: 'Mrs. Anjali Sen' },
    { id: 2, subject: 'Mathematics', room: 'Room 204', time: '11:00 AM - 11:50 AM', teacher: 'Mr. Rajesh Kumar' },
    { id: 3, subject: 'Chemistry', room: 'Lab 1', time: '01:30 PM - 02:10 PM', teacher: 'Ms. Priya Sharma' }
  ],
  Friday: [
    { id: 1, subject: 'Science Practical', room: 'Lab 1', time: '09:30 AM - 10:15 AM', teacher: 'Dr. S. K. Singh' },
    { id: 2, subject: 'Social Science', room: 'Room 103', time: '11:00 AM - 11:50 AM', teacher: 'Mrs. Anjali Sen' },
    { id: 3, subject: 'Mathematics Extra', room: 'Room 204', time: '01:30 PM - 02:10 PM', teacher: 'Mr. Rajesh Kumar' }
  ],
  Saturday: [
    { id: 1, subject: 'Weekly Mock Quiz', room: 'Online Portal', time: '10:00 AM - 11:30 AM', teacher: 'All Faculty' }
  ],
  Sunday: []
};

const mockStudent = {
  name: 'Rohan Sharma',
  rollNo: 'EZ2026024',
  grade: 'Grade 10-A',
  email: 'rohan.sharma@englishzone.com',
  phone: '+91 98765 43210',
  dob: '2011-05-14',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  attendance: 87.5,
  role: 'student'
};

const mockTeacher = {
  name: 'Mrs. Anjali Sen',
  employeeId: 'EZ-TCH-2026045',
  designation: 'Grade 10-A Class Teacher',
  subject: 'English Literature & Composition',
  email: 'anjali.sen@englishzone.edu',
  phone: '+91 98765 43211',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
  role: 'teacher'
};

const teacherSchedules = {
  Monday: [
    { id: 1, subject: 'English Literature', room: 'Room 101', time: '09:30 AM - 10:15 AM', classSection: 'Grade 10-A' },
    { id: 2, subject: 'English Grammar', room: 'Room 102', time: '11:00 AM - 11:45 AM', classSection: 'Grade 9-B' },
    { id: 3, subject: 'English Composition', room: 'Room 101', time: '01:30 PM - 02:15 PM', classSection: 'Grade 10-A' }
  ],
  Tuesday: [
    { id: 1, subject: 'English Literature', room: 'Room 103', time: '09:30 AM - 10:15 AM', classSection: 'Grade 10-B' },
    { id: 2, subject: 'English Grammar', room: 'Room 101', time: '11:00 AM - 11:45 AM', classSection: 'Grade 10-A' },
    { id: 3, subject: 'English Composition', room: 'Room 104', time: '01:30 PM - 02:15 PM', classSection: 'Grade 9-A' }
  ],
  Wednesday: [
    { id: 1, subject: 'English Literature', room: 'Room 101', time: '09:30 AM - 10:15 AM', classSection: 'Grade 10-A' },
    { id: 2, subject: 'English Grammar', room: 'Room 103', time: '11:00 AM - 11:45 AM', classSection: 'Grade 10-B' },
    { id: 3, subject: 'English Composition', room: 'Room 101', time: '01:30 PM - 02:15 PM', classSection: 'Grade 10-A' }
  ],
  Thursday: [
    { id: 1, subject: 'English Literature', room: 'Room 103', time: '09:30 AM - 10:15 AM', classSection: 'Grade 10-B' },
    { id: 2, subject: 'English Grammar', room: 'Room 101', time: '11:00 AM - 11:45 AM', classSection: 'Grade 10-A' },
    { id: 3, subject: 'English Composition', room: 'Room 102', time: '01:30 PM - 02:15 PM', classSection: 'Grade 9-B' }
  ],
  Friday: [
    { id: 1, subject: 'English Literature', room: 'Room 101', time: '09:30 AM - 10:15 AM', classSection: 'Grade 10-A' },
    { id: 2, subject: 'English Grammar', room: 'Room 104', time: '11:00 AM - 11:45 AM', classSection: 'Grade 9-A' },
    { id: 3, subject: 'English Composition', room: 'Room 103', time: '01:30 PM - 02:15 PM', classSection: 'Grade 10-B' }
  ],
  Saturday: [
    { id: 1, subject: 'Staff Meeting', room: 'Conference Hall', time: '10:00 AM - 11:30 AM', classSection: 'All Faculty' }
  ],
  Sunday: []
};

const initialTeacherAttendanceData = {
  June: {
    rate: 96.2,
    present: 13,
    absent: 1,
    leave: 0,
    calendar: [
      { date: 1, status: 'Present' }, { date: 2, status: 'Present' }, { date: 3, status: 'Present' }, { date: 4, status: 'Present' }, { date: 5, status: 'Present' }, { date: 6, status: 'Weekend' }, { date: 7, status: 'Weekend' },
      { date: 8, status: 'Present' }, { date: 9, status: 'Present' }, { date: 10, status: 'Present' }, { date: 11, status: 'Absent' }, { date: 12, status: 'Present' }, { date: 13, status: 'Weekend' }, { date: 14, status: 'Weekend' },
      { date: 15, status: 'Present' }, { date: 16, status: 'Present' }, { date: 17, status: 'Present' }, { date: 18, status: 'Present' }, { date: 19, status: 'Pending' }, { date: 20, status: 'Weekend' }, { date: 21, status: 'Weekend' },
      { date: 22, status: 'Pending' }, { date: 23, status: 'Pending' }, { date: 24, status: 'Pending' }, { date: 25, status: 'Pending' }, { date: 26, status: 'Pending' }, { date: 27, status: 'Weekend' }, { date: 28, status: 'Weekend' },
      { date: 29, status: 'Pending' }, { date: 30, status: 'Pending' }
    ]
  },
  May: {
    rate: 100.0,
    present: 21,
    absent: 0,
    leave: 0,
    calendar: [
      { date: 1, status: 'Present' }, { date: 2, status: 'Weekend' }, { date: 3, status: 'Weekend' },
      { date: 4, status: 'Present' }, { date: 5, status: 'Present' }, { date: 6, status: 'Present' }, { date: 7, status: 'Present' }, { date: 8, status: 'Present' }, { date: 9, status: 'Weekend' }, { date: 10, status: 'Weekend' },
      { date: 11, status: 'Present' }, { date: 12, status: 'Present' }, { date: 13, status: 'Present' }, { date: 14, status: 'Present' }, { date: 15, status: 'Present' }, { date: 16, status: 'Weekend' }, { date: 17, status: 'Weekend' },
      { date: 18, status: 'Present' }, { date: 19, status: 'Present' }, { date: 20, status: 'Present' }, { date: 21, status: 'Present' }, { date: 22, status: 'Present' }, { date: 23, status: 'Weekend' }, { date: 24, status: 'Weekend' },
      { date: 25, status: 'Present' }, { date: 26, status: 'Present' }, { date: 27, status: 'Present' }, { date: 28, status: 'Present' }, { date: 29, status: 'Present' }, { date: 30, status: 'Weekend' }, { date: 31, status: 'Weekend' }
    ]
  },
  April: {
    rate: 95.5,
    present: 21,
    absent: 1,
    leave: 0,
    calendar: [
      { date: 1, status: 'Present' }, { date: 2, status: 'Present' }, { date: 3, status: 'Present' }, { date: 4, status: 'Weekend' }, { date: 5, status: 'Weekend' },
      { date: 6, status: 'Present' }, { date: 7, status: 'Present' }, { date: 8, status: 'Present' }, { date: 9, status: 'Present' }, { date: 10, status: 'Present' }, { date: 11, status: 'Weekend' }, { date: 12, status: 'Weekend' },
      { date: 13, status: 'Present' }, { date: 14, status: 'Absent' }, { date: 15, status: 'Present' }, { date: 16, status: 'Present' }, { date: 17, status: 'Present' }, { date: 18, status: 'Weekend' }, { date: 19, status: 'Weekend' },
      { date: 20, status: 'Present' }, { date: 21, status: 'Present' }, { date: 22, status: 'Present' }, { date: 23, status: 'Present' }, { date: 24, status: 'Present' }, { date: 25, status: 'Weekend' }, { date: 26, status: 'Weekend' },
      { date: 27, status: 'Present' }, { date: 28, status: 'Present' }, { date: 29, status: 'Present' }, { date: 30, status: 'Present' }
    ]
  }
};

const initialTeacherSalaryData = {
  June: {
    gross: 65000,
    deductions: {
      leaves: 2500, // 1 Unpaid Leave
      tax: 4800,
      providentFund: 3500
    },
    netPayout: 54200,
    status: 'Processing'
  },
  May: {
    gross: 65000,
    deductions: {
      leaves: 0,
      tax: 5200,
      providentFund: 3500
    },
    netPayout: 56300,
    status: 'Paid'
  },
  April: {
    gross: 65000,
    deductions: {
      leaves: 0,
      tax: 5200,
      providentFund: 3500
    },
    netPayout: 56300,
    status: 'Paid'
  }
};

const initialClassRoster = [
  { id: 1, rollNo: 'EZ2026001', name: 'Arya Sen', avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=150&auto=format&fit=crop', attendance: 'Present', previousAttendanceRate: 96 },
  { id: 2, rollNo: 'EZ2026024', name: 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop', attendance: 'Present', previousAttendanceRate: 87.5 },
  { id: 3, rollNo: 'EZ2026009', name: 'Kabir Mehta', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop', attendance: 'Absent', previousAttendanceRate: 91 },
  { id: 4, rollNo: 'EZ2026012', name: 'Ananya Rao', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop', attendance: 'Present', previousAttendanceRate: 98 },
  { id: 5, rollNo: 'EZ2026018', name: 'Riya Gupta', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', attendance: 'Present', previousAttendanceRate: 94 },
  { id: 6, rollNo: 'EZ2026033', name: 'Siddharth Roy', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', attendance: 'Present', previousAttendanceRate: 88 },
  { id: 7, rollNo: 'EZ2026040', name: 'Sneha Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', attendance: 'Absent', previousAttendanceRate: 95 }
];

const initialGradebook = {
  'English Literature': {
    'Unit Test I': { 'EZ2026001': 88, 'EZ2026024': 85, 'EZ2026009': 78, 'EZ2026012': 94, 'EZ2026018': 92, 'EZ2026033': 80, 'EZ2026040': 89 },
    'Unit Test II': { 'EZ2026001': 92, 'EZ2026024': 94, 'EZ2026009': 82, 'EZ2026012': 96, 'EZ2026018': 91, 'EZ2026033': 85, 'EZ2026040': 90 },
    'First Term': { 'EZ2026001': 90, 'EZ2026024': 88, 'EZ2026009': 80, 'EZ2026012': 95, 'EZ2026018': 93, 'EZ2026033': 84, 'EZ2026040': 91 }
  },
  'English Grammar': {
    'Unit Test I': { 'EZ2026001': 92, 'EZ2026024': 78, 'EZ2026009': 85, 'EZ2026012': 90, 'EZ2026018': 88, 'EZ2026033': 82, 'EZ2026040': 87 },
    'Unit Test II': { 'EZ2026001': 90, 'EZ2026024': 80, 'EZ2026009': 88, 'EZ2026012': 92, 'EZ2026018': 85, 'EZ2026033': 84, 'EZ2026040': 89 },
    'First Term': { 'EZ2026001': 91, 'EZ2026024': 82, 'EZ2026009': 86, 'EZ2026012': 93, 'EZ2026018': 87, 'EZ2026033': 83, 'EZ2026040': 88 }
  },
  'Creative Writing': {
    'Unit Test I': { 'EZ2026001': 85, 'EZ2026024': 90, 'EZ2026009': 80, 'EZ2026012': 95, 'EZ2026018': 94, 'EZ2026033': 78, 'EZ2026040': 92 },
    'Unit Test II': { 'EZ2026001': 88, 'EZ2026024': 92, 'EZ2026009': 83, 'EZ2026012': 97, 'EZ2026018': 95, 'EZ2026033': 80, 'EZ2026040': 94 },
    'First Term': { 'EZ2026001': 87, 'EZ2026024': 91, 'EZ2026009': 82, 'EZ2026012': 96, 'EZ2026018': 94, 'EZ2026033': 79, 'EZ2026040': 93 }
  }
};

const initialTeacherResources = [
  { id: 1, title: 'English Literature: The Portrait of a Lady - Video Lecture', type: 'Video', link: 'https://youtube.com/watch?v=ez-literature-01', uploadedAt: '2026-06-16', targetClass: 'Grade 10-A' },
  { id: 2, title: 'Class 10 English Literature - Portrait of a Lady Notes', type: 'PDF Notes', link: '/downloads/portrait_of_lady_notes.pdf', uploadedAt: '2026-06-16', targetClass: 'Grade 10-A' },
  { id: 3, title: 'English Grammar: Tenses & Active/Passive Voice', type: 'Video', link: 'https://youtube.com/watch?v=ez-grammar-04', uploadedAt: '2026-06-17', targetClass: 'Grade 9-B' }
];

const mockAdmin = {
  name: 'Director Alex Carter',
  employeeId: 'EZ-ADM-2026001',
  designation: 'Principal Architect & Admin',
  email: 'admin@englishzone.com',
  phone: '+91 98765 43212',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
  role: 'admin'
};

const initialUsersDirectory = [
  { id: 1, name: 'Mrs. Anjali Sen', email: 'anjali.sen@englishzone.edu', role: 'Teacher', status: 'Active' },
  { id: 2, name: 'Mr. Rajesh Kumar', email: 'rajesh.kumar@englishzone.edu', role: 'Teacher', status: 'Active' },
  { id: 3, name: 'Ms. Priya Sharma', email: 'priya.sharma@englishzone.edu', role: 'Teacher', status: 'Active' },
  { id: 4, name: 'Rohan Sharma', email: 'rohan.sharma@englishzone.com', role: 'Student', status: 'Active' },
  { id: 5, name: 'Arya Sen', email: 'arya.sen@englishzone.com', role: 'Student', status: 'Active' },
  { id: 6, name: 'Kabir Mehta', email: 'kabir.mehta@englishzone.com', role: 'Student', status: 'Active' },
  { id: 7, name: 'Ananya Rao', email: 'ananya.rao@englishzone.com', role: 'Student', status: 'Active' },
  { id: 8, name: 'Mr. Dev Sharma', email: 'dev.sharma@parents.com', role: 'Parent', status: 'Active' },
  { id: 9, name: 'Mrs. Rekha Sen', email: 'rekha.sen@parents.com', role: 'Parent', status: 'Active' }
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ez_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [signupForm, setSignupForm] = useState(null);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedDay, setSelectedDay] = useState(() => {
    // Default to tomorrow's day of week, or Monday if weekend
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const tomorrowIndex = (new Date().getDay() + 1) % 7;
    const tomorrow = days[tomorrowIndex];
    return tomorrow === 'Sunday' ? 'Monday' : tomorrow;
  });

  const [activeDemos, setActiveDemos] = useState([]);

  // States for Teacher Panel
  const [classRoster, setClassRoster] = useState(initialClassRoster);
  const [gradebook, setGradebook] = useState(initialGradebook);
  const [teacherAttendance, setTeacherAttendance] = useState(initialTeacherAttendanceData);
  const [teacherSalaryData, setTeacherSalaryData] = useState(initialTeacherSalaryData);
  const [teacherResources, setTeacherResources] = useState(initialTeacherResources);

  // States for Admin Panel
  const [usersDirectory, setUsersDirectory] = useState(initialUsersDirectory);

  // Auto-fill mock credentials on login screen
  const mockCredentials = {
    email: 'student@englishzone.com',
    password: 'password123'
  };

  const mockTeacherCredentials = {
    email: 'teacher@englishzone.com',
    password: 'password123'
  };

  const mockAdminCredentials = {
    email: 'admin@englishzone.com',
    password: 'password123'
  };

  const loginUser = (emailOrPhone, passwordOrOtp) => {
    const cleanEmail = emailOrPhone.trim().toLowerCase();
    
    // Check Admin First
    if (cleanEmail === mockAdminCredentials.email || emailOrPhone.trim() === '9876543212') {
      const loggedIn = { ...mockAdmin };
      setUser(loggedIn);
      localStorage.setItem('ez_user', JSON.stringify(loggedIn));
      return { success: true };
    }
    
    // Check Teacher
    if (cleanEmail === mockTeacherCredentials.email || emailOrPhone.trim() === '9876543211') {
      const loggedIn = { ...mockTeacher };
      setUser(loggedIn);
      localStorage.setItem('ez_user', JSON.stringify(loggedIn));
      return { success: true };
    }
    
    // Check Student
    if (cleanEmail === mockCredentials.email || emailOrPhone.trim() === '9876543210') {
      const loggedIn = { ...mockStudent };
      setUser(loggedIn);
      localStorage.setItem('ez_user', JSON.stringify(loggedIn));
      return { success: true };
    } else if (signupForm && (cleanEmail === signupForm.email.toLowerCase() || emailOrPhone === signupForm.phone)) {
      const loggedIn = {
        name: signupForm.fullName,
        rollNo: 'EZ2026' + Math.floor(100 + Math.random() * 900),
        grade: 'Grade 10-A',
        email: signupForm.email,
        phone: signupForm.phone,
        dob: signupForm.dob,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        attendance: 100.0,
        role: 'student'
      };
      setUser(loggedIn);
      localStorage.setItem('ez_user', JSON.stringify(loggedIn));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Please use demo credentials for student, teacher, or admin.' };
  };

  const signupUser = (formData) => {
    setSignupForm(formData);
    return true;
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('ez_user');
  };

  const registerDemoClass = (demoData) => {
    const newDemo = {
      id: Date.now(),
      ...demoData,
      registeredAt: new Date().toISOString()
    };
    setActiveDemos(prev => [newDemo, ...prev]);
    return true;
  };

  const addInvoice = (description, amount, transportFee, status = 'Pending') => {
    const date = new Date();
    const dueDate = new Date();
    dueDate.setDate(date.getDate() + 15);
    
    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const newInvoice = {
      id: 'INV-2026-' + String(invoices.length + 1).padStart(3, '0'),
      description,
      type: transportFee > 0 ? 'Tuition + Transport' : 'Administrative',
      amount: parseFloat(amount),
      transportFee: parseFloat(transportFee),
      date: formatDate(date),
      dueDate: formatDate(dueDate),
      status
    };

    setInvoices(prev => [newInvoice, ...prev]);
  };

  const updateInvoiceStatus = (id, newStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
  };

  // Teacher actions
  const submitClassAttendance = (submittedRoster) => {
    setClassRoster(submittedRoster);
    return true;
  };

  const updateStudentGrade = (subject, exam, rollNo, grade) => {
    setGradebook(prev => {
      const newGradebook = { ...prev };
      if (!newGradebook[subject]) newGradebook[subject] = {};
      if (!newGradebook[subject][exam]) newGradebook[subject][exam] = {};
      newGradebook[subject][exam][rollNo] = Number(grade);
      return newGradebook;
    });
  };

  const uploadTeacherResource = (resource) => {
    const newResource = {
      id: Date.now(),
      uploadedAt: new Date().toISOString().split('T')[0],
      ...resource
    };
    setTeacherResources(prev => [newResource, ...prev]);
  };

  // Admin actions
  const addUserProfile = (newProfile) => {
    setUsersDirectory(prev => [
      ...prev,
      {
        id: Date.now(),
        status: 'Active',
        ...newProfile
      }
    ]);
  };

  const toggleUserStatus = (id) => {
    setUsersDirectory(prev => prev.map(u => 
      u.id === id 
        ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } 
        : u
    ));
  };

  const generateInvoice = (tier, baseAmount, transportFee, dueDate, description) => {
    const date = new Date().toISOString().split('T')[0];
    const newInvoice = {
      id: 'INV-2026-' + String(invoices.length + 1).padStart(3, '0'),
      description,
      type: transportFee > 0 ? 'Tuition + Transport' : 'Administrative',
      amount: parseFloat(baseAmount),
      transportFee: parseFloat(transportFee),
      date,
      dueDate,
      status: 'Pending',
      tier
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      user,
      signupForm,
      invoices,
      selectedDay,
      setSelectedDay,
      lectures: initialLectures,
      ncertResources: initialNcertResources,
      teachers: initialTeachers,
      examResults: initialExamResults,
      examSchedule: initialExamSchedule,
      admitCards: initialAdmitCards,
      weekdaySchedules,
      activeDemos,
      mockCredentials,
      mockTeacherCredentials,
      mockAdminCredentials,
      loginUser,
      signupUser,
      logoutUser,
      registerDemoClass,
      addInvoice,
      updateInvoiceStatus,
      
      // Teacher states and actions
      classRoster,
      gradebook,
      teacherAttendance,
      teacherSalaryData,
      teacherResources,
      teacherSchedules,
      submitClassAttendance,
      updateStudentGrade,
      uploadTeacherResource,

      // Admin states and actions
      usersDirectory,
      addUserProfile,
      toggleUserStatus,
      generateInvoice
    }}>
      {children}
    </AppContext.Provider>
  );
};
