
const getAllSubjects = (department,activeSemester) => {
    let allSubjects = [];
    department.forEach(course=>{
        course.levels.forEach(level=>{
            let selectedLevel = level.level;
            if(activeSemester==1){
                subjects = level.assignedCurriculum.contents.find(level=>level.level==selectedLevel).firstSem;
            }
            else if(activeSemester==2){
                subjects = level.assignedCurriculum.contents.find(level=>level.level==selectedLevel).secondSem;
            }
            subjects.forEach(subject=>{
                allSubjects.push({department:userDepartment,course: course.courseName, level:selectedLevel,...subject});
            })
        })
    })
    return allSubjects;
}

const assignProfessorToSubjects = (professors,allSubjects) => {
    professors.forEach(professor=>{
        professor.priority = 1;
    });
    allSubjects.forEach(subject=>{
        let chosenProf = "";
        const qualifiedProfessors = professors.filter(prof=>prof.expertise.includes(subject.expertiseReq));
        let partTimeProfs = qualifiedProfessors.filter(professor=>professor.employmentType=="part-time");
        let fullTimeProfs = qualifiedProfessors.filter(professor=>professor.employmentType=="full-time");
        if(partTimeProfs.length>=1){
            if(partTimeProfs.length==1){
                chosenProf = partTimeProfs[0];
                chosenProf.priority++;
            }
            else{
                highestPriority = partTimeProfs.sort((a,b)=>{a.priority-b.priority})[0].priority;
                contestingProfs = partTimeProfs.filter(prof=>prof.priority==highestPriority);
                if(contestingProfs.length==1){
                    chosenProf = contestingProfs[0];
                    chosenProf.priority++;
                }
                else{
                    chosenProf = contestingProfs[Math.floor(Math.random()*(contestingProfs.length-1))]
                    chosenProf.priority++;
                }
            }
        }
        else{
            if(fullTimeProfs.length==1){
                chosenProf = fullTimeProfs[0];
                chosenProf.priority++;
            }
            else if(fullTimeProfs.length>1){
                highestPriority = fullTimeProfs.sort((a,b)=>{a.priority-b.priority})[0].priority;
                contestingProfs = fullTimeProfs.filter(prof=>prof.priority==highestPriority);
                if(contestingProfs.length==1){
                    chosenProf = contestingProfs[0];
                    chosenProf.priority++;
                }
                else{
                    chosenProf = contestingProfs[Math.floor(Math.random()*(contestingProfs.length-1))]
                    chosenProf.priority++;
                }
            }
            else{
                chosenProf = "TBA";
            }
        }
        subject.professor = chosenProf;
    });
    return allSubjects;
}

const subjectSessionPrep = (subjectArray) => {                  //a function that attaches an assignment variable and session property based on its classType
    let newsubjectArray = [];
    subjectArray.forEach(subject=>{
        // duration = subject.subject.duration
        subject.assigned = false;
        if(subject.classType==="lec"){
            subject.duration = 1.5;
            newsubjectArray.push({...subject,session:"sync"});
            newsubjectArray.push({...subject,session:"async"});
        }
        else if(subject.classType==="lab"){
            newsubjectArray.push({...subject,session:"f2f",duration:3});
            newsubjectArray.push({...subject,session:"async",duration:1.5});
        }
        else{
            newsubjectArray.push({...subject,session:"f2f",duration:3});
        }
    })
    // console.log(newsubjectArray);
    return newsubjectArray;
}

const dataInitialization = () =>{

}

