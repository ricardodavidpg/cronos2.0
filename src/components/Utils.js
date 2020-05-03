export async function searchForIssues(searchCriteria, user, password) {
    const baseUrl = "https://www.ideasoft.biz/greenhopper/rest/api/2/search?";
    const init = {
        method: 'GET',
        headers: {"Authorization": "Basic " + btoa(user + ":" + password)},
        mode: "cors",
        cache: 'default'
    };

    const res = await fetch(buildUrl(baseUrl, searchCriteria.searchText), init);
    const resJson = await res.json();

    if (res.ok) {
        return resJson.issues;
    } else {
        throw new Error(res);
    }
}

function buildUrl(baseUrl, searchText) {
    let criteria = "jql=";

    if (searchText.match("[a-z]+\\-+[0-9]") || searchText.match("[A-Z]+\\-+[0-9]")) {
        criteria = criteria + "issuekey=" + searchText;//IssueKey
    }else{
        criteria = criteria + "(";
        criteria = criteria + "summary~" + searchText;//Summary
        criteria = criteria + ")";
        criteria = criteria + " AND project in (OM,OMPM,OMVIA,OMIPA)"; //Project
    }

    return baseUrl + criteria;
}

// const moment = require("moment");
// const syncClient = require('sync-rest-client');
// const prompts = require('prompts');
// const cron = require('node-cron');
// const notifier = require('node-notifier');
//
// let PLAY_SESSION;
//
// let now = new Date();
// let currentDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getUTCDate()}`;
// let currentUser;
// let currentPassword;
// let tasksStore = [];
// let lastMsg;
//
// function login(user, password) {
//     let payload = {"username": user, "password": password};
//     let res = syncClient.post('https://www.ideasoft.biz/cronos2/desktop/login', {
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         payload: payload,
//     });
//
//     if (res.statusCode === 200) {
//
//         currentUser = user;
//         currentPassword = password;
//
//         PLAY_SESSION = res.headers["set-cookie"][0].split(";").shift();
//
//         notifier.notify({
//             title: 'Cronos',
//             message: "Logueado como " + user
//         });
//         return true;
//     }
//
//     return false;
// }
//
// function logout() {
//     let res = syncClient.del('https://www.ideasoft.biz/cronos2/desktop/logout', {
//         headers: {Cookie: PLAY_SESSION}
//     });
//
//     if (res.statusCode === 200) {
//
//         PLAY_SESSION = res.headers["set-cookie"][0].split(";").shift();
//         return true;
//     }
//
//     return false;
// }
//
// function getJornal() {
//
//     while (true) {
//         let res = syncClient.get(`https://www.ideasoft.biz/cronos2/desktop/rest/ordenes/jvelazquez/${currentDate}`, {
//             headers: {Cookie: PLAY_SESSION}
//         });
//
//         let statusCode = res.statusCode;
//         switch (statusCode) {
//             case 200:
//             case 404:
//
//                 let body = res.body;
//
//                 return body.jornada || {tipoJornada: "0", orden: {fecha: currentDate, persona: currentUser, hechos: []}};
//
//             case 401:
//                 if (!login(currentUser, currentPassword)) {
//                     return false;
//                 }
//
//                 break;
//
//             default:
//                 return false;
//         }
//     }
// }
//
// function iterator(data) {
//
//     if (data.item) {
//         let item = data.item;
//         if (Array.isArray(item)) {
//             let result = [];
//             for (let i = 0; i < item.length; i++) {
//                 result = result.concat(iterator(item[i]));
//             }
//             return result;
//         } else if (item.allowDrag === true) {
//             return [{title: item.label, value: {code: item.code, summary: item.label}}]
//         } else {
//             return [];
//         }
//     } else {
//         return [{title: data.label, value: {code: data.code, summary: data.label}}];
//     }
// }
//
// function getRubros() {
//
//     while (true) {
//         let res = syncClient.get(`https://www.ideasoft.biz/cronos2/desktop/rest/rubros`, {
//             params: {
//                 sort: '[{"property":"leaf","direction":"ASC"}]',
//                 node: 'root'
//             },
//             headers: {Cookie: PLAY_SESSION, 'Content-Type': 'application/json'}
//         });
//
//         let statusCode = res.statusCode;
//
//         switch (statusCode) {
//             case 200:
//                 return iterator(res.body);
//             case 401:
//                 if (!login(currentUser, currentPassword)) {
//                     return false;
//                 }
//                 break;
//             default:
//                 lastMsg = `Error obteniendo rubros (${statusCode})`;
//                 return [];
//         }
//     }
// }
//
// function buildIssue(issueId) {
//
//     while (true) {
//
//         let res = syncClient.get(`https://www.ideasoft.biz/cronos2/desktop/rest/issues/${issueId}`, {
//             headers: {Cookie: PLAY_SESSION, 'Content-Type': 'application/json'}
//         });
//
//         let statusCode = res.statusCode;
//
//         switch (statusCode) {
//             case 200:
//
//                 let body = res.body;
//                 return {
//                     id: body.issue.key,
//                     summary: body.issue.summary
//                 };
//
//             case 401:
//                 if (!login(currentUser, currentPassword)) {
//                     return false;
//                 }
//                 break;
//             default:
//                 return false;
//
//         }
//     }
// }
//
// function printTasks() {
//
//     console.clear();
//     console.log(`Logueado como ${currentUser}`);
//
//     console.log("\n");
//
//     let acc = 0;
//
//     let idx = 0;
//
//     for (const x of tasksStore) {
//
//         console.log(`${idx++} - ${x.horaDesde} - ${x.horaHasta} => ${x.issueId || x.rubro} "${x.comentario || x.issueTitulo || ''}"`);
//
//         let date1 = moment(x.horaDesde, "HH:mm");
//         let date2 = moment(x.horaHasta, "HH:mm");
//
//         acc += Math.abs(date2.diff(date1, "minutes") / 60);
//     }
//
//     if (tasksStore.length > 0) {
//         console.log(`\nHoras registradas: ${acc.toFixed(2)}\n`);
//     }
//
//     lastMsg && console.log(`Último mensaje: ${moment().format("HH:mm")}: ${lastMsg}\n`);
//
// }
//
// function store(jornal) {
//
//     while (true) {
//
//         let res2 = syncClient.put(`https://www.ideasoft.biz/cronos2/desktop/rest/ordenes/${currentUser}/${currentDate}`, {
//             headers: {
//                 Accept: "*/*",
//                 Cookie: PLAY_SESSION,
//                 'Content-Type': 'application/json'
//             },
//             payload: jornal
//         });
//
//         let statusCode = res2.statusCode;
//
//         switch (statusCode) {
//             case 200:
//                 lastMsg = "Registros guardados...";
//                 return true;
//             case 401:
//                 if (!login(currentUser, currentPassword)) {
//                     return false;
//                 }
//                 break;
//             default:
//                 lastMsg = `Error persistiendo datos: ${statusCode}`;
//                 return false;
//         }
//     }
// }
//
// async function runner(baseIssue, jornal, initDate, initEndDate) {
//
//     let timeFormat = e => `${e.hour()}:${e.minute()}`
//
//     let keep = true;
//     let issue;
//
//     let currentDate = moment(initDate || new Date());
//     let startDate = timeFormat(currentDate);
//
//     while (keep) {
//
//         let selectIssue = await prompts({
//                 type: 'select',
//                 name: 'value',
//                 message: 'Seleccionar opción',
//                 choices: [
//                     {title: 'Usar issue', value: '1'},
//                     {title: 'Usar rubro', value: '2'},
//                     {title: 'Cancelar', value: '0'}
//                 ]
//             }
//         );
//
//         switch (selectIssue.value) {
//             case '1':
//
//                 let step4 = await prompts([
//                     {
//                         type: 'text',
//                         name: 'value',
//                         message: 'Ingresar incidente',
//                         validate: value => value.length > 0 ? true : "Dato inválido"
//                     }
//                 ]);
//
//                 issue = buildIssue(step4.value);
//                 if (issue) {
//                     baseIssue.issueId = issue.id;
//                     baseIssue.issueTitulo = issue.summary;
//                 }
//
//                 break;
//             case'2':
//
//                 let autoComplete = await prompts([
//                     {
//                         type: 'autocomplete',
//                         name: 'value',
//                         message: 'seleccionar rubro',
//                         choices: getRubros()
//                     }
//                 ]);
//
//                 baseIssue.rubro = autoComplete.value.code;
//                 baseIssue.comentario = autoComplete.value.summary;
//                 issue = true;
//
//                 break;
//             default:
//                 issue = false;
//                 keep = false;
//                 break;
//         }
//
//         if (issue) {
//             keep = false;
//         } else {
//             console.log(`Problema al generar issue. Revisar ID o nombre.`);
//         }
//     }
//
//     if (issue === false) {
//         return;
//     }
//
//     let endDate;
//
//     if (initEndDate) {
//         endDate = timeFormat(moment(initEndDate));
//     } else {
//
//         notifier.notify({
//             title: 'Cronos',
//             message: ["Tarea (", startDate, "): ", baseIssue.issueId || baseIssue.comentario].join("")
//
//         });
//
//         let task = cron.schedule('*/5 * * * *', function () {
//
//             notifier.notify({
//                 title: 'Cronos',
//                 message: [timeFormat(moment()), ": trabajando en ", (baseIssue.issueId || baseIssue.comentario)].join("")
//             });
//         }, {
//             scheduled: true
//         });
//
//         let keepWaitForTerminate = true;
//
//         while (keepWaitForTerminate) {
//
//             let tmp = await prompts([
//                 {
//                     type: 'toggle',
//                     name: 'value',
//                     message: 'Terminar tarea?',
//                     active: "Sí",
//                     inactive: "No"
//                 }]);
//
//             keepWaitForTerminate = !tmp.value;
//         }
//
//         task.destroy();
//
//         endDate = timeFormat(moment());
//     }
//
//     baseIssue.horaDesde = startDate;
//     baseIssue.horaHasta = endDate;
//     tasksStore.push(baseIssue);
//
//     store(jornal)
// }
//
// (async () => {
//
//     const step2 = await prompts([
//         {
//             type: 'text',
//             name: 'user',
//             message: 'Usuario',
//             validate: value => value.length > 0 ? true : "Dato inválido"
//         },
//         {
//             type: 'password',
//             name: 'password',
//             message: 'Contraseña',
//             validate: value => value.length > 0 ? true : "Dato inválido"
//         }
//     ]);
//
//     if (login(step2.user, step2.password)) {
//
//         let keepTask = true;
//
//         while (keepTask) {
//
//             let jornal = getJornal();
//             let tmp = jornal['orden'].hechos || [];
//             let array = Array.isArray(tmp) ? tmp : [tmp];
//
//             tasksStore = array.map(x => {
//                 delete x.id;
//                 return x;
//             });
//
//             jornal['orden'].hechos = tasksStore;
//
//             let baseIssue = {
//                 "issueId": undefined,
//                 "issueTitulo": undefined,
//                 "rubro": "",
//                 "comentario": "",
//                 "horaDesde": undefined,
//                 "horaHasta": undefined
//             };
//
//             printTasks();
//
//             let step3 = await prompts([
//                 {
//                     type: 'select',
//                     name: 'value',
//                     message: 'Seleccionar opción',
//                     choices: [
//                         {title: 'Comenzar tarea desde ahora', value: '1'},
//                         {title: 'Comenzar tarea desde la hora...', value: '2'},
//                         {title: 'Ingresar tarea con comienzo y fin', value: '4'},
//                         {title: 'Eliminar tarea', value: '3'},
//                         {title: 'Salir', value: "0"}
//                     ]
//                 }
//             ]);
//
//             if (step3.value === '1') {
//                 await runner(baseIssue, jornal, undefined);
//             } else if (step3.value === '4') {
//
//                 let startDate = await prompts({
//                     type: 'date',
//                     name: 'value',
//                     message: 'Ingresar comienzo',
//                     mask: 'HH:mm'
//                 });
//
//                 let endDate = await prompts({
//                     type: 'date',
//                     name: 'value',
//                     message: 'Ingresar fin',
//                     mask: 'HH:mm'
//                 });
//
//                 await runner(baseIssue, jornal, startDate.value, endDate.value);
//
//             } else if (step3.value === '2') {
//
//                 let date = await prompts({
//                     type: 'date',
//                     name: 'dateTime',
//                     message: 'Ingresar comienzo',
//                     mask: 'HH:mm'
//                 });
//
//                 await runner(baseIssue, jornal, date.dateTime);
//             } else if (step3.value === '3') {
//
//                 let lg = tasksStore.length;
//
//                 let index = await prompts({
//                     type: 'number',
//                     name: 'value',
//                     message: 'Seleccione tarea',
//                     validate: value => value >= 0 && value < lg ? true : `Índice inválido`
//                 });
//
//                 let val = parseInt(index.value);
//
//                 tasksStore = tasksStore.filter((x, idx) => idx !== val);
//                 jornal['orden'].hechos = tasksStore;
//                 store(jornal);
//             }
//
//             keepTask = jornal !== false && step3.value !== '0';
//         }
//     }
//
//     if (logout()) {
//         console.log("Deslogueado...")
//     } else {
//         console.log("Problema al desloguear...")
//     }
//
// })();
