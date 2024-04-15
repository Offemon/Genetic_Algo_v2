const userDepartment = "CCS";

const department = [
    {courseName: "BSCS",
    levels:[
        {level: "1st_year",sections:["BSCS 11M1","BSCS 11A1"], assignedCurriculum:curriculum[0]},
        {level: "2nd_year",sections:["BSCS 21M1","BSCS 21A1"], assignedCurriculum:curriculum[0]},
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
const allSubjects = getAllSubjects(department,2);
// // console.log(allSubjects);
let subjWithProfArray = assignProfessorToSubjects(professors,allSubjects);
let prepdSubjects = subjectSessionPrep(subjWithProfArray);
// console.log(prepdSubjects);
// console.log(initializePopulation(1,prepdSubjects,rooms,department));
// fitnessFunction(initializePopulation(1,prepdSubjects,rooms,department)[0]);

let chosenSched = geneticAlgorithm(4,100,0.05,rooms,department,prepdSubjects,professors);

//TO-DO
//Create a contingency function that will try to resolve the remaining recessive classes
//using a greedy algorithm as a last resort: Best fit Algorithm

// console.log(chosenSched.length);
console.log(constructGroupingsbyDepartment(department,chosenSched));

//Fitness ruleset in the fitness function needs constant and thorough refining.