const initializePopulation = (popSize,prepdSubjectsArray,roomsArray="",departmentArray) => {  // returns a group classes by section
    let initialPopulation = [];
    let sectionLevelSched= [];
    let overAllSched = [];
    const roomsToBeUsed = new Rooms(roomsArray);
    let days = ["monday","tuesday","wednesday","thursday","friday","saturday"]
    for(let popCounter = 0; popCounter < popSize; popCounter++){
        let overAllSched = [];
        departmentArray.forEach(course=>{
            currentCourse = course.courseName;
            course.levels.forEach(level=>{
                currentLevel = level.level;
                // console.log(currentLevel)
                level.sections.forEach(section=>{
                    let sectionLevelSched = []
                    currentSection = section;
                    // console.log(section);
                    prepdSubjectsArray.filter(subject=>subject.level==currentLevel && subject.course == currentCourse).forEach(subject=>{
                        subject.assigned=false;
                    })
                    fisherYatesShuffler(days).forEach(day=>{
                        const maximumSchoolHoursPerDay = 7;
                        let totalDailyHour = 0;
                        currentDay = day;
                        // console.log(currentDay);
                        let unassignedSubjects = prepdSubjectsArray.filter(subject=>subject.assigned==false && subject.level == currentLevel && subject.course == currentCourse);
                        // console.log(unassignedSubjects)
                        //Priorotize non async subjects with Part Time Professors
                        fisherYatesShuffler(unassignedSubjects.filter(subject=>subject.session!="async").filter(subject=>subject.professor.employmentType=="part-time").filter(subject=>subject.professor.availability.includes(currentDay))).forEach(subject=>{
                            if(totalDailyHour + subject.duration <= maximumSchoolHoursPerDay){
                                if(subject.session=="sync"){
                                    chosenRoom = "-"
                                }
                                else{
                                    switch(subject.classType){ // this needs to have its own function
                                        case "lec":
                                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType("lec").rooms;
                                            chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                                            break;
                                        case "lab":
                                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType("comp_lab").rooms;
                                            chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                                            break;
                                        case "gym":
                                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType("gym").rooms;
                                            chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                                            break;
                                        case "out":
                                            chosenRoom = "TBA";
                                            break;
                                        default:
                                            chosenRoom = "TBA"
                                            break;
                                    }
                                }
                                timeSlot = time[Math.floor(Math.random()*(time.length-11))].slot;
                                startTime = time.find(slot=>slot.slot==timeSlot);
                                endTime = time.find(slot=>slot.slot==(timeSlot+subject.duration));
                                subject.assigned = true;
                                sectionLevelSched.push({...subject,section:currentSection,day:day,room:chosenRoom, startTime:startTime,endTime:endTime});
                                totalDailyHour++;
                            }
                        });
                        fisherYatesShuffler(unassignedSubjects.filter(subject=>subject.session!="async").filter(subject=>subject.professor.employmentType=="full-time").filter(subject=>subject.professor.availability.includes(currentDay))).forEach(subject=>{
                            if(totalDailyHour + subject.duration <= maximumSchoolHoursPerDay){
                                if(subject.session=="sync"){
                                    chosenRoom = "-"
                                }
                                else{
                                    switch(subject.classType){ // this needs to have its own function
                                        case "lec":
                                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType("lec").rooms;
                                            chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                                            break;
                                        case "lab":
                                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType("comp_lab").rooms;
                                            chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                                            break;
                                        case "gym":
                                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType("gym").rooms;
                                            chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                                            break;
                                        case "out":
                                            chosenRoom = "TBA";
                                            break;
                                        default:
                                            chosenRoom = "TBA"
                                            break;
                                    }
                                }
                                timeSlot = time[Math.floor(Math.random()*(time.length-11))].slot;
                                startTime = time.find(slot=>slot.slot==timeSlot);
                                endTime = time.find(slot=>slot.slot==(timeSlot+subject.duration));
                                subject.assigned = true;
                                sectionLevelSched.push({...subject,section:currentSection,day:day,room:chosenRoom, startTime:startTime,endTime:endTime});
                                totalDailyHour++;
                            }
                        });
                        fisherYatesShuffler(unassignedSubjects.filter(subject=>subject.session=="async")).forEach(subject=>{
                            if(totalDailyHour + subject.duration <= maximumSchoolHoursPerDay){
                                chosenRoom="-";
                                timeSlot = time[Math.floor(Math.random()*(time.length-11))].slot;
                                startTime = time.find(slot=>slot.slot==timeSlot);
                                endTime = time.find(slot=>slot.slot==(timeSlot+subject.duration));
                                subject.assigned = true;
                                sectionLevelSched.push({...subject,section:currentSection,day:day,room:chosenRoom, startTime:startTime,endTime:endTime});
                                totalDailyHour++;
                            }
                        });
                    });
                    overAllSched.push(...sectionLevelSched.sort((a,b)=>{ // sorting the section-level sched is important during the crossover operation
                        if(a.subjCode.toLowerCase() < b.subjCode.toLowerCase()) return -1;
                        if(a.subjCode.toLowerCase() > b.subjCode.toLowerCase()) return 1;
                        return 0;
                    }));
                });
            });
        });
        initialPopulation.push(overAllSched);
    }
    // console.log(initialPopulation);
    return initialPopulation;
}

