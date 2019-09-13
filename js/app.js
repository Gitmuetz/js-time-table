let model = {
    company: 'Mister Spex',
    name: '',
    salary: 0,
    list: [
        {
            day: '2019-08-20',
            startTime: 8,
            endTime: 17,
            breakDuration: 1
        },
        {
            day: '2019-08-25',
            startTime: 10,
            endTime: 21,
            breakDuration: 2
        },
        {
            day: '2019-08-29',
            startTime: 9,
            endTime: 15,
            breakDuration: 0.5
        }
    ]
};

let hours = 8.0;
let monthlySalary = 0;

const heading = document.querySelector('h1');
const nameField = document.querySelector('#TTNameSurname');
const salaryField = document.querySelector('#TTHourlyWage');
const appOutput = document.querySelector('#TTHours');
const monthlySalaryOutput = document.querySelector('#TTMonthlySalary');
const scrollContainer = document.querySelector('.tt-c-scrollContainer');
const ttDialog = document.querySelector('dialog');
const openDialogButton = document.querySelector('button.tt-button--opendialog');
const ttForm = document.querySelector('dialog form');

const calculate = () => {
    
    monthlySalary = hours * model.salary;
};

const convertListIntoTable = (acc, value) => {
    const hours = value.endTime - value.startTime - value.breakDuration;
    return `${acc}<tr><td>${value.day}</td><td>${hours} Hours</td></tr>`
}


const render = (model) => {
    const tableHTMLString = model.list.reduce(convertListIntoTable, '<table><tbody>') + '</tbody></table>';

    heading.innerText = `${model.company} Time Sheet ${model.name}`;
    nameField.value = model.name
    salaryField.value = model.salary
    appOutput.innerText = `${hours} Hours`;
    monthlySalaryOutput.innerText = `${monthlySalary} €`;



    scrollContainer.innerHTML = tableHTMLString;
};

const onNameFieldChanged = (event) => {
    const newName = event.target.value;
    model.name = newName;

    localStorage.setItem('myData', JSON.stringify(model))
    console.log(`name field was changed to ${newName}`);
    render(model);
};

const onSalaryFieldChanged = (event) => {
    const newSalary = event.target.value;
    model.salary = newSalary;

    localStorage.setItem('myData', JSON.stringify(model))
    console.log(`salary field was changed to ${newSalary}`);
    calculate();
    render(model);
};

const extractHour = time => parseInt(time.split(':')[0]);

const onDialogClosed = () => {
    const returnValue = ttDialog.returnValue;
    console.log(`Dialog was closed with ${returnValue}.`);
    if (returnValue !== 'add') {
        return;
    }

    const formData = new FormData(ttForm);
    const day = formData.get('TTDay');
    const breakDuration = extractHour(formData.get('TTBreak'));
    const startTime = extractHour(formData.get('TTStartTime'));
    const endTime = extractHour(formData.get('TTEndTime'));

    const newEntry = {
        day,
        startTime,
        endTime,
        breakDuration
    };

    console.log('Adding new timetable entry.');
    console.log(newEntry);

    model.list.push(newEntry);
    localStorage.setItem('myData', JSON.stringify(model))
    calculate();
    render(model);
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Hello, Mister Spex!');
    const myData = localStorage.getItem('myData')

    if(myData !== null) {
        model = JSON.parse(myData)
    }

    nameField.addEventListener('keyup', onNameFieldChanged);
    salaryField.addEventListener('keyup', onSalaryFieldChanged);
    openDialogButton.addEventListener('click', () => {
        ttDialog.showModal();
    });
    ttDialog.addEventListener('close', onDialogClosed);

    calculate();
    render(model);
});
