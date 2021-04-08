<template>
    <div class="right">
        <Headers>
            <div slot="insert" class="insert">
                <el-button icon="el-icon-plus" @click="dialogFormVisible = true"/>
            </div>
        </Headers>
        <div class="table">
            <el-table :data="stores">
                <el-table-column
                        prop="id"
                        label="id"
                        align="center">
                </el-table-column>
                <el-table-column
                        label="图片"
                        align="center">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.image" :previewSrcList="[scope.row.image]" class="image"/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-text="scope.row.name" type="primary" size="mini"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="服务"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-text="scope.row.services.name" type="success" size="mini"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="类别"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-text="scope.row.category.name" type="info" size="mini"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="评分"
                        align="center">
                    <template slot-scope="scope">
                        <el-rate v-model="scope.row.rate" text-color="#ff9900" show-score disabled/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sales"
                        label="销量"
                        align="center">
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
                    <span><i class="el-icon-plus"></i> 添加商店</span>
                </div>
                <div class="form-item">
                    <span>名称：</span>
                    <el-input v-model="insertFrom.name" suffix-icon="el-icon-tickets"/>
                </div>
                <div class="form-item">
                    <span>图片：</span>
                    <el-input v-model="insertFrom.image" suffix-icon="el-icon-picture-outline"/>
                </div>
                <div class="form-item">
                    <span>服务：</span>
                    <el-select v-model="insertFrom.serviceId" placeholder="请选择服务">
                        <el-option v-for="service in services" :key="service.id" :label="service.name"
                                   :value="service.id"/>
                    </el-select>
                </div>
                <div class="form-item">
                    <span>类别：</span>
                    <el-select v-model="insertFrom.categoryId" placeholder="请选择类别">
                        <el-option v-for="category in categories" :key="category.id" :label="category.name"
                                   :value="category.id"/>
                    </el-select>
                </div>
                <div class="form-item">
                    <el-button size="medium" type="success" @click="insert" plain>添加</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="dialogUpdateVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-edit"></i> 修改商店</span>
                </div>
                <div class="form-item">
                    <span>名称：</span>
                    <el-input v-model="updateFrom.name" suffix-icon="el-icon-tickets" @input="changeUpdateButton"/>
                </div>

                <div class="form-item">
                    <span>图片：</span>
                    <el-input v-model="updateFrom.image" suffix-icon="el-icon-picture-outline"
                              @input="changeUpdateButton"/>
                </div>

                <div class="form-item">
                    <span>销量：</span>
                    <el-input v-model="updateFrom.sales" suffix-icon="el-icon-medal" @input="changeUpdateButton"
                              type="number"/>
                </div>

                <div class="form-item">
                    <span>服务：</span>
                    <el-select v-model="updateFrom.serviceId" placeholder="请选择服务" @change="changeUpdateButton">
                        <el-option v-for="service in services" :key="service.id" :label="service.name"
                                   :value="service.id"/>
                    </el-select>
                </div>

                <div class="form-item">
                    <span>类别：</span>
                    <el-select v-model="updateFrom.categoryId" placeholder="请选择类别" @change="changeUpdateButton">
                        <el-option v-for="category in categories" :key="category.id" :label="category.name"
                                   :value="category.id"/>
                    </el-select>
                </div>

                <div class="form-item">
                    <span>评分：</span>
                    <el-rate v-model="updateFrom.rate" text-color="#ff9900" show-score style="margin-right: 92px"
                             @change="changeUpdateButton"/>
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
    import {findAllService} from "@/utils/api/service";
    import {findAllStore, deleteStore, insertStore, updateStore} from "@/utils/api/store";
    import {findAllCategory} from "@/utils/api/category";

    export default {
        name: "store",
        components: {Headers},
        data() {
            return {
                stores: [],
                dialogFormVisible: false,
                dialogUpdateVisible: false,
                insertFrom: {
                    name: '',
                    image: null,
                    serviceId: null,
                    categoryId: null,
                },
                updateFrom: {
                    name: '',
                    image: null,
                    rate: null,
                    sales: null,
                    serviceId: null,
                    categoryId: null
                },
                total: 0,
                page: 1,
                services: [],
                categories: [],
                updateButton: true,
                pageSize: 3
            }
        },
        created() {
            const tableHeight = parseInt(localStorage.getItem('tableHeight'));
            this.pageSize = parseInt((tableHeight / 125).toString());
            this.getData();

            const categories = sessionStorage.getItem('categories');
            if (categories === null) this.getCategories();
            else this.categories = JSON.parse(categories);

            const services = sessionStorage.getItem('services');
            if (services === null) this.getService();
            else this.services = JSON.parse(services);
        },
        mounted() {
            const div = document.getElementsByClassName('table')[0];
            const tableHeight = window.getComputedStyle(div).getPropertyValue('height');
            this.pageSize = parseInt((parseInt(tableHeight) / 125).toString());
        },
        methods: {
            getData() {
                findAllStore(this.page, this.pageSize).then(res => {
                    let data = res.data;
                    this.stores = data.list;
                    this.total = data.total;
                })
            },
            getCategories() {
                findAllCategory(1, 9).then(res => {
                    this.categories = res.data
                })
            },
            getService() {
                findAllService(1).then(res => {
                    this.services = res.data.list
                })
            },
            insert() {
                if (!Object.values(this.insertFrom).every(v => !!v)) {
                    this.$message.error('不能有选项为空')
                } else {
                    insertStore(this.insertFrom).then(res => {
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
                        h('span', null, '和相关数据, 是否继续?')
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        deleteStore({'id': row.id}).then(res => {
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
                this.updateFrom.rate = (this.updateFrom.rate).toString();
                this.updateFrom.sales = (this.updateFrom.sales).toString();
                if (!Object.values(this.updateFrom).every(v => !!v)) {
                    this.$message.error('不能有选项为空')
                } else {
                    updateStore(this.updateFrom).then(res => {
                        if (res.code === 1) {
                            this.$message.success('更新成功');
                            this.load();
                        } else this.$message.error('更新失败');
                    });
                    this.dialogUpdateVisible = false;
                }
            },
            clickUpdate(row) {
                this.dialogUpdateVisible = true;
                this.updateFrom.id = row.id;
                this.updateFrom.name = row.name;
                this.updateFrom.rate = row.rate;
                this.updateFrom.image = row.image;
                this.updateFrom.sales = row.sales;
                this.updateFrom.serviceId = row.serviceId;
                this.updateFrom.categoryId = row.categoryId;
            },
            load() {
                this.getData(this.page, this.pageSize)
            },
            currentChange(current) {
                this.page = current;
                this.getData(current, this.pageSize)
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

    .image {
        width: 100px;
        height: 100px;
    }
</style>