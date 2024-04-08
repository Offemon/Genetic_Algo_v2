//Classes Section. Builder Pattern implemented

// Rooms Class
class Rooms {
    constructor (roomArr){
        this.rooms = roomArr;
    }

    // Returns All rooms
    fetchAllRooms(){
        return this.rooms;
    }

    //returns an array of enabled Rooms
    fetchEnabledRooms(){
        return new Rooms(this.rooms.filter(room => room.status==="enabled"))
    }

    //returns an array of disabled Rooms
    fetchDisabledRooms(){
        return new Rooms(this.rooms.filter(room => room.status==="disabled"));
    }

    //returns an array based on room type. "comp_lab", "gym", "lec", or "cul_lab"
    fetchRoomsByType(type){
        return new Rooms(this.rooms.filter(room => room.type===type));
    }
}

//Professors Class
class Professors{
    constructor(professors){
        this.professors = professors
    }

    //returns an array of all Professors
    getProfessors(){
        return this.professors
    }

    //returns an array of all Full-Time Professors
    getFullTime(){
        return new Professors(this.professors.filter(professor => professor.employmentType === "full-time"));
    }

    //returns an array of all Part-time Professors
    getPartTime(){
        return new Professors(this.professors.filter(professor => professor.employmentType === "part-time"));
    }

    //returns an array of professors on a given day
    getByAvailability(day){
        return new Professors(this.professors.filter(professor => professor.availability.includes(day)));
    }

    //returns an array of professors on a given expertise
    getByExpertise(expertise){
        return new Professors(this.professors.filter(professor => professor.expertise.includes(expertise)));
    }

    //returns an array of professors on a given department
    getByDepartment(dep){
        return new Professors(this.professors.filter(professor => professor.department === dep));
    }
}

class Curricula {
    constructor(curricula){
        this.curricula = curricula;
    }

    getCurricula(){
        return this.curricula;
    }

    getBySchoolYear(sy){
        return new Curricula(this.curricula.filter(curriculum => curriculum.schoolYear===sy));
    }

    getByDepartment(department){
        return new Curricula(this.curricula.filter(curriculum => curriculum.department===department));
    }

    
}

// class Curricula {
//     constructor(curricula){
//         this.curricula = curricula;

//         //returns a single curriculum
//         this.getBySchoolYear = function (sy) {
//             fetchedCurriculum = true;
//             return new Curricula(this.curricula.filter(curriculum => curriculum.schoolYear===sy));
//         }

//         //returns an array of curricula
//         this.getByDepartment = function (department) {
//             fetchedCurricula = true;
//             return new Curricula(this.curricula.filter(curriculum => curriculum.department===department));
//         }

//         this.extractByLevel = function (level){
//             if(this.curricula.length!=1 && fetchedCurriculum==false){
//                 throw new Error("This method is only usable on a specific curriculum! Try using method 'getBySchoolYear' before using method 'extractByLevel'.");
//             }
//             if(level>=1 && level <=4){
//                 levelSelected = true;
//                 return new Curricula(this.curricula[0].contents[level-1].curricula);
//             }
//             else{
//                 console.log("Invalid level. Choose from 1 to 4")
//             }
//         }

//         this.extractSubjectsBySem = function() {
//             if(!levelSelected){
//                 throw new Error("asdf")
//             }
//         }
//     }

//     getCurricula(){
//         return this.curricula;
//     }
// }