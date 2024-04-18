
const getAllSubjects = (department,config) => {
    const activeSemester = config.semester;
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

const subjectSessionPrep = (subjectArray,config) => {                  //a function that attaches an assignment variable and session property based on its classType
    const implementation = config.sessionImplementation;
    let newsubjectArray = [];
    let series = 0;
    if(implementation === "hybrid"){
        subjectArray.forEach(subject=>{
            // duration = subject.subject.duration
            subject.assigned = false;
            if(subject.classType==="lec"){
                subject.duration = 1.5;
                newsubjectArray.push({...subject,session:"sync",series:series});
                newsubjectArray.push({...subject,session:"async",series:series+1});
                series+=2;
            }
            else if(isLab(subject)){
                newsubjectArray.push({...subject,session:"f2f",duration:3,series:series});
                newsubjectArray.push({...subject,session:"async",duration:1.5,series:series+1});
                series+=2;
            }
            else{
                newsubjectArray.push({...subject,session:"f2f",duration:3,series:series});
                series++;
            }
        })
    }
    if(implementation === "f2f"){
        subjectArray.forEach(subject=>{
            // duration = subject.subject.duration
            subject.assigned = false;
            if(subject.classType==="lec"){
                subject.duration = 1.5;
                newsubjectArray.push({...subject,session:"f2f",series:series, partition: "a"});
                newsubjectArray.push({...subject,session:"f2f",series:series+1, partition: "b"});
                series+=2;
            }
            else if(isLab(subject)){
                newsubjectArray.push({...subject,session:"f2f",duration:3,series:series, partition: "a"});
                newsubjectArray.push({...subject,session:"f2f",duration:1.5,series:series+1, partition:"b"});
                series+=2;
            }
            else{
                newsubjectArray.push({...subject,session:"f2f",duration:3,series:series, partition:"a"});
                series++;
            }
        })
    }
    if(implementation === "online"){
        subjectArray.forEach(subject=>{
            // duration = subject.subject.duration
            subject.assigned = false;
            if(subject.classType==="lec"){
                subject.duration = 1.5;
                newsubjectArray.push({...subject,session:"sync",series:series});
                newsubjectArray.push({...subject,session:"async",series:series+1});
                series+=2;
            }
            else if(isLab(subject)){
                newsubjectArray.push({...subject,session:"sync",duration:3,series:series});
                newsubjectArray.push({...subject,session:"async",duration:1.5,series:series+1});
                series+=2;
            }
            else{
                newsubjectArray.push({...subject,session:"sync",duration:3,series:series});
                series++;
            }
        })
    }
    // console.log(newsubjectArray);
    return newsubjectArray;
}

const initializePopulation = (prepdSubjectsArray,roomsArray,departmentArray,config) => {  // returns a group classes by section
    const popSize = config.populationSize
    let initialPopulation = [];
    let overAllSched = [];
    let sectionLevelSched = []
    // let levelSched = [];
    const roomsToBeUsed = new Rooms(roomsArray);
    let days = ["monday","tuesday","wednesday","thursday","friday","saturday"]
    for(let popCounter = 0; popCounter < popSize; popCounter++){
        overAllSched = [];
        departmentArray.forEach(course=>{
            currentCourse = course.courseName;
            levelSched = [];
            course.levels.forEach(level=>{
                currentLevel = level.level;
                level.sections.forEach(section=>{
                    sectionLevelSched = [];
                    currentSection = section;
                    prepdSubjectsArray.filter(subject=>subject.course == currentCourse).forEach(subject=>{
                        subject.assigned=false;
                    })
                    fisherYatesShuffler(days).forEach(day=>{
                        const maximumSchoolHoursPerDay = 7;
                        let totalDailyHour = 0;
                        currentDay = day;
                        let unassignedSubjects = prepdSubjectsArray.filter(subject=>subject.assigned==false && subject.level == currentLevel && subject.course == currentCourse);
                        //Priorotize non async subjects with Part Time Professors
                        fisherYatesShuffler(unassignedSubjects.filter(subject=>subject.session!="async").filter(subject=>subject.professor.employmentType=="part-time").filter(subject=>subject.professor.availability.includes(currentDay))).forEach(subject=>{
                            if(totalDailyHour + subject.duration <= maximumSchoolHoursPerDay){
                                if(subject.session=="sync"){
                                    chosenRoom = "-"
                                }
                                else{
                                    switch(subject.classType){ // this needs to have its own function
                                        case "lec":
                                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType(subject.classType).rooms;
                                            chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                                            break;
                                        case "lab":
                                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType(subject.classType).rooms;
                                            chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                                            break;
                                        case "gym":
                                            roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType(subject.classType).rooms;
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
                    overAllSched.push(...sectionLevelSched.sort((a,b)=>a.series-b.series)); //sorting the section-level sched is important during the crossover operation
                });
            });
        });
        initialPopulation.push(overAllSched);
    }
    return initialPopulation;
}

const fitnessFunction = (scheduleArray) => {        //this function evaluates the fitness of a single generated schedule - NEEDS CONSTANT REFINING
        //criterias:
        //NSTP classes should be on Saturdays and starts at 7am
        //No two or more classes of share the same classroom at the same time
        //No two or more classes of share the same professor at the same time
        //No two or more classes share or has overlapping time slot
    //this function should assign whether a single class is considered recessive or dominant
        let evaluatedSchedule;                          //an array that holds a variable for the fitness evaluation and the schedule that is being evaluated                     //a variable that is incremented if there are professors that are needed be 2 or more different classes at the same time
        const allClassesCount = scheduleArray.length;
        for(let currentClassIndex = 0; currentClassIndex< scheduleArray.length; currentClassIndex++){ //loop through all subjects to assign a default trait value of "dominant"
            scheduleArray[currentClassIndex].trait = "dominant";
            scheduleArray[currentClassIndex].issues = [];
            scheduleArray[currentClassIndex].conflictWith = [];
        }
        for(let currentClassIndex = 0; currentClassIndex< scheduleArray.length; currentClassIndex++){
            let currentSubject = scheduleArray[currentClassIndex];
            if(isLab(currentSubject) || isGym(currentSubject)){
                if(currentSubject.startTime.slot > 16){
                    if(!currentSubject.issues.includes("late_start")) currentSubject.issues.push("late_start");
                    currentSubject.trait = "recessive";
                }
            }
            if(currentSubject.trait == "dominant"){
                for(let comparedToIndex = currentClassIndex+1; comparedToIndex<scheduleArray.length;comparedToIndex++){
                    let subjectComparedTo = scheduleArray[comparedToIndex]
                    if(!isNSTP(currentSubject) && !isNSTP(subjectComparedTo)){
                        if(currentSubject.level==="first_year" && currentSubject.day === "saturday" && currentSubject.startTime.slot>10){
                            if(!currentSubject.issues.includes("NSTP_conflict")){
                                currentSubject.issues.push("NSTP_conflict");
                            }
                            currentSubject.trait = "recessive";
                        }
    
    
                        //check time conflict
                        if(isSameDay(currentSubject,subjectComparedTo) && isSameSection(currentSubject,subjectComparedTo) && isOverLapping(currentSubject,subjectComparedTo)){
                            // if(!currentSubject.issues.includes("time_conflict") && !isNSTP(currentSubject)){
                            //     currentSubject.issues.push("time_conflict")
                            // }
                            // currentSubject.trait = "recessive";
                            if(!subjectComparedTo.issues.includes("time_conflict")) subjectComparedTo.issues.push("time_conflict");
                            subjectComparedTo.trait = "recessive";
                            // console.log("has time conflict!")
                        }
            
                        //check professor conflict
                        if(isProfConflict(currentSubject,subjectComparedTo)){
                            // if(!currentSubject.issues.includes("professor_conflict")) currentSubject.issues.push("professor_conflict");
                            // currentSubject.trait = "recessive";
                            // currentSubject.conflictWith.push({day: subjectComparedTo.day ,startTime:subjectComparedTo.startTime.slot,subjCode:subjectComparedTo.subjCode, section:subjectComparedTo.section});
                            if(!subjectComparedTo.issues.includes("professor_conflict")) subjectComparedTo.issues.push("professor_conflict");
                            subjectComparedTo.trait = "recessive";
                            // subjectComparedTo.conflictWith.push({day: currentSubject.day ,startTime:currentSubject.startTime.slot,subjCode:currentSubject.subjCode, section:currentSubject.section});
                        }
        
                        //check room conflict
                        if(isSameDay(currentSubject,subjectComparedTo) && isSameRoom(currentSubject,subjectComparedTo) && isOverLapping(currentSubject,subjectComparedTo) && isSameF2F(currentSubject,subjectComparedTo)){
                            // if(!currentSubject.issues.includes("room_conflict")) currentSubject.issues.push("room_conflict");
                            // currentSubject.trait = "recessive";
                            if(!subjectComparedTo.issues.includes("room_conflict")) subjectComparedTo.issues.push("room_conflict");
                            subjectComparedTo.trait = "recessive";
                        }
                    }
    
                    //NSTP Checker
                    if(isNSTP(currentSubject) && currentSubject.day!=="saturday"){
                        if(!currentSubject.issues.includes("weekday_NSTP")) currentSubject.issues.push("weekday_NSTP");
                        currentSubject.trait = "recessive";
                    }
                    if(isNSTP(currentSubject) && currentSubject.startTime.slot!==7){
                        if(!currentSubject.issues.includes("late_NSTP")) currentSubject.issues.push("late_NSTP");
                        currentSubject.trait = "recessive";
                    }
                    if(isNSTP(currentSubject) && !isNSTP(subjectComparedTo)){
                        if(isOverLapping(currentSubject,subjectComparedTo) && isSameLevel(currentSubject,subjectComparedTo)){
                            subjectComparedTo.trait = "recessive";
                        }
                    }
                }
            }
        }

        dominantClasses = scheduleArray.filter(selectedClass=>selectedClass.trait==="dominant").length;
        evaluatedSchedule = (dominantClasses/allClassesCount); //simple fitness formula
        //For Debugging purposes only
        // console.log(`Classes Count: ${scheduleArray.length}, total oopsies: ${totalOopsiePoints}, maximum oopsies: ${maximumOopsiePoints}, NSTP Classes: ${nstpClassCount}`);
        // console.log(`Fitness: ${evaluatedSchedule*100}%, No. of recessive traits: ${recessiveCount}`);
        // scheduleArray=scheduleArray.sort((a,b)=>a.series-b.series);
        return {fitness:evaluatedSchedule, schedule:scheduleArray};
}

const evaluatePopulation = (schedPopulation) => {   //this function evaluates an entire generated population of schedules and returns a spreaded classes with fitness values attached to each schedule
    let evaluatedPopulation = [];
    schedPopulation.forEach(sched=>{
        evaluatedPopulation.push(fitnessFunction(sched));
    })
    return evaluatedPopulation;
}

const crossOverFunction = (schedule,stagnationCounter) => {           //this function splices the genomes of the best schedule - 2 at a time
    let crossOveredSched = [];
    // console.log(`Crossover initial:`);
    // console.log(evaluatePopulation(schedule).sort((a,b)=>b.fitness-a.fitness));
    //TO-DO
    //get the top half of the sorted array - RESOLVED!
    //create an operation that that creates an offspring of the top half from the previous operation - RESOLVED!
    
    //Eugenics Operator
    if(stagnationCounter%50===0 && stagnationCounter > 0){
        // console.log("Starting Eugenics");
        let sortedSchedArray = evaluatePopulation(schedule).sort((a,b)=>b.fitness-a.fitness);

        // console.log(sortedSchedArray);
        let bestHalf = sortedSchedArray.slice(0,sortedSchedArray.length/2);
    
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
    }

    //default operator
    else{
        let offSpringSchedule = [];
        const midIndex = Math.ceil(schedule.length/2);
        let firstHalf = evaluatePopulation(schedule.slice(0,midIndex)).sort((a,b)=>b.fitness-a.fitness).map(sched=>sched.schedule);
        let secondHalf = evaluatePopulation(schedule.slice(midIndex)).sort((a,b)=>a.fitness-b.fitness).map(sched=>sched.schedule);
        for(let schedCurrentIndex = 0; schedCurrentIndex < firstHalf.length; schedCurrentIndex++){
            let parentA = firstHalf[schedCurrentIndex];
            let parentB = secondHalf[schedCurrentIndex];
            offSpringSchedule = [];
            // console.log(`Parent A: ${parentA.length}, Parent B: ${parentB.length}`);
            for(let classCurrentIndex = 0; classCurrentIndex < parentA.length; classCurrentIndex++){
                if(parentA[classCurrentIndex].trait=="dominant"){
                    offSpringSchedule.push(parentA[classCurrentIndex]);
                }
                else{
                    offSpringSchedule.push(parentB[classCurrentIndex]);
                }
            }
            crossOveredSched.push(offSpringSchedule);
            offSpringSchedule=[];
            for(let classCurrentIndex = 0; classCurrentIndex < parentA.length; classCurrentIndex++){
                if(parentB[classCurrentIndex].trait=="dominant"){
                    offSpringSchedule.push(parentB[classCurrentIndex]);
                }
                else{
                    offSpringSchedule.push(parentA[classCurrentIndex]);
                }
            }
            crossOveredSched.push(offSpringSchedule);
        }
    }
    // console.log(evaluatePopulation(crossOveredSched).sort((a,b)=>b.fitness-a.fitness))
    return evaluatePopulation(crossOveredSched).sort((a,b)=>b.fitness-a.fitness);
}

const mutationFunction = (schedPopulation,roomsArray,professors,config) => {                    //[WORK IN PROGRESS]this function enables a schedule to reroll some of it's recessive genomes
    const mutationProb = config.mutationProbability;
    const enableReassign = config.enableProfessorReassignment;
    const enableVarProf = config.enableVariedProfessors;
    const roomsToBeUsed = new Rooms(roomsArray);
    let selectedClass;
    schedPopulation.forEach(selectedSched=>{
        for(let selectedClassIndex = 0; selectedClassIndex < selectedSched.length; selectedClassIndex++){
            selectedClass = selectedSched[selectedClassIndex];
            if(selectedClass.trait==="recessive"){
                //reroll time
                if((Math.random() < mutationProb)){
                    let timeSlot;
                    let startTime;
                    let endTime;
                    timeSlot = time[Math.floor(Math.random()*(time.length-13))];
                    startTime = timeSlot
                    endTime = time.find(time=>time.slot===timeSlot.slot+selectedClass.duration);
                    selectedClass.startTime = startTime;
                    selectedClass.endTime = endTime;
                }
                //reroll Room
                if(Math.random() < mutationProb && selectedClass.issues.includes("room_conflict")){
                    if(selectedClass.session=="f2f"){
                        let roomsArray = [];
                        let chosenRoom;
                        switch(selectedClass.classType){ // this needs to have its own function
                            case "lec":
                                roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType(selectedClass.classType).rooms;
                                chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                                break;
                            case "lab":
                                roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType(selectedClass.classType).rooms;
                                chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                                break;
                            case "gym":
                                roomsArray = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType(selectedClass.classType).rooms;
                                chosenRoom = roomsArray[Math.floor(Math.random()*(roomsArray.length-1))];
                                break;
                            case "out":
                                chosenRoom = "TBA";
                                break;
                            default:
                                chosenRoom = "TBA"
                                break;
                        }
                        selectedClass.room = chosenRoom;
                    }

                }
                //t2 desperation
                //reroll day
                if((Math.random() < mutationProb)){
                    if(selectedClass.professor!=="TBA"){
                        let currentDay = selectedClass.day;
                        let assignedProfAvailability = selectedClass.professor.availability;
                        if (assignedProfAvailability.length > 1){
                            let newDay = assignedProfAvailability.filter(day=> day!= currentDay);
                            selectedClass.day = fisherYatesShuffler(newDay)[0];
                        }
                        else{
                        }
                    }
                }
                //reroll Professor
                if((Math.random() < mutationProb) && enableReassign && (selectedClass.issues.includes("professor_conflict"))){
                    let subjCode = selectedClass.subjCode;
                    let section = selectedClass.section;
                    let classDay = selectedClass.day;
                    let requiredExpertise = selectedClass.expertiseReq;
                    let classesAffected;
                    if(enableVarProf){
                        classesAffected = selectedSched.filter(selectedClasses => selectedClasses.subjCode == subjCode && selectedClasses.section === section);
                    }
                    else{
                        classesAffected = selectedSched.filter(selectedClasses => selectedClasses.subjCode == subjCode);
                    }
                    let chosenProf;
                    let qualifiedProfessors
                    if(selectedClass.professor == "TBA" || selectedClass.professor == undefined) {
                        qualifiedProfessors = professors.filter(prof=>prof.expertise.includes(requiredExpertise) && prof.availability.includes(classDay));
                        if(qualifiedProfessors.length>1){
                            chosenProf = fisherYatesShuffler(qualifiedProfessors)[0];
                            classesAffected.forEach(selectedClass=>{
                                selectedClass.professor = chosenProf;
                            });
                        }
                        else if(qualifiedProfessors.length===1){
                            chosenProf = qualifiedProfessors[0];
                            classesAffected.forEach(selectedClass=>{
                                selectedClass.professor = chosenProf;
                            });
                        }
                        else{
                            selectedClass.professor = "TBA"
                        }
                    }
                    else{
                        let currentlyAssignedProf = selectedClass.professor.name;
                        qualifiedProfessors = professors.filter(prof=>prof.expertise.includes(requiredExpertise) && prof.availability.includes(classDay));
                        if(qualifiedProfessors.length>1){
                            chosenProf = fisherYatesShuffler(qualifiedProfessors.filter(prof=>prof.name!==currentlyAssignedProf))[0];
                            classesAffected.forEach(selectedClass=>{
                                selectedClass.professor = chosenProf;
                            });
                        }
                        else if(qualifiedProfessors.length===1){
                            chosenProf = qualifiedProfessors[0];
                            classesAffected.forEach(selectedClass=>{
                                selectedClass.professor = chosenProf;
                            });
                        }
                        else{
                            selectedClass.professor = "TBA"
                        }
                    }
                }
            }
        }
    })
    return schedPopulation;
}

const generationLoop = (initialPopulation,roomsArray,professors,config) => {   //[WORK IN PROGRESS - Mutation Function not yet Implemented]this function will perform the crossover functions and mutations to generate a new generation of schedules.
    const generationCount = config.maxGenerations;
    let newGeneration = initialPopulation;
    let fittestSched = evaluatePopulation(newGeneration).sort((a,b)=>b.fitness-a.fitness)[0];
    let stagnationCounter = 0
    for(let generationCounter = 0; generationCounter < generationCount; generationCounter++){
        let currentGeneration = crossOverFunction(newGeneration,stagnationCounter).sort((a,b)=>b.fitness-a.fitness);
        newGeneration = currentGeneration.map(sched=>sched.schedule);
        if(fittestSched.fitness < currentGeneration[0].fitness){
            fittestSched = currentGeneration[0];
            if(fittestSched.fitness===1){
                console.log(`Generation: ${generationCounter+1}, Stagnation Counter: ${stagnationCounter}, Best Fitness: ${(fittestSched.fitness*100).toFixed(2)}%, This Generation's Best: ${(currentGeneration[0].fitness*100)}%`);
                console.log("Fittest Sched: ", fittestSched, " ",fittestSched.schedule.filter(selectedClasses=>selectedClasses.trait==="dominant").length, " of ",fittestSched.length);
                return fittestSched;
            }
            stagnationCounter=0;
        }
        else{
            stagnationCounter++
        }
        newGeneration = evaluatePopulation(mutationFunction(newGeneration,roomsArray,professors,config)).map(sched=>sched.schedule);
        console.log(`Generation: ${generationCounter+1}, Stagnation Counter: ${stagnationCounter}, Best Fitness: ${(fittestSched.fitness*100).toFixed(2)}%, This Generation's Best: ${(currentGeneration[0].fitness*100).toFixed(2)}%`);
        console.log("Fittest Sched: ", fittestSched);
    }
    // let nthGeneration = 1;
    // while(fittestSched.fitness != 1){                                                                           //loop that only stops when it finds a 100% fitness schedule
    //     let currentGeneration = crossOverFunction(newGeneration).sort((a,b)=>b.fitness-a.fitness);
    //     newGeneration = currentGeneration.map(sched=>sched.schedule);
    //     newGeneration = mutationFunction(mutationProb,newGeneration,roomsArray);
    //     if(fittestSched.fitness < currentGeneration[0].fitness){
    //         fittestSched = currentGeneration[0];
    //     }
    //     console.log(`Generation: ${nthGeneration}, Best Fitness: ${(fittestSched.fitness*100).toFixed(2)}%`);
    //     console.log("Fittest Sched: ", fittestSched);
    //     nthGeneration++;
    // }
    return fittestSched;
}

const geneticAlgorithm = (roomsArray,department,prepdSubjects,professors,config) => {     //[WORK IN PROGRESS]this is hte Main Genetic Algorithm function
    let initPopArray = initializePopulation(prepdSubjects,roomsArray,department,config);
    let fittestSched = generationLoop(initPopArray,roomsArray,professors,config);
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
        let groupByCourse = [];
        course.levels.forEach(level=>{
            let levelName = level.level;
            let groupByLevel = [];
            level.sections.forEach(section=>{
                groupByLevel.push({sectionName:section, classes: overallSchedArray.filter(classGroup=>classGroup.section===section)});
            })
            groupByCourse.push({level: levelName, sections:groupByLevel});
        })
        structuredSchedule.push({course: courseName,levels:groupByCourse});
    })
    return structuredSchedule;
}


//Main Conflict Checking functions
const isProfConflict = (classObjA,classObjB) => {
    const sameDay = isSameDay(classObjA,classObjB)?true:false;
    const sameProf = isSameProfessor(classObjA,classObjB)?true:false;
    const overlappingTime = isOverLapping(classObjA,classObjB)?true:false;
    return sameDay && sameProf && overlappingTime?true:false;
}

//conflict-checking building block functions
const isOverLapping = (classObjA,classObjB) => {
    const lowerLimA = classObjA.startTime.slot;
    const upperLimA = classObjA.endTime.slot;
    const lowerLimB = classObjB.startTime.slot;
    const upperLimB = classObjB.endTime.slot;
    // if(lowerLimA<= lowerLimB && upperLimA > lowerLimB) return true;
    // else if(lowerLimA >= lowerLimB && lowerLimA<upperLimB) return true;
    // else if(lowerLimA < lowerLimB && upperLimA > upperLimB) return true;
    // else if(lowerLimA >= upperLimB) return false;

    if(upperLimA <= lowerLimB || lowerLimA >= upperLimB) return false;
    else return true;
}

const isNSTP = (classObj)=>{
    if(classObj.subjCode == "NSTP1" || classObj.subjCode == "NSTP2") return true;
    else false;
}

const isSameRoom = (classObjA,classObjB) =>{
    const sameRoom = classObjA.room.room === classObjB.room.room ? true : false;
    const sameGym = classObjA.room.room != "gym" && classObjA.room.room != "gym" ? true : false;
    const sameOut = classObjA.room.room != "out" && classObjA.room.room != "out" ? true : false;
    return sameRoom && sameGym && sameOut ? true : false;
}

const isSameProfessor = (classObjA,classObjB) => {
    return classObjA.professor.name === classObjB.professor.name ? true : false;
}

const isSameDay = (classObjA,classObjB) => {
    return classObjA.day === classObjB.day ? true : false;
}

const isSameSection = (classObjA,classObjB) => {
    return classObjA.section === classObjB.section ? true : false;
}

const isSameF2F = (classObjA,classObjB) =>{
    return classObjA.session ==="f2f" && classObjB.session === "f2f" ? true : false;
}

const isLab = (classObj) => {
    switch(classObj.classType){
        case "lab":         //old
            return true;
        case "comp_lab":    //computer lab
            return true;
        case "culi_lab":    //culinary lab
            return true;
        case "hdwr_lab":    //hardware lab
            return true;
        case "ntwk_lab":    //networking lab/cisco lab
            return true;
        case "phys_lab":    //physics lab
            return true;
        case "chem_lab":    //chemistry lab
            return true;
        case "cserv_lab":   //computer system servicing lab
            return true;
        case "elec_lab":    //electronics lab
            return true;
        default:
            return false
    }
}

const isGym = (classObj) => {
    switch(classObj.classType){
        case "gym":
            return true;
        default:
            return false
    }
}

const isSameLevel = (classObjA,classObjB) => {
    return classObjA.level === classObjB.level ? true:false;
}

const hasTargetTimeAndDate = (classObj,targetTimeSlot, targetDay) => {
    return classObj.startTime.slot == targetTimeSlot && classObj.day === targetDay ? true : false;
}
//utility / last resort algos
const tabulateSchedule = (selectedSchedule) => {

}

const contingencyFunction = (fittestSched) => {

}