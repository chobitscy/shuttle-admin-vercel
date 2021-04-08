<template>
    <div class="right">
        <Headers>
            <div slot="insert" class="insert">
                <el-button icon="el-icon-plus" @click="dialogInsertVisible = true"/>
            </div>
        </Headers>
        <div class="table">
            <el-table :data="ads">
                <el-table-column
                        prop="id"
                        label="id"
                        align="center">
                </el-table-column>
                <el-table-column
                        label="图片"
                        align="center">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.image" class="image" :preview-src-list="[scope.row.image]"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="商店"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-text="scope.row.storeId" type="success" size="mini"/>
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
            <el-dialog :visible.sync="dialogUpdateVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-edit"></i> 修改订单</span>
                </div>
                <div class="form-item">
                    <span>图片：</span>
                    <el-input v-model="updateFrom.image" suffix-icon="el-icon-picture-outline"/>
                </div>
                <div class="form-item">
                    <span>商店：</span>
                    <el-input v-model="updateFrom.storeId" suffix-icon="el-icon-shopping-cart-1"/>
                </div>

                <div class="form-item">
                    <el-button size="medium" type="warning" @click="update" plain :disabled="updateButton">修改
                    </el-button>
                </div>
            </el-dialog>

            <el-dialog :visible.sync="dialogInsertVisible" width="350px" center>
                <div slot="title">
                    <span>添加广告</span>
                </div>

                <div class="form-item">
                    <span>图片：</span>
                    <el-input v-model="insertFrom.image" suffix-icon="el-icon-picture-outline" placeholder="图片链接"/>
                </div>

                <div class="form-item">
                    <span>商店：</span>
                    <el-input v-model="insertFrom.storeId" suffix-icon="el-icon-shopping-cart-1" placeholder="商店id"/>
                </div>

                <div class="form-item">
                    <span>过期：</span>
                    <el-input v-model="insertFrom.expired" type="number" suffix-icon="el-icon-time" placeholder="单位：天"/>
                </div>

                <div class="form-item">
                    <el-button size="medium" type="success" @click="insert" plain>添加</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Headers from "@/components/headers";
    import {deleteAds, findAllAds, insertAds, updateAds} from "@/utils/api/ads";

    export default {
        name: "ads",
        components: {Headers},
        props: ['status'],
        data() {
            return {
                ads: [],
                dialogUpdateVisible: false,
                updateFrom: {
                    id: null,
                    image: null,
                    storeId: null
                },
                total: 0,
                page: 1,
                pageSize: null,
                updateButton: true,
                dialogInsertVisible: false,
                insertFrom: {
                    image: null,
                    storeId: null
                }
            }
        },
        created() {
            const tableHeight = parseInt(localStorage.getItem('tableHeight'));
            this.pageSize = parseInt((tableHeight / 125).toString());
            this.getData();
        },
        methods: {
            getData() {
                findAllAds().then(res => {
                    let data = res.data;
                    this.ads = data;
                })
            },
            del(row) {
                const h = this.$createElement;
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [
                        h('span', null, '此操作将永久删除广告'),
                        h('span', {style: 'color: #f56c6c'}, row.id),
                        h('span', null, ', 是否继续?')
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        deleteAds({'id': row.id}).then(res => {
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
                updateAds(this.updateFrom).then(res => {
                    if (res.code === 1) {
                        this.$message.success('更新成功');
                        this.load();
                    } else this.$message.error('更新失败');
                });
                this.dialogUpdateVisible = false;
            },
            clickUpdate(row) {
                this.dialogUpdateVisible = true;
                this.updateFrom.id = row.id;
                this.updateFrom.image = row.image;
                this.updateFrom.storeId = row.storeId;
            },
            load() {
                this.ads = this.getData(this.page)
            },
            currentChange(current) {
                this.page = current;
                this.getData(current);
            },
            insert() {
                if (!Object.values(this.insertFrom).every(v => !!v)) {
                    this.$message.error('不能有选项为空')
                } else {
                    insertAds(this.insertFrom).then(res => {
                        if (res.code === 1) {
                            this.$message.success('添加成功！');
                            this.dialogInsertVisible = false;
                            this.load();
                        }
                    });
                }
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

    .image{
        width: 125px;
        height: 125px;
    }
</style>