/**
 * ParentTeacher Connect Portal - Data Layer
 * Task: Comprehensive Indian School Demo Dataset & LocalStorage Persistence
 * Theme: Pink #EC4899, Light Pink #FCE7F3, White #FFFFFF
 */

const STORAGE_KEY = 'parent_teacher_connect_data';
const CURRENT_USER_KEY = 'ptc_current_user';
const THEME_KEY = 'ptc_theme_preference';

// Initial Demo Seed Data
const INITIAL_DATA = {
  users: [
    { id: 'USR-001', name: 'Dr. Rameshwar Rao', email: 'admin@school.edu', password: 'admin123', role: 'admin' },
    { id: 'USR-002', name: 'Suresh Iyer', email: 'suresh@school.edu', password: 'teacher123', role: 'teacher', teacher_id: 'TCH-001' },
    { id: 'USR-003', name: 'Meenakshi Sundaram', email: 'meenakshi@school.edu', password: 'teacher123', role: 'teacher', teacher_id: 'TCH-002' },
    { id: 'USR-004', name: 'Arvind Sen', email: 'arvind.sen@school.edu', password: 'teacher123', role: 'teacher', teacher_id: 'TCH-003' },
    { id: 'USR-005', name: 'Kavita Deshmukh', email: 'kavita.d@school.edu', password: 'teacher123', role: 'teacher', teacher_id: 'TCH-004' },
    { id: 'USR-006', name: 'Priya Sharma', email: 'priya@email.com', password: 'parent123', role: 'parent', parent_id: 'PRN-001' },
    { id: 'USR-007', name: 'Rajesh Patel', email: 'rajesh.patel@gmail.com', password: 'parent123', role: 'parent', parent_id: 'PRN-002' },
    { id: 'USR-008', name: 'Sunita Verma', email: 'sunita.v@yahoo.co.in', password: 'parent123', role: 'parent', parent_id: 'PRN-003' },
    { id: 'USR-009', name: 'Vikram Malhotra', email: 'vikram.malhotra@outlook.com', password: 'parent123', role: 'parent', parent_id: 'PRN-004' },
    { id: 'USR-010', name: 'Ananya Nair', email: 'ananya.nair@rediffmail.com', password: 'parent123', role: 'parent', parent_id: 'PRN-005' }
  ],

  parents: [
    {
      id: 'PRN-001',
      name: 'Priya Sharma',
      email: 'priya@email.com',
      phone: '+91 98201 44521',
      children: ['STU-001', 'STU-002'],
      address: 'Flat 402, Green Glen Heights, HSR Layout, Bengaluru'
    },
    {
      id: 'PRN-002',
      name: 'Rajesh Patel',
      email: 'rajesh.patel@gmail.com',
      phone: '+91 98112 33490',
      children: ['STU-003'],
      address: 'B-12, Shanti Niketan, Andheri East, Mumbai'
    },
    {
      id: 'PRN-003',
      name: 'Sunita Verma',
      email: 'sunita.v@yahoo.co.in',
      phone: '+91 97188 77654',
      children: ['STU-004'],
      address: 'House 54, Sector 15, Noida, Uttar Pradesh'
    },
    {
      id: 'PRN-004',
      name: 'Vikram Malhotra',
      email: 'vikram.malhotra@outlook.com',
      phone: '+91 99203 11899',
      children: ['STU-005', 'STU-006'],
      address: '703 Tower B, DLF Phase 5, Gurugram, Haryana'
    },
    {
      id: 'PRN-005',
      name: 'Ananya Nair',
      email: 'ananya.nair@rediffmail.com',
      phone: '+91 98451 99230',
      children: ['STU-007', 'STU-008'],
      address: 'Plot 22, Jawahar Nagar, Kadavanthra, Kochi, Kerala'
    }
  ],

  teachers: [
    {
      id: 'TCH-001',
      name: 'Suresh Iyer',
      subject: 'Mathematics',
      class_assigned: 'Class 8-A',
      email: 'suresh@school.edu',
      phone: '+91 98765 12340',
      availability: 'Mon-Fri: 2:30 PM - 4:00 PM'
    },
    {
      id: 'TCH-002',
      name: 'Meenakshi Sundaram',
      subject: 'Science',
      class_assigned: 'Class 8-B',
      email: 'meenakshi@school.edu',
      phone: '+91 98765 23451',
      availability: 'Tue, Thu, Fri: 3:00 PM - 4:30 PM'
    },
    {
      id: 'TCH-003',
      name: 'Arvind Sen',
      subject: 'English & Literature',
      class_assigned: 'Class 7-A',
      email: 'arvind.sen@school.edu',
      phone: '+91 98765 34562',
      availability: 'Mon, Wed: 2:00 PM - 3:30 PM'
    },
    {
      id: 'TCH-004',
      name: 'Kavita Deshmukh',
      subject: 'Social Studies & Civics',
      class_assigned: 'Class 9-A',
      email: 'kavita.d@school.edu',
      phone: '+91 98765 45673',
      availability: 'Mon-Thu: 1:30 PM - 3:00 PM'
    }
  ],

  students: [
    { id: 'STU-001', name: 'Aarav Sharma', class: '8', section: 'A', roll_no: '14', parent_id: 'PRN-001', teacher_id: 'TCH-001', dob: '2012-05-14', blood_group: 'O+' },
    { id: 'STU-002', name: 'Diya Sharma', class: '5', section: 'B', roll_no: '08', parent_id: 'PRN-001', teacher_id: 'TCH-003', dob: '2015-08-22', blood_group: 'O+' },
    { id: 'STU-003', name: 'Rohan Patel', class: '8', section: 'A', roll_no: '21', parent_id: 'PRN-002', teacher_id: 'TCH-001', dob: '2012-03-11', blood_group: 'B+' },
    { id: 'STU-004', name: 'Ananya Verma', class: '8', section: 'B', roll_no: '04', parent_id: 'PRN-003', teacher_id: 'TCH-002', dob: '2012-11-05', blood_group: 'A+' },
    { id: 'STU-005', name: 'Kabir Malhotra', class: '9', section: 'A', roll_no: '18', parent_id: 'PRN-004', teacher_id: 'TCH-004', dob: '2011-07-19', blood_group: 'AB+' },
    { id: 'STU-006', name: 'Simran Malhotra', class: '7', section: 'A', roll_no: '27', parent_id: 'PRN-004', teacher_id: 'TCH-003', dob: '2013-09-30', blood_group: 'B+' },
    { id: 'STU-007', name: 'Aditya Nair', class: '8', section: 'A', roll_no: '02', parent_id: 'PRN-005', teacher_id: 'TCH-001', dob: '2012-01-25', blood_group: 'A-' },
    { id: 'STU-008', name: 'Meera Nair', class: '6', section: 'C', roll_no: '19', parent_id: 'PRN-005', teacher_id: 'TCH-002', dob: '2014-12-10', blood_group: 'O-' }
  ],

  messages: [
    {
      id: 'MSG-001',
      sender_id: 'PRN-001',
      receiver_id: 'TCH-001',
      subject: 'Inquiry regarding Aarav’s Math Olympiad preparation',
      body: 'Dear Mr. Suresh, Aarav has shown keen interest in participating in the upcoming Inter-School Math Olympiad. Could you recommend any practice material or school sessions?',
      timestamp: '2026-11-10 10:15 AM',
      status: 'read'
    },
    {
      id: 'MSG-002',
      sender_id: 'TCH-001',
      receiver_id: 'PRN-001',
      subject: 'Re: Inquiry regarding Aarav’s Math Olympiad preparation',
      body: 'Hello Mrs. Sharma, Aarav has an exceptional grasp on Geometry and Algebra. I will share sample problem sheets this Thursday and we have special morning doubt-clearing sessions.',
      timestamp: '2026-11-10 02:30 PM',
      status: 'unread'
    },
    {
      id: 'MSG-003',
      sender_id: 'PRN-002',
      receiver_id: 'TCH-001',
      subject: 'Leave application for Rohan Patel (Medical)',
      body: 'Dear Sir, Rohan is suffering from mild viral fever and doctor has advised 2 days of bed rest. Please excuse his absence on Nov 11 and 12.',
      timestamp: '2026-11-09 08:00 AM',
      status: 'read'
    },
    {
      id: 'MSG-004',
      sender_id: 'TCH-001',
      receiver_id: 'PRN-002',
      subject: 'Re: Leave application for Rohan Patel (Medical)',
      body: 'Noted with thanks Mr. Patel. Wishing Rohan a speedy recovery. We will ensure he gets the class notes when he returns.',
      timestamp: '2026-11-09 09:45 AM',
      status: 'read'
    },
    {
      id: 'MSG-005',
      sender_id: 'PRN-003',
      receiver_id: 'TCH-002',
      subject: 'Clarification on Science Project guidelines',
      body: 'Respected Meenakshi Ma’am, Ananya is preparing the model for the Solar Energy exhibit. Are working circuits allowed or should it be a static diagram?',
      timestamp: '2026-11-08 04:20 PM',
      status: 'read'
    },
    {
      id: 'MSG-006',
      sender_id: 'TCH-002',
      receiver_id: 'PRN-003',
      subject: 'Re: Clarification on Science Project guidelines',
      body: 'Dear Sunita ji, Working models are strongly encouraged and receive bonus marks in the innovation category. Please ensure low voltage safety.',
      timestamp: '2026-11-08 06:15 PM',
      status: 'read'
    },
    {
      id: 'MSG-007',
      sender_id: 'PRN-004',
      receiver_id: 'TCH-004',
      subject: 'Kabir’s History debate contest participation',
      body: 'Hello Kavita Ma’am, Kabir was selected for the regional debate team. Will special buses be provided after practice hours?',
      timestamp: '2026-11-07 11:30 AM',
      status: 'read'
    },
    {
      id: 'MSG-008',
      sender_id: 'TCH-004',
      receiver_id: 'PRN-004',
      subject: 'Re: Kabir’s History debate contest participation',
      body: 'Dear Mr. Malhotra, Yes, senior debate students will have an evening shuttle dropping at designated junction points at 5:30 PM.',
      timestamp: '2026-11-07 01:10 PM',
      status: 'read'
    },
    {
      id: 'MSG-009',
      sender_id: 'PRN-005',
      receiver_id: 'TCH-001',
      subject: 'Feedback on Aditya’s quarterly progress',
      body: 'Respected Sir, We noticed Aditya improved his algebra scores. Thank you for your patient guidance during remedial classes.',
      timestamp: '2026-11-06 09:20 AM',
      status: 'read'
    },
    {
      id: 'MSG-010',
      sender_id: 'TCH-003',
      receiver_id: 'PRN-001',
      subject: 'Diya’s Poetry Recitation Winner',
      body: 'Dear Mrs. Sharma, Proud to share that Diya secured 1st prize in the Inter-Class Hindi Poetry Recitation competition today! Certificate will follow.',
      timestamp: '2026-11-05 03:00 PM',
      status: 'read'
    },
    {
      id: 'MSG-011',
      sender_id: 'USR-001',
      receiver_id: 'PRN-001',
      subject: 'Welcome to Term 2 Academic Portal',
      body: 'Welcome to ParentTeacher Connect. You can now monitor grades, fees, attendance and interact with faculty directly from your dashboard.',
      timestamp: '2026-11-01 10:00 AM',
      status: 'read'
    }
  ],

  academic: [
    { id: 'ACD-001', student_id: 'STU-001', subject: 'Mathematics', marks: 94, max_marks: 100, grade: 'A1', comments: 'Excellent problem solving skills; consistent high performer in algebra.' },
    { id: 'ACD-002', student_id: 'STU-001', subject: 'Science', marks: 88, max_marks: 100, grade: 'A2', comments: 'Shows keen curiosity in physics experiments and lab work.' },
    { id: 'ACD-003', student_id: 'STU-001', subject: 'English', marks: 85, max_marks: 100, grade: 'A2', comments: 'Good comprehension; encourage reading more non-fiction classics.' },
    { id: 'ACD-004', student_id: 'STU-001', subject: 'Social Studies', marks: 91, max_marks: 100, grade: 'A1', comments: 'Very detailed map work and thorough grasp of Indian constitution.' },
    { id: 'ACD-005', student_id: 'STU-001', subject: 'Computer Science', marks: 96, max_marks: 100, grade: 'A1', comments: 'Brilliant logic in Python programming and web fundamentals.' },
    
    { id: 'ACD-006', student_id: 'STU-002', subject: 'Mathematics', marks: 82, max_marks: 100, grade: 'B1', comments: 'Improving steadily in word problems; practice fractions daily.' },
    { id: 'ACD-007', student_id: 'STU-002', subject: 'Environmental Studies', marks: 90, max_marks: 100, grade: 'A1', comments: 'Active participation in green club and nature journals.' },
    { id: 'ACD-008', student_id: 'STU-002', subject: 'English', marks: 93, max_marks: 100, grade: 'A1', comments: 'Wonderful creative writing flair and rich vocabulary.' },

    { id: 'ACD-009', student_id: 'STU-003', subject: 'Mathematics', marks: 78, max_marks: 100, grade: 'B2', comments: 'Understands concepts well but needs more speed in timed tests.' },
    { id: 'ACD-010', student_id: 'STU-003', subject: 'Science', marks: 84, max_marks: 100, grade: 'A2', comments: 'Very active in practical lab demonstrations.' },
    { id: 'ACD-011', student_id: 'STU-004', subject: 'Mathematics', marks: 89, max_marks: 100, grade: 'A2', comments: 'Conscientious student; neat presentation in test answer scripts.' },
    { id: 'ACD-012', student_id: 'STU-004', subject: 'Science', marks: 95, max_marks: 100, grade: 'A1', comments: 'Top scorer in Biology unit; exceptional project on human anatomy.' },
    { id: 'ACD-013', student_id: 'STU-005', subject: 'Social Studies', marks: 92, max_marks: 100, grade: 'A1', comments: 'Outstanding critical thinking in modern world history seminars.' },
    { id: 'ACD-014', student_id: 'STU-006', subject: 'English', marks: 87, max_marks: 100, grade: 'A2', comments: 'Great pronunciation in elocution; good grammar foundation.' },
    { id: 'ACD-015', student_id: 'STU-007', subject: 'Mathematics', marks: 91, max_marks: 100, grade: 'A1', comments: 'Quick mental math calculations; very active in peer study groups.' },
    { id: 'ACD-016', student_id: 'STU-008', subject: 'Science', marks: 86, max_marks: 100, grade: 'A2', comments: 'Regular with homework submissions and lab record maintenance.' }
  ],

  attendance: [
    { id: 'ATT-001', student_id: 'STU-001', date: '2026-11-03', status: 'Present' },
    { id: 'ATT-002', student_id: 'STU-001', date: '2026-11-04', status: 'Present' },
    { id: 'ATT-003', student_id: 'STU-001', date: '2026-11-05', status: 'Present' },
    { id: 'ATT-004', student_id: 'STU-001', date: '2026-11-06', status: 'Present' },
    { id: 'ATT-005', student_id: 'STU-001', date: '2026-11-07', status: 'Present' },
    { id: 'ATT-006', student_id: 'STU-001', date: '2026-11-10', status: 'Present' },
    { id: 'ATT-007', student_id: 'STU-001', date: '2026-11-11', status: 'Late' },
    { id: 'ATT-008', student_id: 'STU-001', date: '2026-11-12', status: 'Present' },
    { id: 'ATT-009', student_id: 'STU-001', date: '2026-11-13', status: 'Present' },

    { id: 'ATT-010', student_id: 'STU-002', date: '2026-11-09', status: 'Present' },
    { id: 'ATT-011', student_id: 'STU-002', date: '2026-11-10', status: 'Present' },
    { id: 'ATT-012', student_id: 'STU-002', date: '2026-11-11', status: 'Absent' },
    { id: 'ATT-013', student_id: 'STU-002', date: '2026-11-12', status: 'Present' },

    { id: 'ATT-014', student_id: 'STU-003', date: '2026-11-10', status: 'Present' },
    { id: 'ATT-015', student_id: 'STU-003', date: '2026-11-11', status: 'Absent' },
    { id: 'ATT-016', student_id: 'STU-003', date: '2026-11-12', status: 'Absent' },
    { id: 'ATT-017', student_id: 'STU-003', date: '2026-11-13', status: 'Present' },

    { id: 'ATT-018', student_id: 'STU-004', date: '2026-11-10', status: 'Present' },
    { id: 'ATT-019', student_id: 'STU-004', date: '2026-11-11', status: 'Present' },
    { id: 'ATT-020', student_id: 'STU-004', date: '2026-11-12', status: 'Present' },

    { id: 'ATT-021', student_id: 'STU-005', date: '2026-11-10', status: 'Present' },
    { id: 'ATT-022', student_id: 'STU-005', date: '2026-11-11', status: 'Present' },
    { id: 'ATT-023', student_id: 'STU-007', date: '2026-11-10', status: 'Late' },
    { id: 'ATT-024', student_id: 'STU-007', date: '2026-11-11', status: 'Present' },
    { id: 'ATT-025', student_id: 'STU-008', date: '2026-11-12', status: 'Present' }
  ],

  fees: [
    { id: 'FEE-001', student_id: 'STU-001', fee_type: 'Term 1 Tuition Fee', amount: 28500, due_date: '2026-08-15', paid_date: '2026-08-10', status: 'Paid', receipt_no: 'RCP-2026-8812' },
    { id: 'FEE-002', student_id: 'STU-001', fee_type: 'Annual Lab & Activity Fee', amount: 6200, due_date: '2026-09-01', paid_date: '2026-08-28', status: 'Paid', receipt_no: 'RCP-2026-8945' },
    { id: 'FEE-003', student_id: 'STU-001', fee_type: 'Term 2 Tuition Fee', amount: 28500, due_date: '2026-11-30', paid_date: null, status: 'Pending', receipt_no: null },
    { id: 'FEE-004', student_id: 'STU-001', fee_type: 'Quarterly Transport Fee (Q3)', amount: 8400, due_date: '2026-10-31', paid_date: null, status: 'Overdue', receipt_no: null },

    { id: 'FEE-005', student_id: 'STU-002', fee_type: 'Term 1 Tuition Fee', amount: 24000, due_date: '2026-08-15', paid_date: '2026-08-12', status: 'Paid', receipt_no: 'RCP-2026-7731' },
    { id: 'FEE-006', student_id: 'STU-002', fee_type: 'Term 2 Tuition Fee', amount: 24000, due_date: '2026-11-30', paid_date: null, status: 'Pending', receipt_no: null },

    { id: 'FEE-007', student_id: 'STU-003', fee_type: 'Term 1 Tuition Fee', amount: 28500, due_date: '2026-08-15', paid_date: '2026-08-14', status: 'Paid', receipt_no: 'RCP-2026-6621' },
    { id: 'FEE-008', student_id: 'STU-003', fee_type: 'Term 2 Tuition Fee', amount: 28500, due_date: '2026-11-30', paid_date: null, status: 'Pending', receipt_no: null },

    { id: 'FEE-009', student_id: 'STU-004', fee_type: 'Term 1 Tuition Fee', amount: 28500, due_date: '2026-08-15', paid_date: '2026-08-09', status: 'Paid', receipt_no: 'RCP-2026-5591' },
    { id: 'FEE-010', student_id: 'STU-005', fee_type: 'Term 1 Tuition Fee', amount: 31000, due_date: '2026-08-15', paid_date: '2026-08-11', status: 'Paid', receipt_no: 'RCP-2026-4410' },
    { id: 'FEE-011', student_id: 'STU-006', fee_type: 'Term 2 Tuition Fee', amount: 26000, due_date: '2026-11-15', paid_date: null, status: 'Overdue', receipt_no: null },
    { id: 'FEE-012', student_id: 'STU-007', fee_type: 'Term 1 Tuition Fee', amount: 28500, due_date: '2026-08-15', paid_date: '2026-08-15', status: 'Paid', receipt_no: 'RCP-2026-3398' }
  ],

  meetings: [
    {
      id: 'MTG-001',
      parent_id: 'PRN-001',
      teacher_id: 'TCH-001',
      date: '2026-11-18',
      time: '03:00 PM',
      agenda: 'Review Aarav’s Term 1 Math progress and competitive exam roadmap',
      status: 'Confirmed',
      meeting_link: 'https://meet.google.com/ptc-math-aarav'
    },
    {
      id: 'MTG-002',
      parent_id: 'PRN-001',
      teacher_id: 'TCH-003',
      date: '2026-11-20',
      time: '02:30 PM',
      agenda: 'Discuss Diya’s reading list for inter-school literature fest',
      status: 'Pending',
      meeting_link: null
    },
    {
      id: 'MTG-003',
      parent_id: 'PRN-002',
      teacher_id: 'TCH-001',
      date: '2026-11-19',
      time: '03:30 PM',
      agenda: 'Discuss Rohan’s missed lab sessions and make-up tests',
      status: 'Confirmed',
      meeting_link: 'https://meet.google.com/ptc-patel-math'
    },
    {
      id: 'MTG-004',
      parent_id: 'PRN-003',
      teacher_id: 'TCH-002',
      date: '2026-11-16',
      time: '04:00 PM',
      agenda: 'Science Fair project budget and special apparatus requirement',
      status: 'Confirmed',
      meeting_link: 'https://meet.google.com/ptc-sci-verma'
    },
    {
      id: 'MTG-005',
      parent_id: 'PRN-004',
      teacher_id: 'TCH-004',
      date: '2026-11-22',
      time: '02:00 PM',
      agenda: 'Kabir’s career counseling for Class 10 stream selection',
      status: 'Pending',
      meeting_link: null
    },
    {
      id: 'MTG-006',
      parent_id: 'PRN-005',
      teacher_id: 'TCH-001',
      date: '2026-11-14',
      time: '03:15 PM',
      agenda: 'Aditya’s punctuality and morning transit coordination',
      status: 'Cancelled',
      meeting_link: null
    }
  ],

  events: [
    {
      id: 'EVT-001',
      title: 'Annual Science & Robotics Exhibition 2026',
      description: 'Students from Classes 6 through 10 showcase innovative green-tech, AI, and robotics projects in the school auditorium.',
      date: '2026-11-28',
      time: '09:30 AM - 03:30 PM',
      location: 'Central School Auditorium',
      posted_by: 'Meenakshi Sundaram (Science Dept)'
    },
    {
      id: 'EVT-002',
      title: 'Parent-Teacher Interaction Meet (Term 1)',
      description: 'One-on-one formal academic conference to review answer scripts, holistic report cards, and co-curricular milestones.',
      date: '2026-12-05',
      time: '08:30 AM - 01:30 PM',
      location: 'Respective Homerooms (Block A & B)',
      posted_by: 'Dr. Rameshwar Rao (Principal)'
    },
    {
      id: 'EVT-003',
      title: 'Annual Athletic Sports Meet & Relay Championship',
      description: 'Track and field events, inter-house March Past, gymnastics display, and parents’ 100m friendly dash.',
      date: '2026-12-18',
      time: '08:00 AM - 04:00 PM',
      location: 'Main Sports Complex & Track',
      posted_by: 'Sports & Wellness Council'
    },
    {
      id: 'EVT-004',
      title: 'Inter-School Model United Nations (PTC-MUN)',
      description: 'Two-day international diplomacy simulation with delegates representing 45 nations on sustainable climate policies.',
      date: '2026-12-22',
      time: '09:00 AM - 05:00 PM',
      location: 'Conference Wing, 3rd Floor',
      posted_by: 'Kavita Deshmukh (MUN Advisor)'
    },
    {
      id: 'EVT-005',
      title: 'Grandparents’ Day & Cultural Heritage Showcase',
      description: 'Special theatrical dances, classical music choir by junior school students, and traditional Indian folk crafts display.',
      date: '2027-01-10',
      time: '10:00 AM - 01:00 PM',
      location: 'Open Air Amphitheatre',
      posted_by: 'Cultural Activities Committee'
    }
  ],

  announcements: [
    {
      id: 'ANN-001',
      title: 'Term 2 Mid-Term Examination Date Sheet Announced',
      description: 'The finalized schedule for Term 2 examinations starting Dec 10 has been published. Revision syllabus sheets are available for download.',
      date: '2026-11-12',
      posted_by: 'Examination Directorate',
      priority: 'High'
    },
    {
      id: 'ANN-002',
      title: 'Winter School Uniform Transition Effective Nov 20',
      description: 'All students are requested to transition to the formal winter blazer, woolen tie, and dark grey trousers/skirts starting Monday, Nov 20.',
      date: '2026-11-10',
      posted_by: 'Student Discipline Committee',
      priority: 'Medium'
    },
    {
      id: 'ANN-003',
      title: 'National Cyber Olympiad & Science Olympiad Registrations Open',
      description: 'Interested students from Classes 5 to 10 can submit registration forms and fees to their respective class teachers by Nov 25.',
      date: '2026-11-08',
      posted_by: 'Suresh Iyer (Academic Coordinator)',
      priority: 'Normal'
    },
    {
      id: 'ANN-004',
      title: 'School Bus Route 14 Diversion Notice (Civil Metro Work)',
      description: 'Due to ongoing metro construction near Silk Board Junction, Bus Route 14 will operate 15 minutes earlier in the morning for the next fortnight.',
      date: '2026-11-06',
      posted_by: 'Transport & Safety Dept',
      priority: 'High'
    },
    {
      id: 'ANN-005',
      title: 'Campus Health Advisory: Seasonal Flu & Mosquito Precautions',
      description: 'Routine fogging and campus sanitization have been completed. Parents are advised to apply child-safe mosquito repellent patches and send warm drinking water.',
      date: '2026-11-04',
      posted_by: 'Campus Medical Infirmary',
      priority: 'Normal'
    }
  ],

  // Bonus Datasets
  homework: [
    {
      id: 'HW-001',
      teacher_id: 'TCH-001',
      class: '8',
      section: 'A',
      subject: 'Mathematics',
      title: 'Linear Equations in One Variable - Exercise 3.2',
      description: 'Solve problems 1 through 15 in the homework notebook. Show complete step-by-step LHS/RHS balance checks.',
      due_date: '2026-11-16'
    },
    {
      id: 'HW-002',
      teacher_id: 'TCH-002',
      class: '8',
      section: 'A',
      subject: 'Science',
      title: 'Chemical Effects of Electric Current - Flowchart',
      description: 'Draw a neatly labeled schematic diagram illustrating electroplating of copper on an iron nail with chemical equations.',
      due_date: '2026-11-17'
    },
    {
      id: 'HW-003',
      teacher_id: 'TCH-003',
      class: '8',
      section: 'A',
      subject: 'English',
      title: 'Book Review: Ruskin Bond’s The Blue Umbrella',
      description: 'Write a 250-word book review highlighting character sketch of Binya and moral lessons learned.',
      due_date: '2026-11-18'
    },
    {
      id: 'HW-004',
      teacher_id: 'TCH-004',
      class: '9',
      section: 'A',
      subject: 'Social Studies',
      title: 'Fundamental Rights & Directive Principles Case Study',
      description: 'Prepare notes comparing Right to Equality vs Right to Constitutional Remedies with recent Supreme Court benchmarks.',
      due_date: '2026-11-19'
    }
  ],

  behavior: [
    {
      id: 'BEH-001',
      student_id: 'STU-001',
      teacher_id: 'TCH-001',
      date: '2026-11-11',
      type: 'positive',
      badge: 'Helpful Peer',
      note: 'Aarav voluntarily stayed back after class to assist three classmates with complex quadratic equation problems.'
    },
    {
      id: 'BEH-002',
      student_id: 'STU-001',
      teacher_id: 'TCH-002',
      date: '2026-11-05',
      type: 'positive',
      badge: 'Lab Safety Star',
      note: 'Maintained spotless adherence to laboratory safety protocols during chemical testing demonstration.'
    },
    {
      id: 'BEH-003',
      student_id: 'STU-003',
      teacher_id: 'TCH-001',
      date: '2026-11-04',
      type: 'concern',
      badge: 'Inattention',
      note: 'Rohan seemed distracted during geometry theorem proofs today. Kindly ensure adequate rest at home.'
    },
    {
      id: 'BEH-004',
      student_id: 'STU-004',
      teacher_id: 'TCH-002',
      date: '2026-11-09',
      type: 'positive',
      badge: 'Eco Warrior',
      note: 'Spearheaded zero-waste lunchbox initiative in Class 8-B with exemplary leadership.'
    }
  ],

  gallery: [
    {
      id: 'GAL-001',
      title: 'Inter-House Robotics Showcase',
      category: 'STEM',
      date: '2026-11-02',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      caption: 'Grade 8 students demonstrating automated rover prototypes.'
    },
    {
      id: 'GAL-002',
      title: 'Annual Classical Dance Recital',
      category: 'Arts',
      date: '2026-10-24',
      url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
      caption: 'Bharatnatyam performance during Diwali Cultural Evening.'
    },
    {
      id: 'GAL-003',
      title: 'Inter-School Basketball Champions',
      category: 'Sports',
      date: '2026-10-18',
      url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
      caption: 'Under-14 boys team lifting the Zonal District Trophy.'
    },
    {
      id: 'GAL-004',
      title: 'Green Campus Tree Plantation Drive',
      category: 'Community',
      date: '2026-09-30',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      caption: 'Parents and teachers planting 150 neem and gulmohar saplings.'
    }
  ]
};

