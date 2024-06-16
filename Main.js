"use strict";
import { rooms } from "./Rooms.js";
import { constructGroupingsbyDepartment,
        geneticAlgorithm,
        getAllSubjects,
        assignProfessorToSubjects,
        subjectSessionPrep,
        } from "./GA.js";
import { professors } from "./Professors.js";
import { department } from "./Department.js";
import { config } from "./config.js";
import { approvedSchedArr } from "./ApprovedSched.js";

export const userDepartment = "CCS";
// console.time("Time Elapsed");
const allSubjects = getAllSubjects(department,config);
let subjWithProfArray = assignProfessorToSubjects(professors,allSubjects);
let prepdSubjects = subjectSessionPrep(subjWithProfArray,config);
let chosenSched = geneticAlgorithm(rooms,department,prepdSubjects,approvedSchedArr,professors,config);
console.log(chosenSched);
//TO-DO
//refine Mutation function - reroll Professor - Resolved
//Create a contingency function that will try to resolve the remaining recessive classes
//using a greedy algorithm as a last resort: Best fit Algorithm
//Fitness ruleset in the fitness function needs constant and thorough refining.

// console.log(chosenSched[0]);
// console.log(chosenSched[0].schedule.filter(member=>member.trait==="recessive"));
// console.log(chosenSched[0].schedule.filter(member=>member.trait==="dominant"));
// console.log(constructGroupingsbyDepartment(department,chosenSched,config));
// console.timeEnd("Time Elapsed")