const fitnessFunction = (scheduleArray) => {        //this function evaluates the fitness of a single generated schedule - NEEDS CONSTANT REFINING
    //TO-DO
    //create evaluation criterias that will determine the fitness of a generated schedule (lower accumulated points is better)
    //criterias:
        //NSTP classes should be on Saturdays (+50 penalty points)
        //No two or more classes of share the same classroom at the same time (+10 penalty points)
        //No two or more classes of share the same professor at the same time (+30 penalty points)
        //No two or more classes share or has overlapping time slot (+20 penalty points)
    //this function should assign whether a single class is considered recessive or dominant
        //recessive traits are less likely to be used for crossovers but is more likely to mutate ro reroll some favorable properties
        //dominant trains are more likely to be used for crossovers but is less likely to mutate ro reroll some favorable properties
        const overlappingTimeslotPenaltyPoints = 20;    //a constant that holds the penalty value for a specific section with overlapping class hours.
        const roomConflictPenaltyPoints = 10;           //a constant that holds the penalty value for rooms holding 2 or more classes simultaneously
        const professorConflictPenaltyPoints = 30;      //a constant that holds the penalty value conflicting professor schedules
        const nstpOnWeekdaysPenalyPoints = 100;         //a constant that holds the penalty value for NSTP being on weekdays
        let evaluatedSchedule;                          //an array that holds a variable for the fitness evaluation and the schedule that is being evaluated
        let conflictingTimeSlot=0;                      //a variable that is incremented if there are conflicting time slots
        let conflictingRooms=0;                         //a variable that is incremented if there are conflicting rooms
        let conflictingProfessor=0;                     //a variable that is incremented if there are professors that are needed be 2 or more different classes at the same time
        let weekDayNSTP=0;                              //a variable that is incremented if there are NSTP Classes on weekdays
        let maximumOopsiePoints=0;                      //a variable that contains the maximum number of negative points that a schedule can have
        let totalOopsiePoints=0;                        //a variable that contains the accumulated number of negative points  of a schedule
        //TO-DO
        //calculate maximum oopsies - RESOLVED
        //count the number of classes that are NSTP - RESOLVED
        //count the number of classes that are not NSTP - RESOLVED
        const nstpClassCount = scheduleArray.filter(selectedClass=> selectedClass.subjCode=="NSTP1" || selectedClass.subjCode=="NSTP2").length;
        // const nonNSTPClassCount = scheduleArray.filter(selectedClass=> selectedClass.subjCode!="NSTP1" && selectedClass.subjCode!="NSTP2").length;
        const allClassesCount = scheduleArray.length;
        maximumOopsiePoints =   (nstpClassCount*nstpOnWeekdaysPenalyPoints) +
                                (allClassesCount*(overlappingTimeslotPenaltyPoints+roomConflictPenaltyPoints+professorConflictPenaltyPoints));
    
        for(let currentClassIndex = 0; currentClassIndex< scheduleArray.length; currentClassIndex++){ //loop through all subjects to assign a default trait value of "dominant"
            scheduleArray[currentClassIndex].trait = "dominant";
        }
        // scheduleArray.filter(selectedClass=>selectedClass.trait=="dominant").length
        for(let currentClassIndex = 0; currentClassIndex< scheduleArray.length-1; currentClassIndex++){
            for(let comparedToIndex = currentClassIndex+1; comparedToIndex<scheduleArray.length;comparedToIndex++){
                //check time conflict
                if(((scheduleArray[currentClassIndex].day == scheduleArray[comparedToIndex].day) &&
                    (scheduleArray[currentClassIndex].section == scheduleArray[comparedToIndex].section)) &&
                    // (scheduleArray[currentClassIndex].subjCode != "NSTP1" || scheduleArray[currentClassIndex].subjCode != "NSTP2")&&    //It's ok for NSTP to have the exact time slot.
                    (((scheduleArray[currentClassIndex].startTime.slot<=scheduleArray[comparedToIndex].startTime.slot) && (scheduleArray[currentClassIndex].endTime.slot<=scheduleArray[comparedToIndex].endTime.slot) && (scheduleArray[currentClassIndex].endTime.slot>=scheduleArray[comparedToIndex].startTime.slot)) || 
                    ((scheduleArray[currentClassIndex].startTime.slot>=scheduleArray[comparedToIndex].startTime.slot) && (scheduleArray[currentClassIndex].startTime.slot<=scheduleArray[comparedToIndex].endTime.slot) && (scheduleArray[currentClassIndex].endTime.slot>=scheduleArray[comparedToIndex].startTime.slot)))
                ){
                    conflictingTimeSlot += overlappingTimeslotPenaltyPoints;
                    scheduleArray[currentClassIndex].trait = "recessive";
                    scheduleArray[comparedToIndex].trait = "recessive"
                }
    
                //check professor conflict
                if((scheduleArray[currentClassIndex].professor.name == scheduleArray[comparedToIndex].professor.name) &&
                    (scheduleArray[currentClassIndex].day == scheduleArray[comparedToIndex].day) &&
                    ((scheduleArray[currentClassIndex].startTime.slot>=scheduleArray[comparedToIndex].startTime.slot) &&
                    (scheduleArray[currentClassIndex].endTime.slot<scheduleArray[comparedToIndex].endTime.slot))){
                    conflictingProfessor += professorConflictPenaltyPoints;
                    scheduleArray[currentClassIndex].trait = "recessive";
                    scheduleArray[comparedToIndex].trait = "recessive"
                }

                //check room conflict
                if(scheduleArray[currentClassIndex].day == scheduleArray[comparedToIndex].day &&
                    (scheduleArray[currentClassIndex].session == "f2f" && scheduleArray[comparedToIndex].session == "f2f") &&
                    (scheduleArray[currentClassIndex].room == scheduleArray[comparedToIndex].room) &&
                    ((scheduleArray[currentClassIndex].startTime.slot>=scheduleArray[comparedToIndex].startTime.slot) &&
                    (scheduleArray[currentClassIndex].endTime.slot<scheduleArray[comparedToIndex].endTime.slot))){
                    conflictingRooms += roomConflictPenaltyPoints;
                    scheduleArray[currentClassIndex].trait = "recessive";
                    scheduleArray[comparedToIndex].trait = "recessive"
                }
            }
        }

        for(let currentClassIndex = 0; currentClassIndex< scheduleArray.length; currentClassIndex++){ //loop through all subjects to search for an NSTP Subject
            //check if NSTP is on a weekday and starts at 7am;
            if((scheduleArray[currentClassIndex].subjCode == "NSTP1" || scheduleArray[currentClassIndex].subjCode == "NSTP2") && (scheduleArray[currentClassIndex].day!="saturday" && scheduleArray[currentClassIndex].startTime.slot!==7)){
                weekDayNSTP += nstpOnWeekdaysPenalyPoints;
                scheduleArray[currentClassIndex].trait = "recessive";
            }
        }
        // const recessiveCount = spreadedClasses.filter(selectedClass=>selectedClass.trait=="recessive").length;
        totalOopsiePoints = conflictingProfessor + conflictingRooms + conflictingTimeSlot + weekDayNSTP;
        evaluatedSchedule = (1-(totalOopsiePoints/maximumOopsiePoints)); //simple fitness formula
        //For Debugging purposes only
        // console.log(`Classes Count: ${scheduleArray.length}, total oopsies: ${totalOopsiePoints}, maximum oopsies: ${maximumOopsiePoints}, NSTP Classes: ${nstpClassCount}`);
        // console.log(`Fitness: ${evaluatedSchedule*100}%, No. of recessive traits: ${recessiveCount}`);
        return {fitness:evaluatedSchedule, schedule:scheduleArray};
}

