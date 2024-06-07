"use strict";
import { userDepartment } from "./Main.js";
import { Rooms } from "./Classes.js";
import { time } from "./Timeslot.js";
export const getAllSubjects = (department,config) => {
    const activeSemester = config.semester;
    let allSubjects = [];
    let subjects;
    department.forEach(course=>{
        course.levels.forEach(level=>{
            let selectedLevel = level.level;
            if(activeSemester==1){
                subjects = level.assignedCurriculum.contents.find(level=>level.level==selectedLevel).firstSemester;
            }
            else if(activeSemester==2){
                subjects = level.assignedCurriculum.contents.find(level=>level.level==selectedLevel).secondSemester;
            }
            subjects.forEach(subject=>{
                allSubjects.push({department:userDepartment,course: course.courseName, level:selectedLevel,...subject});
            })
        })
    })
    return allSubjects;
}

export const assignProfessorToSubjects = (professors,allSubjects) => {
    let highestPriority;
    let contestingProfs;
    professors.forEach(professor=>{
        professor.priority = 1;
    });
    allSubjects.forEach(subject=>{
        let chosenProf = "";
        const qualifiedProfessors = professors.filter(prof=>prof.expertise.includes(subject.expertise_required));
        let partTimeProfs = qualifiedProfessors.filter(professor=>professor.employment_type=="part-time");
        let fullTimeProfs = qualifiedProfessors.filter(professor=>professor.employment_type=="full-time");
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

export const subjectSessionPrep = (subjectArray,config) => {                  //a function that attaches an assignment variable and session property based on its classType
    const implementation = config.sessionImplementation;
    let newsubjectArray = [];
    let series = 0;
    if(implementation === "hybrid"){
        subjectArray.forEach(subject=>{
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
            else if(subject.classType==="gym"){
                newsubjectArray.push({...subject,session:"f2f",duration:2,series:series});
                series++;
            }

            else if(isNSTP(subject)){
                newsubjectArray.push({...subject,session:"f2f",duration:3,series:series,subject_name:`Civic Welfare and Training Service ${subject.subject_code.slice(-1)}`, nstpType:"cwts"});
                series++;
                newsubjectArray.push({...subject,session:"f2f",duration:3,series:series,subject_name:`Reserve Officers' Training Corps ${subject.subject_code.slice(-1)}`, nstpType:"rotc"});
                series++;
            }
            else{
                newsubjectArray.push({...subject,session:"f2f",duration:3,series:series});
                series++;
            }
        })
    }
    if(implementation === "f2f"){
        subjectArray.forEach(subject=>{
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
            else if(subject.classType==="gym"){
                newsubjectArray.push({...subject,session:"f2f",duration:2,series:series, partition:"a"});
                series++;
            }
            else if(isNSTP(subject)){
                newsubjectArray.push({...subject,session:"f2f",duration:3,series:series,subject_name:`Civic Welfare and Training Service ${subject.subject_code.slice(-1)}`, nstpType:"cwts"});
                series++;
                newsubjectArray.push({...subject,session:"f2f",duration:3,series:series,subject_name:`Reserve Officers' Training Corps ${subject.subject_code.slice(-1)}`, nstpType:"rotc"});
                series++;
            }
            else{
                newsubjectArray.push({...subject,session:"f2f",duration:3,series:series, partition:"a"});
                series++;
            }
        })
    }
    if(implementation === "online"){
        subjectArray.forEach(subject=>{
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
            else if(subject.classType==="gym"){
                newsubjectArray.push({...subject,session:"sync",duration:2,series:series});
                series++;
            }
            else if(isNSTP(subject)){
                newsubjectArray.push({...subject,session:"sync",duration:3,series:series,subject_name:`Civic Welfare and Training Service ${subject.subject_code.slice(-1)}`, nstpType:"cwts"});
                series++;
                newsubjectArray.push({...subject,session:"sync",duration:3,series:series,subject_name:`Reserve Officers' Training Corps ${subject.subject_code.slice(-1)}`, nstpType:"rotc"});
                series++;
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
    const cwtsTargetDay = config.cwtsTargetDay;
    const cwtsTargetStartTime = time.find(slot=>slot.slot==config.cwtsTargetStartTime);
    const cwtsTargetEndTime = time.find(slot=>slot.slot==config.cwtsTargetStartTime+3);
    const rotcTargetDay = config.rotcTargetDay;
    const rotcTargetStartTime = time.find(slot=>slot.slot==config.rotcTargetStartTime);
    const rotcTargetEndTime = time.find(slot=>slot.slot==config.rotcTargetStartTime+3);

    let initialPopulation = [];
    let overAllSched = [];
    let sectionLevelSched = [];
    let timeSlot;
    let startTime;
    let endTime
    let currentCourse;
    let currentSection;
    let levelSched;
    let currentLevel;
    let currentDay;
    let chosenRoom;
    let sectionCounter;
    let sectionAlias="";
    let days = ["monday","tuesday","wednesday","thursday","friday","saturday"]
    for(let popCounter = 0; popCounter < popSize; popCounter++){
        overAllSched = [];
        departmentArray.forEach((course)=>{
            currentCourse = course.courseName;
            levelSched = [];
            course.levels.forEach((level)=>{
                currentLevel = level.level;
                level.sections.forEach((section)=>{
                    sectionCounter = 1;
                    sectionLevelSched = [];
                    currentSection = section;
                    prepdSubjectsArray.filter(subject=>subject.course == currentCourse).forEach(subject=>{
                        subject.assigned=false;
                    })
                    sectionAlias = assignSectionAlias(currentCourse,currentLevel,sectionCounter);
                    fisherYatesShuffler(days).forEach(day=>{
                        const maximumSchoolHoursPerDay = 7;
                        let totalDailyHour = 0;
                        currentDay = day;
                        let unassignedSubjects = prepdSubjectsArray.filter(subject=>subject.assigned==false && subject.level == currentLevel && subject.course == currentCourse);
                            
                        //Priorotize non async subjects with Part Time Professors
                        fisherYatesShuffler(unassignedSubjects.filter(subject=>subject.session!="async").filter(subject=>subject.professor.employment_type=="part-time").filter(subject=>subject.professor.availability.includes(currentDay))).forEach(subject=>{
                            if(totalDailyHour + subject.duration <= maximumSchoolHoursPerDay){
                                if(isNSTP(subject)){
                                    chosenRoom = "TBA"
                                    if(subject.nstpType==="cwts"){
                                        day = cwtsTargetDay;
                                        startTime = cwtsTargetStartTime;
                                        endTime = cwtsTargetEndTime
                                        subject.assigned = true;
                                        sectionLevelSched.push({...subject,section:currentSection,day:day,room:chosenRoom, startTime:startTime,endTime:endTime,sectionAlias:sectionAlias});
                                        totalDailyHour++;
                                    }
                                    else{
                                        day = rotcTargetDay;
                                        startTime = rotcTargetStartTime;
                                        endTime = rotcTargetEndTime
                                        subject.assigned = true;
                                        sectionLevelSched.push({...subject,section:currentSection,day:day,room:chosenRoom, startTime:startTime,endTime:endTime,sectionAlias:sectionAlias});
                                        totalDailyHour++;
                                    }
                                }
                                else{
                                    if(subject.session=="sync"){
                                        chosenRoom = "-"
                                    }
                                    else{
                                        chosenRoom = assignRoom(subject,roomsArray);
                                    }
                                    timeSlot = time[Math.floor(Math.random()*(time.length-11))].slot;
                                    startTime = time.find(slot=>slot.slot==timeSlot);
                                    endTime = time.find(slot=>slot.slot==(timeSlot+subject.duration));
                                    subject.assigned = true;
                                    sectionLevelSched.push({...subject,section:currentSection,day:day,room:chosenRoom, startTime:startTime,endTime:endTime,sectionAlias:sectionAlias});
                                    totalDailyHour++;
                                }
                            }
                        });
                        fisherYatesShuffler(unassignedSubjects.filter(subject=>subject.session!="async").filter(subject=>subject.professor.employment_type=="full-time").filter(subject=>subject.professor.availability.includes(currentDay))).forEach(subject=>{
                            if(totalDailyHour + subject.duration <= maximumSchoolHoursPerDay){
                                if(isNSTP(subject)){
                                    chosenRoom = "TBA"
                                    if(subject.nstpType==="cwts"){
                                        day = cwtsTargetDay;
                                        startTime = cwtsTargetStartTime;
                                        endTime = cwtsTargetEndTime
                                        subject.assigned = true;
                                        sectionLevelSched.push({...subject,section:currentSection,day:day,room:chosenRoom, startTime:startTime,endTime:endTime,sectionAlias:sectionAlias});
                                        totalDailyHour++;
                                    }
                                    else{
                                        day = rotcTargetDay;
                                        startTime = rotcTargetStartTime;
                                        endTime = rotcTargetEndTime
                                        subject.assigned = true;
                                        sectionLevelSched.push({...subject,section:currentSection,day:day,room:chosenRoom, startTime:startTime,endTime:endTime,sectionAlias:sectionAlias});
                                        totalDailyHour++;
                                    }
                                }
                                else{
                                    if(subject.session=="sync"){
                                        chosenRoom = "-"
                                    }
                                    else{
                                        chosenRoom = assignRoom(subject,roomsArray);
                                    }
                                    timeSlot = time[Math.floor(Math.random()*(time.length-11))].slot;
                                    startTime = time.find(slot=>slot.slot==timeSlot);
                                    endTime = time.find(slot=>slot.slot==(timeSlot+subject.duration));
                                    subject.assigned = true;
                                    sectionLevelSched.push({...subject,section:currentSection,day:day,room:chosenRoom, startTime:startTime,endTime:endTime,sectionAlias:sectionAlias});
                                    totalDailyHour++;
                                }
                            }
                        });
                        fisherYatesShuffler(unassignedSubjects.filter(subject=>subject.session=="async")).forEach(subject=>{
                            if(totalDailyHour + subject.duration <= maximumSchoolHoursPerDay){
                                chosenRoom="-";
                                timeSlot = time[Math.floor(Math.random()*(time.length-11))].slot;
                                startTime = time.find(slot=>slot.slot==timeSlot);
                                endTime = time.find(slot=>slot.slot==(timeSlot+subject.duration));
                                subject.assigned = true;
                                sectionLevelSched.push({...subject,section:currentSection,day:day,room:chosenRoom, startTime:startTime,endTime:endTime,sectionAlias:sectionAlias});
                                totalDailyHour++;
                            }
                        });
                        sectionCounter++;
                    });
                    overAllSched.push(...(sectionLevelSched.sort((a,b)=>a.series-b.series))); //sorting the section-level sched is important during the crossover operation
                });
            });
        });
        initialPopulation.push(overAllSched);
    }
    return initialPopulation;
}

const fitnessFunction = (approvedSchedArr,scheduleArray,config) => {        //this function evaluates the fitness of a single generated schedule - NEEDS CONSTANT REFINING
        const implementationType = config.sessionImplementation;
        // const nstpTargetDay = config.nstpTargetDay;
        // const nstpTargetStartTime = config.nstpTargetStartTime;
        // const cwtsTargetDay = config.cwtsTargetDay;
        // const cwtsTargetStartTime = config.cwtsTargetStartTime;
        // const rotcTargetDay = config.rotcTargetDay;
        // const rotcTargetStartTime = config.rotcTargetStartTime;
        const scheduleArrayLen = scheduleArray.length;
        let dominantClasses;
        //criterias:
        //NSTP classes should be on Saturdays and starts at 7am
        //No two or more classes of share the same classroom at the same time
        //No two or more classes of share the same professor at the same time
        //No two or more classes share or has overlapping time slot
        //this function should assign whether a single class is considered recessive or dominant
        let evaluatedSchedule;                          //an array that holds a variable for the fitness evaluation and the schedule that is being evaluated                     //a variable that is incremented if there are professors that are needed be 2 or more different classes at the same time
        const allClassesCount = scheduleArray.length;
        for(let currentClassIndex = 0; currentClassIndex< scheduleArrayLen; currentClassIndex++){ //loop through all subjects to assign a default trait value of "dominant"
            scheduleArray[currentClassIndex].trait = "dominant";
            scheduleArray[currentClassIndex].issues = [];
            // scheduleArray[currentClassIndex].conflictWith = [];
        }

        if(approvedSchedArr.length>0 || approvedSchedArr != null){
            let currentSubject;
            let subjectComparedTo;
            const approvedSchedArrLen = approvedSchedArr.length;
            for(let currApprovedSchedClassIndex = 0; currApprovedSchedClassIndex < approvedSchedArrLen; currApprovedSchedClassIndex++){
                currentSubject = approvedSchedArr[currApprovedSchedClassIndex];
                for(let schedArrIndex = 0; schedArrIndex < scheduleArrayLen; schedArrIndex++){
                    subjectComparedTo = scheduleArray[schedArrIndex];
                    
                    //check professor conflict
                    if(isProfConflict(currentSubject,subjectComparedTo)){
                        if(!subjectComparedTo.issues.includes("professor_conflict")) subjectComparedTo.issues.push("professor_conflict");
                        subjectComparedTo.trait = "recessive";

                    }
                    // check room conflict
                    if(isSameF2F(currentSubject,subjectComparedTo) && isSameDay(currentSubject,subjectComparedTo) && isSameRoom(currentSubject,subjectComparedTo) && isOverLapping(currentSubject,subjectComparedTo)){
                        if(!subjectComparedTo.issues.includes("room_conflict")) subjectComparedTo.issues.push("room_conflict");
                        subjectComparedTo.trait = "recessive";
                    }
                }
            }
        }

        
        for(let currentClassIndex = 0; currentClassIndex< scheduleArrayLen; currentClassIndex++){
            let currentSubject = scheduleArray[currentClassIndex];

            //check if PE and Lab subjects starts too late in the afternoon.
            if(isLab(currentSubject) || isGym(currentSubject)){
                if(currentSubject.startTime.slot > 16){
                    if(!currentSubject.issues.includes("late_start")) currentSubject.issues.push("late_start");
                    currentSubject.trait = "recessive";
                    
                }
            }
            if(currentSubject.trait == "dominant"){
                for(let comparedToIndex = currentClassIndex+1; comparedToIndex<scheduleArrayLen;comparedToIndex++){
                    let subjectComparedTo = scheduleArray[comparedToIndex]
                    if(!isNSTP(currentSubject) && !isNSTP(subjectComparedTo)){

                        // check if there are subjects contesting with NSTP time slot.
                        if(currentSubject.level==="first_year" && currentSubject.day === nstpTargetDay && currentSubject.startTime.slot>nstpTargetStartTime+3){
                            if(!currentSubject.issues.includes("NSTP_conflict")){
                                currentSubject.issues.push("NSTP_conflict");
                            }
                            currentSubject.trait = "recessive";
                        }

                        //check if 2 partition of the same subjects are on the same day for a specific section when the implemented session type is set to f2f.
                        if(implementationType === "f2f" && isSameDay(currentSubject,subjectComparedTo) && isSameSection(currentSubject,subjectComparedTo) && isSameSubject(currentSubject,subjectComparedTo)){
                            if(!subjectComparedTo.issues.includes("sameday_partition")) subjectComparedTo.issues.push("sameday_partition");
                            subjectComparedTo.trait = "recessive";
                        }
                        //check time conflict
                        if(isSameDay(currentSubject,subjectComparedTo) && isSameSection(currentSubject,subjectComparedTo) && isOverLapping(currentSubject,subjectComparedTo)){
                            if(!subjectComparedTo.issues.includes("time_conflict")) subjectComparedTo.issues.push("time_conflict");
                            subjectComparedTo.trait = "recessive";
                        }
                        //check professor conflict
                        if(isProfConflict(currentSubject,subjectComparedTo)){
                            if(!subjectComparedTo.issues.includes("professor_conflict")) subjectComparedTo.issues.push("professor_conflict");
                            subjectComparedTo.trait = "recessive";
                        }
                        // check room conflict
                        if(isSameF2F(currentSubject,subjectComparedTo) && isSameDay(currentSubject,subjectComparedTo) && isSameRoom(currentSubject,subjectComparedTo) && isOverLapping(currentSubject,subjectComparedTo)){
                            if(!subjectComparedTo.issues.includes("room_conflict")) subjectComparedTo.issues.push("room_conflict");
                            subjectComparedTo.trait = "recessive";
                        }
                    }

                    //NSTP Checker
                    // if(isNSTP(currentSubject) && currentSubject.day!==nstpTargetDay){
                    //     if(!currentSubject.issues.includes("missed_nstp_target_day")) currentSubject.issues.push("missed_nstp_target_day");
                    //     currentSubject.trait = "recessive";
                    // }
                    // if(isNSTP(currentSubject) && currentSubject.startTime.slot!==nstpTargetStartTime){
                    //     if(!currentSubject.issues.includes("missed_nstp_target_day")) currentSubject.issues.push("missed_nstp_target_day");
                    //     currentSubject.trait = "recessive";
                    // }
                    // if(isNSTP(currentSubject) && !isNSTP(subjectComparedTo)){
                    //     if(isOverLapping(currentSubject,subjectComparedTo) && isSameLevel(currentSubject,subjectComparedTo)){
                    //         subjectComparedTo.trait = "recessive";
                    //     }
                    // }
                    // CWTS Checker
                    // if(isCWTS(currentSubject)){
                    //     if(currentSubject.day!==cwtsTargetDay){
                    //         if(!currentSubject.issues.includes("missed_cwts_target_day")) currentSubject.issues.push("missed_cwts_target_day");
                    //         currentSubject.trait = "recessive";
                    //     }
                    //     if(currentSubject.startTime.slot!==cwtsTargetStartTime){
                    //         if(!currentSubject.issues.includes("missed_cwts_target_start_time")) currentSubject.issues.push("missed_cwts_target_start_time");
                    //         currentSubject.trait = "recessive";
                    //     }
                    //     if(!isNSTP(subjectComparedTo)){
                    //         if(isOverLapping(currentSubject,subjectComparedTo) && isSameLevel(currentSubject,subjectComparedTo)){
                    //             subjectComparedTo.trait = "recessive";
                    //         }
                    //     }
                    // }


                    // //ROTC Checker
                    // else if(isROTC(currentSubject)){
                    //     if(currentSubject.day!==rotcTargetDay){
                    //         if(!currentSubject.issues.includes("missed_rotc_target_day")) currentSubject.issues.push("missed_rotc_target_day");
                    //         currentSubject.trait = "recessive";
                    //     }
                    //     if(currentSubject.startTime.slot!==rotcTargetStartTime){
                    //         if(!currentSubject.issues.includes("missed_rotc_target_start_time")) currentSubject.issues.push("missed_rotc_target_start_time");
                    //         currentSubject.trait = "recessive";
                    //     }
                    //     if(!isNSTP(subjectComparedTo)){
                    //         if(isOverLapping(currentSubject,subjectComparedTo) && isSameLevel(currentSubject,subjectComparedTo)){
                    //             subjectComparedTo.trait = "recessive";
                    //         }
                    //     }
                    // }

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

const evaluatePopulation = (approvedSchedArr,schedPopulation,config) => {   //this function evaluates an entire generated population of schedules and returns a spreaded classes with fitness values attached to each schedule
    let evaluatedPopulation = [];
    let schedPopulationLen = schedPopulation.length;
    // schedPopulation.forEach(sched=>{
    //     evaluatedPopulation.push(fitnessFunction(approvedSchedArr,sched,config));
    // })
    for(let schedIndex = 0; schedIndex<schedPopulationLen;schedIndex++){
        evaluatedPopulation.push(fitnessFunction(approvedSchedArr,schedPopulation[schedIndex],config))
    }
    return evaluatedPopulation;
}

const crossOverFunction = (schedule,stagnationCounter,approvedSchedArr,config) => {           //this function splices the genomes of the best schedule - 2 at a time
    let crossOveredSched = [];
    //Eugenics Operator
    if(stagnationCounter%50===0 && stagnationCounter > 0){
        let bestHalfArr = [];
        let bestHalfArrLength = 0;
        let sortedSchedArray = evaluatePopulation(approvedSchedArr,schedule,config).sort((a,b)=>b.fitness-a.fitness);
        let bestHalf = sortedSchedArray.slice(0,sortedSchedArray.length/2);
        bestHalf.forEach(evaluatedSched=>{      // the first half of the new population will the be the best half of the previous population
            crossOveredSched.push(evaluatedSched.schedule);
        })
        bestHalfArr=bestHalf.map(evaluatedSched=>evaluatedSched.schedule);
        bestHalfArrLength = bestHalfArr.length;
        for(let schedCurrentIndex = 0;schedCurrentIndex<bestHalfArrLength;schedCurrentIndex+=2){     //this loop will generate a new population but the dominant traits are in favor of Parent A
            let parentA = bestHalfArr[schedCurrentIndex];
            let parentB = bestHalfArr[schedCurrentIndex+1];
            let parentALen = parentA.length;
            let offSpringSchedule = [];
            for(let classCurrentIndex=0;classCurrentIndex<parentALen;classCurrentIndex++){
                if(parentA[classCurrentIndex].trait=="dominant"){
                    offSpringSchedule.push(parentA[classCurrentIndex]);
                }
                else{
                    offSpringSchedule.push(parentB[classCurrentIndex]);
                }
            }
            crossOveredSched.push(offSpringSchedule);
        }
    
        for(let schedCurrentIndex = 0;schedCurrentIndex<bestHalfArrLength;schedCurrentIndex+=2){     //this loop will generate a new population but the dominant traits are in favor of Parent B
            let parentA = bestHalfArr[schedCurrentIndex];
            let parentB = bestHalfArr[schedCurrentIndex+1];
            let parentBLen = parentB.length;
            let offSpringSchedule = [];
            for(let classCurrentIndex=0;classCurrentIndex<parentBLen;classCurrentIndex++){
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
        let firstHalf = evaluatePopulation(approvedSchedArr,schedule.slice(0,midIndex),config).sort((a,b)=>b.fitness-a.fitness).map(sched=>sched.schedule);
        let secondHalf = evaluatePopulation(approvedSchedArr,schedule.slice(midIndex),config).sort((a,b)=>a.fitness-b.fitness).map(sched=>sched.schedule);
        const firstHalfLen = firstHalf.length;
        // const secondHalfLen = secondHalf.length;

        for(let schedCurrentIndex = 0; schedCurrentIndex < firstHalfLen; schedCurrentIndex++){
            let parentA = firstHalf[schedCurrentIndex];
            let parentB = secondHalf[schedCurrentIndex];
            let parentALen = parentA.length;
            let parentBLen = parentB.length;
            offSpringSchedule = [];
            for(let classCurrentIndex = 0; classCurrentIndex < parentALen; classCurrentIndex++){
                if(parentA[classCurrentIndex].trait=="dominant"){
                    offSpringSchedule.push(parentA[classCurrentIndex]);
                }
                else{
                    offSpringSchedule.push(parentB[classCurrentIndex]);
                }
            }
            crossOveredSched.push(offSpringSchedule);
            offSpringSchedule=[];
            for(let classCurrentIndex = 0; classCurrentIndex < parentBLen; classCurrentIndex++){
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
    return evaluatePopulation(approvedSchedArr,crossOveredSched,config).sort((a,b)=>b.fitness-a.fitness);
}

const mutationFunction = (schedPopulation,roomsArray,professors,config) => {                    //[WORK IN PROGRESS]this function enables a schedule to reroll some of it's recessive genomes
    const mutationProb = config.mutationProbability;
    const enableReassign = config.enableProfessorReassignment;
    const enableVarProf = config.enableVariedProfessors;
    let selectedClass;
    schedPopulation.forEach(selectedSched=>{
        const selectedSchedLength = selectedSched.length
        for(let selectedClassIndex = 0; selectedClassIndex < selectedSchedLength; selectedClassIndex++){
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
                        let chosenRoom;
                        chosenRoom = assignRoom(selectedClass,roomsArray)
                        selectedClass.room = chosenRoom;
                    }

                }
                //reroll day
                if((Math.random() < mutationProb)){
                    let days = ["monday","tuesday","wednesday","thursday","friday","saturday"]
                    let currentDay = selectedClass.day;
                    let assignedProfAvailability = selectedClass.professor.availability;
                    if(selectedClass.professor!=="TBA"){
                        if (assignedProfAvailability.length > 1){
                            let newDay = assignedProfAvailability.filter(day=> day!= currentDay);
                            selectedClass.day = fisherYatesShuffler(newDay)[0];
                        }
                        else{
                        }
                    }
                    else{
                        selectedClass.day = fisherYatesShuffler(days)[0];
                    }
                }
                //reroll Professor
                if((Math.random() < mutationProb) && enableReassign && (selectedClass.issues.includes("professor_conflict"))){
                    let subject_code = selectedClass.subject_code;
                    let section = selectedClass.sectionAlias;
                    let classDay = selectedClass.day;
                    let requiredExpertise = selectedClass.expertise_required;
                    let classesAffected;
                    if(enableVarProf){
                        classesAffected = selectedSched.filter(selectedClasses => selectedClasses.subject_code == subject_code && selectedClasses.sectionAlias === section);
                    }
                    else{
                        classesAffected = selectedSched.filter(selectedClasses => selectedClasses.subject_code == subject_code);
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
                        let currentlyAssignedProf = selectedClass.professor.fullname;
                        qualifiedProfessors = professors.filter(prof=>prof.expertise.includes(requiredExpertise) && prof.availability.includes(classDay));
                        if(qualifiedProfessors.length>1){
                            chosenProf = fisherYatesShuffler(qualifiedProfessors.filter(prof=>prof.fullname!==currentlyAssignedProf))[0];
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

const generationLoop = (approvedSchedArr,initialPopulation,roomsArray,professors,config) => {   //[WORK IN PROGRESS - Mutation Function not yet Implemented]this function will perform the crossover functions and mutations to generate a new generation of schedules.
    const generationCount = config.maxGenerations;
    let newGeneration = initialPopulation;
    let fittestSched = evaluatePopulation(approvedSchedArr,newGeneration,config).sort((a,b)=>b.fitness-a.fitness)[0];
    let stagnationCounter = 0
    for(let generationCounter = 0; generationCounter < generationCount; generationCounter++){
        let currentGeneration = crossOverFunction(newGeneration,stagnationCounter,approvedSchedArr,config).sort((a,b)=>b.fitness-a.fitness);
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
        newGeneration = evaluatePopulation(approvedSchedArr,mutationFunction(newGeneration,roomsArray,professors,config),config).map(sched=>sched.schedule);
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

export const geneticAlgorithm = (roomsArray,department,prepdSubjects,approvedSchedArr,professors,config) => {     //[WORK IN PROGRESS]this is hte Main Genetic Algorithm function
    let initPopArray = initializePopulation(prepdSubjects,roomsArray,department,config);
    let fittestSched = generationLoop(approvedSchedArr,initPopArray,roomsArray,professors,config);
    return fittestSched.schedule;
}

//utility/non-GA functions section
const addProfessorDailyLoad = (professorsArray) => {            //a function that attaches a variable to hold the number of time that a professor can spend per day and a variable to hold a priority value

}

const fisherYatesShuffler = (array) => {                        //a function that uses Fisher-Yates algorithm to shuffle an array
    const arrLen = array.length
    for (let i = arrLen-1; i> 0; i--){
        const randomIndex = Math.floor(Math.random()*(i+1));
        [array[i],array[randomIndex]]=[array[randomIndex],array[i]]
    }
    return array;
}

export const constructGroupingsbyDepartment = (department,overallSchedArray,config) => {
    let activeSem = "";
    if(config.semester===1){
        activeSem = "1st Semester";
    }
    else if(config.semester===2){
        activeSem = "2nd Semester";
    }
    let structuredSchedule = [];
    department.forEach(course=>{
        let courseName = course.courseName;
        let groupByCourse = [];
        course.levels.forEach(level=>{
            let levelName = level.level;
            let groupByLevel = [];
            level.sections.forEach(section=>{
                groupByLevel.push({sectionName:section,semester:activeSem ,classes: overallSchedArray.filter(classGroup=>classGroup.section===section)});
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

    if(upperLimA <= lowerLimB || lowerLimA >= upperLimB) return false;
    else return true;
}

const isNSTP = (classObj)=>{
    return classObj.subject_code == "NSTP1" || classObj.subject_code == "NSTP2";
}

const isSameRoom = (classObjA,classObjB) =>{
    const sameRoom = classObjA.room.room_no === classObjB.room.room_no ? true : false;
    const bothNotGym = classObjA.room != "gym" && classObjB.room != "gym" ? true : false;
    const bothNotOutdoor = classObjA.room != "TBA" && classObjB.room != "TBA" ? true : false;
    return sameRoom && bothNotGym && bothNotOutdoor ? true : false;
}

const isSameProfessor = (classObjA,classObjB) => {
    return classObjA.professor.fullname === classObjB.professor.fullname ? true : false;
}

const isSameDay = (classObjA,classObjB) => {
    return classObjA.day === classObjB.day ? true : false;
}

const isSameSection = (classObjA,classObjB) => {
    // return classObjA.section === classObjB.section ? true : false;
    return classObjA.sectionAlias === classObjB.sectionAlias ? true : false;
}

const isSameF2F = (classObjA,classObjB) =>{
    return classObjA.session ==="f2f" && classObjB.session === "f2f" ? true : false;
}

const isSameSubject = (classObjA,classObjB) => {
    return classObjA.subject_code === classObjB.subject_code ? true : false;
}

const isLab = (classObj) => {
    switch(classObj.classType){
        case "lab":         //old
            return true;
        case "computer_lab":    //computer lab
            return true;
        case "culinary_lab":    //culinary lab
            return true;
        case "hardware_lab":    //hardware lab
            return true;
        case "networking_lab":    //networking lab/cisco lab
            return true;
        case "physics_lab":    //physics lab
            return true;
        case "chemistry_lab":    //chemistry lab
            return true;
        case "computerservicing_lab":   //computer system servicing lab
            return true;
        case "electronics_lab":    //electronics lab
            return true;
        default:
            return false
    }
}

const assignRoom = (classObj,roomsArray) => {
    let roomsToBeUsed = new Rooms(roomsArray);
    let roomsPool = [];
    // switch(classObj.classType.slice(-3)){ // this needs to have its own function
    //     case "lec":
    //         roomsPool = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType(classObj.classType).rooms;
    //         return roomsPool[Math.floor(Math.random()*(roomsPool.length-1))];
    //     case "lab":
    //         roomsPool = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType(classObj.classType).rooms;
    //         return roomsPool[Math.floor(Math.random()*(roomsPool.length-1))];
    //     case "gym":
    //         roomsPool = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType(classObj.classType).rooms;
    //         return roomsPool[Math.floor(Math.random()*(roomsPool.length-1))];
    //     case "outdoor":
    //         return "TBA";
    //     default:
    //         return "TBA";
    // }
    try {
        roomsPool = roomsToBeUsed.fetchEnabledRooms().fetchRoomsByType(classObj.classType).rooms;
        if(roomsPool.length===0){
            return "TBA"
        }
        else{
            return roomsPool[Math.floor(Math.random()*(roomsPool.length-1))];
        }
    } catch (error) {
        return "TBA"
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

const isROTC = (classObj) => {
    if(isNSTP(classObj)){
        return classObj.nstpType === "rotc";
    }
    else return false;
}

const isCWTS = (classObj) => {
    if(isNSTP(classObj)){
        return classObj.nstpType === "cwts";
    }
    else return false;
}

export const checkForConflicts = (schedArr,editedClassObj) => {
    let conflictSubjects = [];
    schedArr.forEach(selectedClassObj => {
        let hasConflict = false;
        if(!isSameSection(selectedClassObj,editedClassObj) && !isSameSubject(selectedClassObj,editedClassObj)){

            //check time conflict
            if(isSameDay(selectedClassObj,editedClassObj) && isSameSection(selectedClassObj,editedClassObj) && isOverLapping(currentSubject,editedClassObj)){
                hasConflict = true;
            }

            //check professor conflict
            if(isProfConflict(selectedClassObj,editedClassObj)){
                hasConflict = true;
            }

            // check room conflict
            if(isSameF2F(selectedClassObj,editedClassObj) && isSameDay(selectedClassObj,editedClassObj) && isSameRoom(selectedClassObj,editedClassObj) && isOverLapping(selectedClassObj,editedClassObj)){
                hasConflict = true;
            }

            //adds the classes that are in conflict with the edited classes
            if(hasConflict===true){
                conflitSubjects.push(selectedClassObj);
            }
        }
    })
    return conflictSubjects; //if the contents of this array is one or more, the edited subject as a conflict with active/approved sched. Else, it has no conflict
}

export const fetchData = async (jsonData) => {
    try{
        const response = await fetch(jsonData);
        return await response.json();
    }
    catch(error){
        console.log(error)
        return [];
    }

}

const assignSectionAlias = (course, level, sectionCounter) => {
    return course+"-"+level+"-"+sectionCounter;
}

//utility / last resort algos
const tabulateSchedule = (selectedSchedule) => {

}

const contingencyFunction = (fittestSched) => {

}