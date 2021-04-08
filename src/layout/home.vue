<template>
    <div class="container">
        <el-menu
                :default-active="activeIndex"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                style="height: 100%"
                router
                :collapse="$store.state.collapse"
                class="el-menu-vertical">
            <el-menu-item @click="$store.commit('changeCollapse')">
                <i :class="$store.state.collapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
                <span slot="title" v-text="$store.state.collapse?'展开':'收缩'"></span>
            </el-menu-item>
            <el-menu-item index="/user">
                <i class="el-icon-user"></i>
                <span slot="title">用户</span>
            </el-menu-item>
            <el-menu-item index="/service">
                <i class="el-icon-folder"></i>
                <span slot="title">服务</span>
            </el-menu-item>
            <el-menu-item index="/category">
                <i class="el-icon-menu"></i>
                <span slot="title">分类</span>
            </el-menu-item>
            <el-menu-item index="/store">
                <i class="el-icon-shopping-cart-1"></i>
                <span slot="title">商店</span>
            </el-menu-item>
            <el-menu-item index="/product">
                <i class="el-icon-goods"></i>
                <span slot="title">产品</span>
            </el-menu-item>
            <el-submenu>
                <template slot="title">
                    <i class="el-icon-tickets"></i>
                    <span>订单</span>
                </template>
                <el-menu-item index="/order/2">
                    <i class="el-icon-refresh"></i>
                    <span slot="title">全部</span>
                </el-menu-item>
                <el-menu-item index="/order/-1">
                    <i class="el-icon-loading"></i>
                    <span slot="title">待接单</span>
                </el-menu-item>
                <el-menu-item index="/order/0">
                    <i class="el-icon-shopping-cart-1"></i>
                    <span slot="title">配送中</span>
                </el-menu-item>
                <el-menu-item index="/order/1">
                    <i class="el-icon-check"></i>
                    <span slot="title">已完成</span>
                </el-menu-item>
            </el-submenu>
            <el-menu-item index="/comment">
                <i class="el-icon-chat-dot-round"></i>
                <span slot="title">评论</span>
            </el-menu-item>
            <el-menu-item index="/ads">
                <i class="el-icon-folder    "></i>
                <span slot="title">广告</span>
            </el-menu-item>
        </el-menu>
        <div class="content" :style="$store.state.collapse?'':'width:Calc(100% - 250px)'">
            <router-view/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "home",
        data() {
            return {
                activeIndex: this.$route.path,
            }
        }
    }
</script>

<style scoped>

    .container {
        display: flex;
        height: 100%;
        overflow-x: hidden;
    }

    .content {
         display: flex;
         flex-direction: column;
         height: 100%;
         width: 100%;
         background-color: #edeff2;
     }

    .el-menu-vertical:not(.el-menu--collapse) {
        width: 250px;
        min-height: 400px;
    }
</style>