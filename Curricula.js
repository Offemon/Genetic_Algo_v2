const curriculum = [
    {curriculumID:"LOA-CCS-BSCS-2324-01",
    schoolYear: "2023-2024",
    department:"ccs",
    course: "BSCS",
    contents: [
            {level:"1st_year",
            firstSem:[
                {subjCode:"GEC103",subjName:"Understanding the Self", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"GEC102",subjName:"Mathematics in the Modern World", duration: 3, classType: "lec", expertiseReq:"Mathematics"},
                {subjCode:"CC113-1",subjName:"Introduction to Computing with Productivity Tools", duration: 3, classType: "comp_lab", expertiseReq:"Programming"},
                {subjCode:"CC113-2",subjName:"Fundamentals of Programming", duration: 3, classType: "comp_lab", expertiseReq:"Programming"},
                {subjCode:"VDG113",subjName:"Visual Design Graphics", duration: 3, classType: "comp_lab", expertiseReq:"Multimedia"},
                {subjCode:"BP113",subjName:"Basic Photography", duration: 3, classType: "lec", expertiseReq:"Photography"},
                {subjCode:"PE101",subjName:"Physical Fitness 1", duration: 3, classType: "gym", expertiseReq:"Physical Education"},
                {subjCode:"NSTP1",subjName:"National Service Training Program 1", duration: 3, classType: "out", expertiseReq:"General Education"}
            ],
            secondSem:[
                {subjCode:"GEC108",subjName:"Ethics", duration: 3, classType: "lec", expertiseReq:"Psychology"},
                {subjCode:"GEC104",subjName:"Readings in the Philippine History", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"DS123",subjName:"Discrete Structures 1", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"CC123",subjName:"Intermediate Programming", duration: 3, classType: "comp_lab", expertiseReq:"Programming"},
                {subjCode:"DA123",subjName:"Digital Animation", duration: 3, classType: "comp_lab", expertiseReq:"Animation"},
                {subjCode:"HCH123",subjName:"Human Computer Interaction", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"PE102",subjName:"Physical Fitness 2", duration: 3, classType: "gym", expertiseReq:"Physical Education"},
                {subjCode:"NSTP2",subjName:"National Service Training Program 1", duration: 3, classType: "out", expertiseReq:"General Education"}
            ]
            },
            {level:"2nd_year",
            firstSem:[
                {subjCode:"GEC107",subjName:"Art Appreciation", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"GEC101",subjName:"Purposive Communication", duration: 3, classType: "comp_lab", expertiseReq:"General Education"},
                {subjCode:"DS213",subjName:"Discrete Structures 2", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"SDF213",subjName:"Object-Oriented Programming", duration: 3, classType: "comp_lab", expertiseReq:"Programming"},
                {subjCode:"CC213",subjName:"Data Structures & Algorithms", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"GAD213",subjName:"2D Game Art Development", duration: 3, classType: "comp_lab", expertiseReq:"Game Development"},
                {subjCode:"MAT103",subjName:"Calculus", duration: 3, classType: "lec", expertiseReq:"Mathematics"},
                {subjCode:"PE103",subjName:"Physical Fitness 3", duration: 3, classType: "gym", expertiseReq:"Physical Education"}

            ],
            secondSem:[
                {subjCode:"GEC105",subjName:"Science, Technology, and Society", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"GEC106",subjName:"The Contemporary World", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"CC223",subjName:"Information Management", duration: 3, classType: "comp_lab", expertiseReq:"Database"},
                {subjCode:"AL223",subjName:"Algorithms and Complexity", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"WST213",subjName:"Web System and Technologoes", duration: 3, classType: "comp_lab", expertiseReq:"Web Development"},
                {subjCode:"CSS221",subjName:"Computer System Servicing", duration: 3, classType: "comp_lab", expertiseReq:"Hardware"},
                {subjCode:"GAD223",subjName:"3d Game Art Development", duration: 3, classType: "comp_lab", expertiseReq:"Game Development"},
                {subjCode:"PE104",subjName:"Physical Fitness 4", duration: 3, classType: "gym", expertiseReq:"Physical Education"}
            ]
            },
            {level:"3rd_year",
            firstSem:[
                {subjCode:"FIL101",subjName:"Kontekstwalizasong Komunikasyon sa Filipino", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"AL313",subjName:"Automata Theory and Formal Languages", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"AR313",subjName:"Architecture and Organization", duration: 3, classType: "comp_lab", expertiseReq:"Hardware"},
                {subjCode:"CC313",subjName:"Application Dev't and Emerging Technologies", duration: 3, classType: "comp_lab", expertiseReq:"Web Development"},
                {subjCode:"IAS313",subjName:"Information Assurance and Security", duration: 3, classType: "lec", expertiseReq:"Cybersecurity"},
                {subjCode:"ELEC313",subjName:"CS Elective 1", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"}
            ],
            secondSem:[
                {subjCode:"FIL103",subjName:"Panitikan", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"PL323",subjName:"Programming Languages", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"SE323",subjName:"Software Engineering 1", duration: 3, classType: "comp_lab", expertiseReq:"Software Engineering"},
                {subjCode:"SP323",subjName:"Social Issues and Professional Practice", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"IM323",subjName:"Database Management System", duration: 3, classType: "comp_lab", expertiseReq:"Database"},
                {subjCode:"ELEC323",subjName:"CS Elective 2", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"}
            ]
            },
            {level:"4th_year",
            firstSem:[
                {subjCode:"THS413",subjName:"Thesis 1", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"},
                {subjCode:"ELEC413",subjName:"CS Elective 3", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"},
                {subjCode:"DS413",subjName:"Principles of Operating Systems", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"LIT102",subjName:"The Entrpreneurial Mind", duration: 3, classType: "lec", expertiseReq:"General Education"}
            ],
            secondSem:[
                {subjCode:"THS423",subjName:"Thesis 2", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"},
                {subjCode:"GEC109",subjName:"Life and Works of Rizal", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"NC423",subjName:"Networks and Communications", duration: 3, classType: "lec", expertiseReq:"Networking"},
                {subjCode:"SAP423",subjName:"MIS with ERP (SAP B1)", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"}
            ]
            }
    ]},
    {curriculumID:"LOA-CCS-BSIT-2324-01",
    schoolYear: "2023-2024",
    department:"ccs",
    course: "BSIT",
    contents: [
            {level:"1st_year",
            firstSem:[
                {subjCode:"GEC103",subjName:"Understanding the Self", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"GEC102",subjName:"Mathematics in the Modern World", duration: 3, classType: "lec", expertiseReq:"Mathematics"},
                {subjCode:"CSS113",subjName:"Advanced PC Trouble Shooting", duration: 3, classType: "comp_lab", expertiseReq:"Hardware"},
                {subjCode:"CC113-1",subjName:"Introduction to Computing with Productivity Tools", duration: 3, classType: "comp_lab", expertiseReq:"Programming"},
                {subjCode:"CC113-2",subjName:"Computer Programming 1", duration: 3, classType: "comp_lab", expertiseReq:"Programming"},
                {subjCode:"BP113",subjName:"Basic Photography", duration: 3, classType: "lec", expertiseReq:"Photography"},
                {subjCode:"PE101",subjName:"Physical Fitness 1", duration: 3, classType: "gym", expertiseReq:"Physical Education"},
                {subjCode:"NSTP1",subjName:"National Service Training Program 1", duration: 3, classType: "out", expertiseReq:"General Education"}
            ],
            secondSem:[
                {subjCode:"GEC108",subjName:"Ethics", duration: 3, classType: "lec", expertiseReq:"Psychology"},
                {subjCode:"GEC104",subjName:"Readings in the Philippine History", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"CC123",subjName:"Computer Programming 2", duration: 3, classType: "comp_lab", expertiseReq:"Programming"},
                {subjCode:"DS123",subjName:"Discrete Mathematics", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"HC123",subjName:"Intro. to Human Computer Interaction", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"},
                {subjCode:"VDG113",subjName:"Visual Design Graphics", duration: 3, classType: "comp_lab", expertiseReq:"Multimedia"},
                {subjCode:"PE102",subjName:"Physical Fitness 2", duration: 3, classType: "gym", expertiseReq:"Physical Education"},
                {subjCode:"NSTP2",subjName:"National Service Training Program 1", duration: 3, classType: "out", expertiseReq:"General Education"}
            ]
            },
            {level:"2nd_year",
            firstSem:[
                {subjCode:"GEC107",subjName:"Art Appreciation", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"GEC101",subjName:"Purposive Communication", duration: 3, classType: "comp_lab", expertiseReq:"General Education"},
                {subjCode:"NET213",subjName:"Networking 1", duration: 3, classType: "comp_lab", expertiseReq:"Networking"},
                {subjCode:"CC213-1",subjName:"Data Structures & Algorithms", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"CC213-2",subjName:"Information Management 1", duration: 3, classType: "comp_lab", expertiseReq:"Database"},
                {subjCode:"GAD213",subjName:"2D and 3D Digital Enimation", duration: 3, classType: "comp_lab", expertiseReq:"Animation"},
                {subjCode:"PE103",subjName:"Physical Fitness 3", duration: 3, classType: "gym", expertiseReq:"Physical Education"}

            ],
            secondSem:[
                {subjCode:"GEC105",subjName:"Science, Technology, and Society", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"GEC106",subjName:"The Contemporary World", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"MC223",subjName:"Mobile Computing", duration: 3, classType: "comp_lab", expertiseReq:"Programming"},
                {subjCode:"NET223",subjName:"Networking 2", duration: 3, classType: "comp_lab", expertiseReq:"Networking"},
                {subjCode:"IM223",subjName:"Fundamentals of Database Systems", duration: 3, classType: "comp_lab", expertiseReq:"Database"},
                {subjCode:"ELEC223",subjName:"IT Elective 1", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"},
                {subjCode:"PE104",subjName:"Physical Fitness 4", duration: 3, classType: "gym", expertiseReq:"Physical Education"}
            ]
            },
            {level:"3rd_year",
            firstSem:[
                {subjCode:"FIL101",subjName:"Kontekstwalizasong Komunikasyon sa Filipino", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"SA313",subjName:"System Administration & Maintenance", duration: 3, classType: "comp_lab", expertiseReq:"Networking"},
                {subjCode:"SAD313",subjName:"Systems Analysis, Design and Development", duration: 3, classType: "comp_lab", expertiseReq:"Software Engineering"},
                {subjCode:"ELEC313",subjName:"IT Elective 2", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"},
                {subjCode:"CC313",subjName:"Application Dev't and Emerging Technologies", duration: 3, classType: "comp_lab", expertiseReq:"Web Development"},
                {subjCode:"IPT313",subjName:"Integrative Prog'g & Technologies 1", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"}
            ],
            secondSem:[
                {subjCode:"FIL103",subjName:"Panitikan", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"CAP323",subjName:"Capstone Project and Research 1", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"},
                {subjCode:"IAS323",subjName:"Information Assurance & Security 1", duration: 3, classType: "lec", expertiseReq:"Cybersecurity"},
                {subjCode:"SIA323",subjName:"Systems Integration & Architecture 1", duration: 3, classType: "comp_lab", expertiseReq:"Hardware"},
                {subjCode:"ELEC323",subjName:"IT Elective 3", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"},
                {subjCode:"MS313",subjName:"Quantitative Methods (Modeling & SImulation)", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"},
            ]
            },
            {level:"4th_year",
            firstSem:[
                {subjCode:"IAS413",subjName:"Information Assurance and Security 2", duration: 3, classType: "lec", expertiseReq:"Cybersecurity"},
                {subjCode:"SP413",subjName:"Social & Professional Issues", duration: 3, classType: "lec", expertiseReq:"General Education"},
                {subjCode:"Capstone Project and Research 2",subjName:"", duration: 3, classType: "lec", expertiseReq:"Computer Science"},
                {subjCode:"ELEC413",subjName:"IT Elective 4", duration: 3, classType: "comp_lab", expertiseReq:"Computer Science"},
                {subjCode:"LIT102",subjName:"Philippine Popular Culture", duration: 3, classType: "lec", expertiseReq:"General Education"},
            ],
            secondSem:[
                {subjCode:"ITPRAC",subjName:"Practicum (486 hours)", duration: 3, classType: "out", expertiseReq:"Computer Science", isPracticum:true},
                {subjCode:"SAP323",subjName:"MIS with ERP (SAP B1)", duration: 3, classType: "comp_lab", expertiseReq:"COmputer Science"},
                {subjCode:"GEC109",subjName:"Life and Works of Rizal", duration: 3, classType: "lec", expertiseReq:"General Education"},
            ]
            }
    ]},
]


//subject template
// {subjName:"", duration: 3, classType: "", expertiseReq:""},