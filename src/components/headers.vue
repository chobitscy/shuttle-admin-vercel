<template>
    <div class="header">
        <div class="edge">
            <slot name="insert"/>
        </div>
        <div class="user">
            <slot name="search"/>
            <el-avatar @click.native="exit">{{getUser}}</el-avatar>
        </div>
    </div>
</template>

<script>
    export default {
        name: "headers",
        methods: {
            exit() {
                this.$confirm('此操作将退出账号, 是否继续?', '提示', {
                    confirmButtonText: '退出',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    localStorage.removeItem('token');
                    this.$message({
                        type: 'success',
                        message: '退出成功!'
                    });
                    this.$router.push('/login')
                }).catch(() => {
                });
            }
        },
        computed: {
            getUser() {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                return userInfo.name.substring(0, 2);
            }
        }
    }
</script>

<style scoped>

    .header {
        width: 100%;
        height: 60px;
        background-color: white;
        display: flex;
        justify-content: space-between;
        align-items: center
    }

    .user {
        margin-right: 15px;
        display: flex;
    }
</style>