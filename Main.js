"use strict";
import { rooms } from "./Rooms.js";
import { constructGroupingsbyDepartment,
        geneticAlgorithm,
        getAllSubjects,
        assignProfessorToSubjects,
        subjectSessionPrep } from "./GA.js";
import { professors } from "./Professors.js";
import { department } from "./Department.js";
import { config } from "./config.js";
import { approvedSchedArr } from "./ApprovedSched.js";

export const userDepartment = "CCS";

const allSubjects = getAllSubjects(department,config);
let subjWithProfArray = assignProfessorToSubjects(professors,allSubjects);
let prepdSubjects = subjectSessionPrep(subjWithProfArray,config);
let chosenSched = geneticAlgorithm(rooms,department,prepdSubjects,approvedSchedArr,professors,config);

//TO-DO
//refine Mutation function - reroll Professor - Resolved
//Create a contingency function that will try to resolve the remaining recessive classes
//using a greedy algorithm as a last resort: Best fit Algorithm

console.log(constructGroupingsbyDepartment(department,chosenSched,config));

//Fitness ruleset in the fitness function needs constant and thorough refining.