const evaluatePopulation = (schedPopulation) => {   //this function evaluates an entire generated population of schedules and returns a spreaded classes with fitness values attached to each schedule
    let evaluatedPopulation = [];
    schedPopulation.forEach(sched=>{
        evaluatedPopulation.push(fitnessFunction(sched));
    })
    return evaluatedPopulation;
}

const crossOverFunction = (schedule) => {           //this function splices the genomes of the best schedule - 2 at a time
    //TO-DO
    //get the top half of the sorted array - RESOLVED!
    //create an operation that that creates an offspring of the top half from the previous operation - RESOLVED!
    let sortedSchedArray = evaluatePopulation(schedule).sort((a,b)=>b.fitness-a.fitness);
    let bestHalf = sortedSchedArray.slice(0,sortedSchedArray.length/2);
    let crossOveredSched = [];
    bestHalf.forEach(evaluatedSched=>{      // the first half of the new population will the be the best half of the previous population
        crossOveredSched.push(evaluatedSched.schedule);
    })
    bestHalfArr=bestHalf.map(evaluatedSched=>evaluatedSched.schedule);
    for(let schedCurrentIndex = 0;schedCurrentIndex<bestHalfArr.length;schedCurrentIndex+=2){     //this loop will generate a new population but the dominant traits are in favor of Parent A
        let parentA = bestHalfArr[schedCurrentIndex];
        let parentB = bestHalfArr[schedCurrentIndex+1];
        let offSpringSchedule = [];
        for(let classCurrentIndex=0;classCurrentIndex<parentA.length;classCurrentIndex++){
            if(parentA[classCurrentIndex].trait=="dominant"){
                offSpringSchedule.push(parentA[classCurrentIndex]);
            }
            else{
                offSpringSchedule.push(parentB[classCurrentIndex]);
            }
        }
        crossOveredSched.push(offSpringSchedule);
    }

    for(let schedCurrentIndex = 0;schedCurrentIndex<bestHalfArr.length;schedCurrentIndex+=2){     //this loop will generate a new population but the dominant traits are in favor of Parent B
        let parentA = bestHalfArr[schedCurrentIndex];
        let parentB = bestHalfArr[schedCurrentIndex+1];
        let offSpringSchedule = [];
        for(let classCurrentIndex=0;classCurrentIndex<parentB.length;classCurrentIndex++){
            if(parentB[classCurrentIndex].trait=="dominant"){
                offSpringSchedule.push(parentB[classCurrentIndex]);
            }
            else{
                offSpringSchedule.push(parentA[classCurrentIndex]);
            }
        }
        crossOveredSched.push(offSpringSchedule);
    }
    // console.log("Crossover Function: ",evaluatePopulation(reconstructGroupingBySections(crossOveredSched)).sort((a,b)=>b.fitness-a.fitness));  //for debugging purposes only
    // // return evaluatePopulation(crossOveredSched.sort((a,b)=>b.fitness-a.fitness));
    // console.log(evaluatePopulation(crossOveredSched).sort((a,b)=>b.fitness-a.fitness));
    return evaluatePopulation(crossOveredSched).sort((a,b)=>b.fitness-a.fitness);
}

