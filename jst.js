let days =document.querySelectorAll("#days li")
let schedule = {
    "Понеділок":{classes: [],homework:{} },
    "Вівторок":{classes: [],homework:{} },
    "Середа":{classes: [],homework:{} },
    "Четвер":{classes: [],homework:{} },
    "Пятниця":{classes: [],homework:{} }

}

let cookies = document.cookie.split(";")

for (let i = 0; i<cookies.length;i+=1){

    let cookie = cookies[i].split("=")
    if (cookie[0] === "schedule"){
        schedule = JSON.parse(cookie[1])
        break
    }
}

function setCookie(name,value,days){
    let expires = ""
    if (days){
        let data = new Data()
        data.setTime(data.getTime()+(days * 24 * 60 * 60 * 1000))
        expires = "; expires =" +Date.toUTCString()

    }
    document.cookie =name +"="+(value || "")+expires +"; path=/"
}


days[i].addEventListener('click', function() {
    let selectedDay = days[i].innerHTML;
    highlightActiveDay(days[i]); // Підсвічуємо обраний день
    updateClassList(selectedDay); // Оновлюємо список занять
    updateHomeworkList(selectedDay); // Оновлюємо список домашніх завдань
    setupAddHomeworkButton(selectedDay); // Встановлюємо кнопку для додавання домашнього завдання
    setupAddClassButton(selectedDay); // Встановлюємо кнопку для додавання нового уроку
});



function highlightActiveDay(activeDay){

    for (let i = 0; i < days.length; i++) {
        days[i].classList.remove('active');
    }
    activeDay.classList.add('active');
}

function updateClassList(day){
    document.querySelector('#day-name').innerHTML = day; // Оновлюємо назву обраного дня
    let classList = document.querySelector('#classes');
    classList.innerHTML = '';
    let subjectSelect = document.querySelector('#subject-select');
    subjectSelect.innerHTML = '<option value="" disabled selected>Виберіть предмет</option>';
    for (let k = 0; k < schedule[day].classes.length; k++) {
        let classItem = schedule[day].classes[k];
        classList.innerHTML += `<li>${k + 1}. ${classItem}</li>`;
        let option = `<option value="${classItem}">${classItem}</option>`;
        subjectSelect.innerHTML += option;
    }
}


function updateHomeworkList(day){
    let homeworkList = document.querySelector('#homework-list');
    homeworkList.innerHTML = '';
    for (let subject in schedule[day].homework) {
        if (schedule[day].homework.hasOwnProperty(subject)) {
            let hw = schedule[day].homework[subject];
            let completed = hw.completed ? 'checked' : '';
            homeworkList.innerHTML += `<li><input type="checkbox"> ${subject}: ${hw.description}</li>`;
        }
    }
}

function setupAddHomeworkButton(day){
    let addHomeworkButton = document.querySelector('#add-homework');
    addHomeworkButton.onclick = function() {
        let selectedSubject = document.querySelector('#subject-select').value;
        let newHomework = document.querySelector('#new-homework').value;
        if (selectedSubject && newHomework) {
            schedule[day].homework[selectedSubject] = {
                description: newHomework,
                completed: false
            };
            updateHomeworkList(day);
            setCookie("schedule", JSON.stringify(schedule), 14);
            document.querySelector('#new-homework').value = '';
        }
    };
}

function setupAddClassButton(day){
    let addClassButton = document.querySelector('#add-class-button');
    addClassButton.onclick = function() {
        let newClass = document.querySelector('#new-class').value;
        if (newClass) {
            schedule[day].classes.push(newClass);
            updateClassList(day);
            document.querySelector('#new-class').value = '';
            setCookie("schedule", JSON.stringify(schedule), 14);
        }
    };
}