<template>
    <div class="right">
        <Headers>
            <div slot="insert" class="insert">
                <el-button icon="el-icon-plus" @click="dialogFormVisible = true"/>
            </div>
            <div slot="search" class="edge">
                <el-input placeholder="请输入电话或昵称" prefix-icon="el-icon-search" v-model="keyword" @change="search"/>
            </div>
        </Headers>
        <div class="table">
            <el-table :data="users">
                <el-table-column
                        prop="id"
                        label="id"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="昵称"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="电话"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="地址"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="score"
                        label="点数"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="admin"
                        label="用户组"
                        align="center">
                    <template slot-scope="scope">
                        <el-tag v-text="scope.row['admin']?'管理员':'用户'" :type="scope.row['admin']?'success':''"
                                @click="changeAuthority(scope.row)" effect="dark"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="180"
                        align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" @click="clickUpdate(scope.row)">修改</el-button>
                        <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" class="pagination"
                           @current-change="currentChange"/>
            <el-dialog :visible.sync="dialogFormVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-plus"></i> 添加用户</span>
                </div>
                <div class="form-item">
                    <span>电话：</span>
                    <el-input v-model="userFrom.phone" suffix-icon="el-icon-phone" type="number"/>
                </div>
                <div class="form-item">
                    <span>昵称：</span>
                    <el-input v-model="userFrom.name" suffix-icon="el-icon-user"/>
                </div>
                <div class="form-item">
                    <span>地址：</span>
                    <el-input v-model="userFrom.address" suffix-icon="el-icon-school"/>
                </div>
                <div class="form-item">
                    <span>密码：</span>
                    <el-input v-model="userFrom.password" suffix-icon="el-icon-key"/>
                </div>
                <div class="form-item">
                    <span>重复：</span>
                    <el-input v-model="userFrom.rePassword" suffix-icon="el-icon-key"/>
                </div>
                <div class="form-item">
                    <el-button size="medium" type="success" @click="insert" plain>添加</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="dialogUpdateVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-edit"></i> 修改用户</span>
                </div>
                <div class="form-item">
                    <span>电话：</span>
                    <el-input v-model="infoFrom.phone" suffix-icon="el-icon-phone" @input="changeUpdateButton"/>
                </div>
                <div class="form-item">
                    <span>昵称：</span>
                    <el-input v-model="infoFrom.name" suffix-icon="el-icon-user" @input="changeUpdateButton"/>
                </div>
                <div class="form-item">
                    <span>地址：</span>
                    <el-input v-model="infoFrom.address" suffix-icon="el-icon-school" @input="changeUpdateButton"/>
                </div>
                <div class="form-item">
                    <el-button size="medium" type="warning" @click="update" plain :disabled="updateButton">修改
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Headers from "@/components/headers";
    import {admin, deleteUser, findAll, register, search, update} from "@/utils/api/user";

    export default {
        name: "user",
        components: {Headers},
        data() {
            return {
                users: [],
                keyword: '',
                dialogFormVisible: false,
                dialogUpdateVisible: false,
                userFrom: {
                    phone: '',
                    name: '',
                    address: '',
                    password: '',
                    rePassword: ''
                },
                infoFrom: {
                    id: '',
                    phone: '',
                    name: '',
                    address: ''
                },
                total: 0,
                page: 1,
                updateButton: true,
                pageSize: 0
            }
        },
        created() {
            const tableHeight = parseInt(localStorage.getItem('tableHeight'));
            this.pageSize = parseInt((tableHeight / 57).toString());
            this.getData(1);
        },
        methods: {
            getData(pageNo) {
                findAll(pageNo, this.pageSize).then(res => {
                    let data = res.data;
                    this.users = data.list;
                    this.total = data.total;
                })
            },
            insert() {
                if (!Object.values(this.userFrom).every(v => !!v)) {
                    this.$message.error('不能有选项为空')
                } else {
                    register(this.userFrom).then(res => {
                        if (res.code === 1) {
                            this.$message.success('添加成功');
                            this.load();
                        } else this.$message.error('添加失败');
                    });
                    this.dialogFormVisible = false;
                }
            },
            del(row) {
                const h = this.$createElement;
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [
                        h('span', null, '此操作将永久删除'),
                        h('span', {style: 'color: #f56c6c'}, row.name),
                        h('span', null, ', 是否继续?')
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        deleteUser({'id': row.id}).then(res => {
                            if (res.code === 1) {
                                this.$message.success('删除成功');
                                this.load()
                            } else this.$message.error('添加失败')
                        })
                    }
                ).catch(() => {

                });
            },
            update() {
                update(this.infoFrom).then(res => {
                    if (res.code === 1) {
                        this.$message.success('更新成功');
                        this.load();
                    } else this.$message.error('更新失败');
                });
                this.dialogUpdateVisible = false;
            },
            search(keyword) {
                search({'keyword': keyword}).then(res => {
                    if (res.code === 1) this.users = res.data.list;
                })
            },
            clickUpdate(row) {
                this.dialogUpdateVisible = true;
                this.infoFrom.id = row.id;
                this.infoFrom.phone = row.phone;
                this.infoFrom.name = row.name;
                this.infoFrom.address = row.address;
            },
            changeAuthority(row) {
                const h = this.$createElement;
                if (!row['admin']) {
                    this.$msgbox({
                        title: '提示',
                        message: h('p', null, [
                            h('span', null, '此操作将'),
                            h('span', {style: 'color: #409EFF'}, row.name),
                            h('span', null, '设为管理员, 是否继续?')
                        ]),
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        admin({userId: row.id}).then(res => {
                            if (res.code === 1) {
                                this.$message.success('设置管理员成功');
                                this.load();
                            } else this.$message.error('设置管理员失败');
                        })
                    }).catch(() => {
                    });
                }
            },
            load() {
                this.users = this.getData(this.page);
            },
            currentChange(current) {
                this.page = current;
                findAll(current, this.pageSize).then(res => {
                    this.users = res.data.list;
                })
            },
            changeUpdateButton() {
                this.updateButton = false
            }
        }
    }
</script>

<style scoped>
    .pagination {
        display: flex;
        justify-content: center;
    }

    .form-item {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
    }
</style>