// ==========================================
// Helper Functions & LocalStorage Management
// ==========================================

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse localStorage data, resetting to seed defaults.', e);
    saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data to localStorage:', e);
  }
}

function resetDemoData() {
  saveData(INITIAL_DATA);
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function generateId(prefix = 'ID') {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomPart}`;
}

function getThemePreference() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function setThemePreference(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function getStudentById(studentId) {
  const data = loadData();
  return data.students.find(s => s.id === studentId) || null;
}

function getParentById(parentId) {
  const data = loadData();
  return data.parents.find(p => p.id === parentId) || null;
}

function getTeacherById(teacherId) {
  const data = loadData();
  return data.teachers.find(t => t.id === teacherId) || null;
}

function getUserById(userId) {
  const data = loadData();
  return data.users.find(u => u.id === userId) || null;
}

// Global attachments
window.loadData = loadData;
window.saveData = saveData;
window.resetDemoData = resetDemoData;
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.clearCurrentUser = clearCurrentUser;
window.generateId = generateId;
window.getThemePreference = getThemePreference;
window.setThemePreference = setThemePreference;
window.getStudentById = getStudentById;
window.getParentById = getParentById;
window.getTeacherById = getTeacherById;
window.getUserById = getUserById;
window.INITIAL_DATA = INITIAL_DATA;

