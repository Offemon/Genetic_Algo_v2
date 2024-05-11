import { curriculum } from "./Curricula.js";

export const department = [
    {courseName: "BSCS",
    levels:[
        {level: "1st_year",sections:["BSCS 11M1"], assignedCurriculum:curriculum[0]},
        {level: "2nd_year",sections:["BSCS 21M1"], assignedCurriculum:curriculum[0]},
        {level: "3rd_year",sections:["BSCS 31A1"], assignedCurriculum:curriculum[0]},
        {level: "4th_year",sections:["BSCS 41E1"], assignedCurriculum:curriculum[0]},
        ]
    },
    {courseName: "BSIT",
    levels:[
        {level: "1st_year",sections:["BSIT 11M1","BSIT 11A1"], assignedCurriculum:curriculum[1]},
        {level: "2nd_year",sections:["BSIT 21M1","BSIT 21A1"], assignedCurriculum:curriculum[1]},
        {level: "3rd_year",sections:["BSIT 31A1","BSIT 31M1"], assignedCurriculum:curriculum[1]},
        {level: "4th_year",sections:["BSIT 41E1"], assignedCurriculum:curriculum[1]},
        ]
    }
]