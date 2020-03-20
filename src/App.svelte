<script>
    import SearchComponent from './components/SearchComponent.svelte';
    import CurrentIssueComponent from './components/CurrentIssueComponent.svelte';
</script>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
    <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
</head>

<body>
<div class="container is-fluid" >
    <div><h1 class="title is-1" align="center">Work time tracker</h1></div>
    <div class="columns is-desktop">
        <div class="column">
            <section class="section">
                <CurrentIssueComponent/>
            </section>
        </div>
        <div class="column">
            <section class="section">
                <SearchComponent/>
            </section>
        </div>
    </div>
</div>
</body>