<script>
    let code = "";
    let summary = "";
    let start = "";
    let date = "";
    let isActiveTask = false;
    let registry = [];

    function handleTaskDrop(e) {
        var today = new Date();
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        if (isActiveTask) {
            if (confirm("There is a task already on course, do you want to end it?")) {
                registerTask(today);
            }
        }

        initNewTask(e,today);
    }

    function initNewTask(e, today) {
        code = e.dataTransfer.getData("issue");
        summary = e.dataTransfer.getData("summary");
        start = today.getHours() + ":" + today.getMinutes();
        isActiveTask = true;
    }

    function registerTask(today) {
        registry = [...registry,
            {
                code: code,
                summary: summary,
                start: start,
                end: today.getHours() + ":" + today.getMinutes(),
                date: date
            }
        ];
    }

    function handleRegistryFinish(e) {
        code = e.dataTransfer.getData("issue");
        summary = e.dataTransfer.getData("summary");

        var today = new Date();
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        start = today.getHours() + ":" + today.getMinutes();
    }

</script>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
    <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
</head>

<body>
<div class="box" draggable="true" on:dragover={(e)=>e.preventDefault()} on:drop={handleTaskDrop}>

    {#if isActiveTask}
        <article class="media">
            <div class="container">
                <h1 align="center" class="title is-2">{code}</h1>
                <h1 align="center" class="title is-3">{start}hs - {date}</h1>
                <h1 align="center" class="title is-5">{summary}</h1>
            </div>
        </article>
    {:else}
        <p class="is-fullwidth" align="center">Drop a task here to track it...</p>
    {/if}
</div>
<div>
    <table class="table is-fullwidth">
        <thead>
        <h3 class="title is-3">Registry</h3>
        <tr>
            <th><abbr title="Start">Start</abbr></th>
            <th><abbr title="End">End</abbr></th>
            <th><abbr title="Issue">Issue</abbr></th>
            <th><abbr title="Description">Description</abbr></th>
            <th><abbr title="Date">Date</abbr></th>
        </tr>
        </thead>
        <tbody>
        {#each registry as reg}
            <tr>
                <td>{reg.start}</td>
                <td>{reg.end}</td>
                <td>{reg.code}</td>
                <td>{reg.summary}</td>
                <td>{reg.date}</td>
            </tr>
        {/each}
        </tbody>
    </table>
</body>
