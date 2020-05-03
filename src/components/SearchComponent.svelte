<script>
    import {searchForIssues} from './Utils.js';

    let searchText = "";

    function handleDrag(e) {
        e.dataTransfer.setData("issue", e.target.querySelector("#issue").innerText);
        e.dataTransfer.setData("summary", e.target.querySelector("#summary").innerText);
    }
</script>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
    <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
    <link rel="stylesheet" href="mybulma/css/mystyles.css"/>
</head>

<body>
<article class="panel is-primary">
    <p class="panel-heading">
        Search issues
    </p>
    <p class="panel-tabs">
        <a class="is-active">All</a>
        <a>Assigned to me</a>
        <a>Favorites</a>
    </p>
    <div class="panel-block">
        <p class="control has-icons-left">
            <input bind:value={searchText} class="input is-primary" type="text" placeholder="Search">
            <span class="icon is-left">
                <i class="fas fa-search" aria-hidden="true"></i>
            </span>
        </p>
    </div>
    {#if searchText.length > 2}
        {#await searchForIssues({searchText}, "dpereira", "93R3ida5")}
            <p align="center">Fetching Issues...</p>
        {:then issues}
            <table class="table is-hoverable is-fullwidth">
                <thead>
                <tr>
                    <th><abbr title="Issue">Issue</abbr></th>
                    <th><abbr title="Summary">Summary</abbr></th>
                    <th><abbr title="Assignee">Assignee</abbr></th>
                    <th><abbr title="Status">Status</abbr></th>
                </tr>

                </thead>
                <tbody>
                {#each issues as issue}
                    <tr draggable="true" on:dragstart={handleDrag}>
                        <td id="issue">{issue.key}</td>
                        <td id="summary">{issue.fields.summary}</td>
                        {#if issue.fields.assignee}
                            <td>{issue.fields.assignee.key}</td>
                        {:else}
                            <td></td>
                        {/if}
                        <td>{issue.fields.status.name}</td>
                    </tr>
                {/each}
                </tbody>
            </table>
        {:catch error}
            <p align="center">{error}Service call error...</p>
        {/await}
    {:else}
        <p align="center">Enter a search criteria...</p>
    {/if}
</article>
</body>