const mutationFunction = (mutationProb,schedPopulation,roomsArray) => {                    //[WORK IN PROGRESS]this function enables a schedule to reroll some of it's recessive genomes
    const roomsToBeUsed = new Rooms(roomsArray);
    schedPopulation.forEach(selectedSched=>{
        let defectiveClasses = selectedSched.filter(selectedClass=>selectedClass.trait=="recessive");
        defectiveClasses.forEach(selectedClass => {
            //reroll Room
            if(Math.random() < mutationProb){
                timeSlot = time[Math.floor(Math.random()*(time.length-11))];
                startTime = timeSlot
                endTime = time.find(time=>time.slot===timeSlot.slot+selectedClass.duration);
                selectedClass.startTime = startTime;
                selectedClass.endTime = endTime;
                // console.log("rerolled time");
            }
            if(Math.random() < mutationProb){
                if(selectedClass.session=="f2f"){
                    switch(selectedClass.classType){ // this needs to have its own function
                        case "lec":
                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType("lec").rooms;
                            chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                            break;
                        case "lab":
                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType("comp_lab").rooms;
                            chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                            break;
                        case "gym":
                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType("gym").rooms;
                            chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                            break;
                        case "out":
                            chosenRoom = "TBA";
                            break;
                        default:
                            chosenRoom = "TBA"
                            break;
                    }
                }
                // console.log("rerolled room");
            }
        })
    })
    return schedPopulation;
}

