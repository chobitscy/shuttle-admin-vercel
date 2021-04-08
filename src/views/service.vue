<template>
    <div class="right">
        <Headers>
            <div slot="insert" class="insert">
                <el-button icon="el-icon-plus" @click="dialogFormVisible = true"/>
            </div>
        </Headers>
        <div class="table">
            <el-table :data="services">
                <el-table-column
                        prop="id"
                        label="id"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称"
                        align="center">
                    <template slot-scope="scope">
                        <el-tag v-text="scope.row.name" effect="dark"/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="color"
                        label="颜色"
                        align="center">
                    <template slot-scope="scope">
                        <el-tag :color="scope.row.color" style="color: white">颜色</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="icon"
                        label="图标"
                        align="center">
                    <template slot-scope="scope">
                        <el-button :icon="scope.row.icon"></el-button>
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
            <el-pagination layout="prev, pager, next" :total="total" :page-size="9" class="pagination"
                           @current-change="currentChange"/>
            <el-dialog :visible.sync="dialogFormVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-plus"></i> 添加服务</span>
                </div>
                <div class="form-item">
                    <span>名称：</span>
                    <el-input v-model="insertFrom.name" suffix-icon="el-icon-tickets"/>
                </div>
                <div class="form-item">
                    <span>图标：</span>
                    <el-input v-model="insertFrom.icon" placeholder="请输入element icon类名">
                        <div slot="suffix" class="suffix">
                            <el-link icon="el-icon-link" :underline="false"
                                     href="https://element.eleme.io/#/zh-CN/component/icon" target="_blank"/>
                        </div>
                    </el-input>
                </div>
                <div class="form-item">
                    <span>颜色：</span>
                    <el-color-picker v-model="insertFrom.color"/>
                </div>
                <div class="form-item">
                    <el-button size="medium" type="success" @click="insert" plain>添加</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="dialogUpdateVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-edit"></i> 修改服务</span>
                </div>
                <div class="form-item">
                    <span>名称：</span>
                    <el-input v-model="updateFrom.name" suffix-icon="el-icon-tickets" @input="changeUpdateButton"/>
                </div>
                <div class="form-item">
                    <span>图标：</span>
                    <el-input v-model="updateFrom.icon" placeholder="请输入element icon类名" @input="changeUpdateButton">
                        <div slot="suffix" class="suffix">
                            <el-link icon="el-icon-link" :underline="false"
                                     href="https://element.eleme.io/#/zh-CN/component/icon" target="_blank"/>
                        </div>
                    </el-input>
                </div>
                <div class="form-item">
                    <span>颜色：</span>
                    <el-color-picker v-model="updateFrom.color" @change="changeUpdateButton"/>
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
    import {search} from "@/utils/api/user";
    import {deleteService, findAllService, insertService, updateService} from "@/utils/api/service";

    export default {
        name: "service",
        components: {Headers},
        data() {
            return {
                services: [],
                keyword: '',
                dialogFormVisible: false,
                dialogUpdateVisible: false,
                insertFrom: {
                    name: '',
                    color: '',
                    icon: '',
                },
                updateFrom: {
                    name: '',
                    color: '',
                    icon: '',
                },
                total: 0,
                page: 1,
                updateButton: true
            }
        },
        created() {
            const services = sessionStorage.getItem('services');
            if (services === null) this.getData(1);
            else this.services = JSON.parse(services)
        },
        methods: {
            getData(pageNo) {
                findAllService(pageNo).then(res => {
                    let data = res.data;
                    this.services = data.list;
                    this.total = data.total;
                    sessionStorage.setItem('services', JSON.stringify(data.list));
                })
            },
            insert() {
                if (!Object.values(this.insertFrom).every(v => !!v)) {
                    this.$message.error('不能有选项为空')
                } else {
                    insertService(this.insertFrom).then(res => {
                        if (res.code === 1) {
                            this.$message.success('添加成功');
                            this.load();
                            localStorage.removeItem('services');
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
                        h('span', null, '和相关数据, 是否继续?')
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        deleteService({'id': row.id}).then(res => {
                            if (res.code === 1) {
                                this.$message.success('删除成功');
                                this.load();
                                localStorage.removeItem('services');
                            } else this.$message.error('添加失败');
                        });
                    }
                ).catch(() => {
                });
            },
            update() {
                updateService(this.updateFrom).then(res => {
                    if (res.code === 1) {
                        this.$message.success('更新成功');
                        localStorage.removeItem('services');
                        this.load();
                    } else this.$message.error('更新失败');
                });
                this.dialogUpdateVisible = false;
            },
            search(keyword) {
                search({'keyword': keyword}).then(res => {
                    if (res.code === 1) this.services = res.data.list
                })
            },
            clickUpdate(row) {
                this.dialogUpdateVisible = true;
                this.updateFrom.id = row.id;
                this.updateFrom.name = row.name;
                this.updateFrom.color = row.color;
                this.updateFrom.icon = row.icon;
            },
            load() {
                this.services = this.getData(this.page);
            },
            currentChange(current) {
                this.page = current;
                this.services = this.getData({pageNo: current})
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

    .suffix {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 25px;
        height: 100%;
    }
</style>