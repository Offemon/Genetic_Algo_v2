const userDepartment = "CCS";

const department = [
    {courseName: "BSCS",
    levels:[
        {level: "1st_year",sections:["fsdfg","rtyert"], assignedCurriculum:curriculum[0]},
        {level: "2nd_year",sections:["fghjfg","yuio"], assignedCurriculum:curriculum[0]},
        {level: "3rd_year",sections:["BSCS 31A1"], assignedCurriculum:curriculum[0]},
        {level: "4th_year",sections:["BSCS 41E1"], assignedCurriculum:curriculum[0]},
        ]
    },
    {courseName: "BSIT",
    levels:[
        {level: "1st_year",sections:["BSIT 11M1","BSIT 11A1"], assignedCurriculum:curriculum[0]},
        {level: "2nd_year",sections:["BSIT 21M1","BSIT 21A1"], assignedCurriculum:curriculum[0]},
        {level: "3rd_year",sections:["BSIT 31A1","BSIT 31M1"], assignedCurriculum:curriculum[0]},
        {level: "4th_year",sections:["BSIT 41E1"], assignedCurriculum:curriculum[0]},
        ]
    }
]

const config = 
    {semester: 1,                           //configuration for the semester
    enableProfessorReassignment: true,      //configuration if the algorithm is allowed to change professors for each subject
    enableVariedProfessors: false,           //configuration if the algorithm is allowed to assign different professors for different sections but for the same subject
    populationSize: 4,                      //configuration for the population size.POPULATION SIZE MUST BE PERFECTLY DIVISIBLE BY 4.Recommended popsize is 500 for performance
    maxGenerations: 1,                      //configuration for the minimum number of generations
    mutationProbability:0.05,                //configuration for the mutation probability. recommended value is 0.05;
    sessionImplementation: "hybrid",         //configuration whether the schedule is purely f2f, purely online, or hybrid
    nstpTargetDay: "saturday",
    nstpTargetStartTime: 7
}

const allSubjects = getAllSubjects(department,config); //asdfasdfasdfasdfsdf




let subjWithProfArray = assignProfessorToSubjects(professors,allSubjects);
console.log(subjWithProfArray);
let prepdSubjects = subjectSessionPrep(subjWithProfArray,config);
// console.log(initializePopulation(prepdSubjects,rooms,department,config));
let chosenSched = geneticAlgorithm(rooms,department,prepdSubjects,professors,config);

//TO-DO
//refine Mutation function - reroll Professor
//Create a contingency function that will try to resolve the remaining recessive classes
//using a greedy algorithm as a last resort: Best fit Algorithm

console.log(constructGroupingsbyDepartment(department,chosenSched));

//Fitness ruleset in the fitness function needs constant and thorough refining.

