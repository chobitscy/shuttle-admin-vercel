<template>
    <router-view/>
</template>

<script>
    export default {
        name: 'App',
        created() {
            if (localStorage.getItem('tableHeight') === null) {
                const height = document.body.clientHeight;
                localStorage.setItem('tableHeight', (height - 160).toString());
            }
        }
    }
</script>

<style>
    @import "style/cover.css";
    @import "style/main.css";
    @import url('https://unpkg.com/element-ui/lib/theme-chalk/index.css');
</style>
