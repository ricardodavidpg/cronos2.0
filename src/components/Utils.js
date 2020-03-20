export async function searchForIssues() {
    let input = new Request("https://www.ideasoft.biz/greenhopper/rest/api/2/search?jql=issuekey=OMPM-365 OR summary~titulo");
    const init = {
        method: 'GET',
        headers: {},
        mode:"cors",
        cache: 'default'
    };
    return await fetch(input, init);


    // const res = [
    //               {
    //                 "key": "OMPM-385",
    //                 "fields": {
    //                   "assignee": {
    //                     "key": "dcabrera",
    //                     "displayName": "Diego Cabrera"
    //                   },
    //                   "status": {
    //                     "name": "Released"
    //                   },
    //                   "summary": "Error en precios de ordenes de superlunes"
    //                 }
    //               },
    //               {
    //                 "key": "OMPM-387",
    //                 "fields": {
    //                   "assignee": {
    //                     "key": "dpereira",
    //                     "displayName": "David Pereira"
    //                   },
    //                   "status": {
    //                     "name": "ToResolve"
    //                   },
    //                   "summary": "Titulo de orden no se muestra correctamente en OE"
    //                 }
    //               },
    //               {
    //                 "key": "OMPM-395",
    //                 "fields": {
    //                   "assignee": {
    //                     "key": "lramirez",
    //                     "displayName": "Leandro Ramírez"
    //                   },
    //                   "status": {
    //                     "name": "InProgress"
    //                   },
    //                   "summary": "Se rompió todo"
    //                 }
    //               }
    //             ]
}