"use strict";
import { curriculum } from "./Curricula.js";
import { rooms } from "./Rooms.js";
import { constructGroupingsbyDepartment,geneticAlgorithm,getAllSubjects,assignProfessorToSubjects,subjectSessionPrep } from "./GA.js";
import { professors } from "./Professors.js";
export const userDepartment = "CCS";

const approvedSchedArr = []; //Fetch an array of approved Schedule

const department = [
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

const config = 
    {semester: 1,                           //configuration for the semester
    enableProfessorReassignment: true,      //configuration if the algorithm is allowed to change professors for each subject
    enableVariedProfessors: false,           //configuration if the algorithm is allowed to assign different professors for different sections but for the same subject
    populationSize: 500,                      //configuration for the population size.POPULATION SIZE MUST BE PERFECTLY DIVISIBLE BY 4.Recommended popsize is 500 for performance
    maxGenerations: 100,                      //configuration for the minimum number of generations
    mutationProbability:0.05,                //configuration for the mutation probability. recommended value is 0.05;
    sessionImplementation: "hybrid",         //configuration whether the schedule is purely f2f, purely online, or hybrid
    nstpTargetDay: "saturday",              //NSTP Target Day
    nstpTargetStartTime: 7                  //NSTP Target Time
}

const allSubjects = getAllSubjects(department,config);
let subjWithProfArray = assignProfessorToSubjects(professors,allSubjects);
let prepdSubjects = subjectSessionPrep(subjWithProfArray,config);
let chosenSched = geneticAlgorithm(rooms,department,prepdSubjects,approvedSchedArr,professors,config);

//TO-DO
//refine Mutation function - reroll Professor
//Create a contingency function that will try to resolve the remaining recessive classes
//using a greedy algorithm as a last resort: Best fit Algorithm

console.log(constructGroupingsbyDepartment(department,chosenSched,config));

//Fitness ruleset in the fitness function needs constant and thorough refining.