const generationLoop = (mutationProb,generationCount, initialPopulation,roomsArray) => {   //[WORK IN PROGRESS - Mutation Function not yet Implemented]this function will perform the crossover functions and mutations to generate a new generation of schedules.
    let newGeneration = initialPopulation;
    let fittestSched = evaluatePopulation(initialPopulation).sort((a,b)=>b.fitness-a.fitness)[0];
    // for(let generationCounter = 0; generationCounter < generationCount; generationCounter++){
    //     let currentGeneration = crossOverFunction(newGeneration).sort((a,b)=>b.fitness-a.fitness);
    //     newGeneration = currentGeneration.map(sched=>sched.schedule);
    //     newGeneration = mutationFunction(mutationProb,newGeneration,roomsArray);
    //     if(fittestSched.fitness < currentGeneration[0].fitness){
    //         fittestSched = currentGeneration[0];
    //     }
    //     console.log(`Generation: ${generationCounter+1}, Best Fitness: ${(fittestSched.fitness*100).toFixed(2)}%`);
    //     console.log("Fittest Sched: ", fittestSched);
    // }
    let nthGeneration = 1;
    while(fittestSched.fitness != 1){                                                                           //loop that only stops when it finds a 100% fitness schedule

        let currentGeneration = crossOverFunction(newGeneration).sort((a,b)=>b.fitness-a.fitness);
        newGeneration = currentGeneration.map(sched=>sched.schedule);
        newGeneration = mutationFunction(mutationProb,newGeneration,roomsArray);
        if(fittestSched.fitness < currentGeneration[0].fitness){
            fittestSched = currentGeneration[0];
        }
        console.log(`Generation: ${nthGeneration}, Best Fitness: ${(fittestSched.fitness*100).toFixed(2)}%`);
        console.log("Fittest Sched: ", fittestSched);
        nthGeneration++;
    }
    return fittestSched;
}

const geneticAlgorithm = (populationSize,maxGenerationCount,mutationProbability,roomsArray,department,prepdSubjects) => {     //[WORK IN PROGRESS]this is hte Main Genetic Algorithm function
    let initPopArray = initializePopulation(populationSize,prepdSubjects,roomsArray,department);
    // console.log(initPopArray);
    let fittestSched = generationLoop(mutationProbability,maxGenerationCount,initPopArray,roomsArray);
    return fittestSched.schedule;
}



//utility/non-GA functions section
const addProfessorDailyLoad = (professorsArray) => {            //a function that attaches a variable to hold the number of time that a professor can spend per day and a variable to hold a priority value

}

const fisherYatesShuffler = (array) => {                        //a function that uses Fisher-Yates algorithm to shuffle an array
    for (let i = array.length-1; i> 0; i--){
        const randomIndex = Math.floor(Math.random()*(i+1));
        [array[i],array[randomIndex]]=[array[randomIndex],array[i]]
    }
    return array;
}

const constructGroupingsbyDepartment = (department,overallSchedArray) => {
    let structuredSchedule = [];
    department.forEach(course=>{
        let courseName = course.courseName;
        // console.log(courseName)
        let groupByCourse = [];
        course.levels.forEach(level=>{
            let levelName = level.level;
            let groupByLevel = [];
            // console.log(levelName);
            level.sections.forEach(section=>{
                groupByLevel.push({sectionName:section, classes: overallSchedArray.filter(classGroup=>classGroup.section===section)});
            })
            groupByCourse.push({level: levelName, sections:groupByLevel});
        })
        structuredSchedule.push({course: courseName,levels:groupByCourse});
    })
    return structuredSchedule;
}