export const config = 
    {semester: 1,                           //configuration for the semester
    enableProfessorReassignment: true,      //configuration if the algorithm is allowed to change professors for each subject
    enableVariedProfessors: false,           //configuration if the algorithm is allowed to assign different professors for different sections but for the same subject
    populationSize: 4,                      //configuration for the population size.POPULATION SIZE MUST BE PERFECTLY DIVISIBLE BY 4.Recommended popsize is 500 for performance
    maxGenerations: 1000,                      //configuration for the minimum number of generations
    mutationProbability:0.05,                //configuration for the mutation probability. recommended value is 0.05;
    sessionImplementation: "hybrid",         //configuration whether the schedule is purely f2f, purely online, or hybrid
    nstpTargetDay: "saturday",              //NSTP Target Day
    nstpTargetStartTime: 7,                  //NSTP Target Time
    cwtsTargetDay: "saturday",
    cwtsTargetStartTime: 7,
    rotcTargetDay: "saturday",
    rotcTargetStartTime: 7,
}