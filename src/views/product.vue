<template>
    <div class="right">
        <Headers>
            <div slot="insert" class="insert">
                <el-button icon="el-icon-plus" @click="dialogFormVisible = true"/>
            </div>
        </Headers>
        <div class="table">
            <el-table :data="products">
                <el-table-column
                        prop="id"
                        label="id"
                        align="center">
                </el-table-column>
                <el-table-column
                        label="图片"
                        align="center">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.image" :previewSrcList="[scope.row.image]"
                                  class="image"/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-text="scope.row.name" type="info" size="mini"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="商店"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-text="scope.row.store.name" type="primary" size="mini"/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="价格"
                        align="center">
                    <template slot-scope="scope">
                        <div v-text="changePrice(scope.row.price)"></div>
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
                    <span><i class="el-icon-plus"></i> 添加产品</span>
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
                    <span>价格：</span>
                    <el-input v-model="insertFrom.price" suffix-icon="el-icon-price-tag"/>
                </div>
                <div class="form-item">
                    <span>商店：</span>
                    <el-select v-model="insertFrom.storeId" placeholder="请选择商店">
                        <el-option v-for="store in stores" :key="store.id" :label="store.name"
                                   :value="store.id"/>
                    </el-select>
                </div>
                <div class="form-item">
                    <el-button size="medium" type="success" @click="insert" plain>添加</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="dialogUpdateVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-edit"></i> 修改产品</span>
                </div>
                <div class="form-item">
                    <span>名称：</span>
                    <el-input v-model="updateFrom.name" suffix-icon="el-icon-tickets" @input="changeUpdateButton"/>
                </div>

                <div class="form-item">
                    <span>图片：</span>
                    <el-input v-model="updateFrom.image" @input="changeUpdateButton">
                        <div slot="suffix" class="suffix">
                            <el-link icon="el-icon-picture-outline" :href="updateFrom.image" :underline="false"
                                     target="_blank"/>
                        </div>
                    </el-input>
                </div>

                <div class="form-item">
                    <span>价格：</span>
                    <el-input v-model="updateFrom.price" suffix-icon="el-icon-price-tag" @input="changeUpdateButton"/>
                </div>

                <div class="form-item">
                    <span>销量：</span>
                    <el-input v-model="updateFrom.sales" suffix-icon="el-icon-medal" @input="changeUpdateButton"
                              type="number"/>
                </div>

                <div class="form-item">
                    <span>商店：</span>
                    <el-select v-model="updateFrom.storeId" placeholder="请选择商店" @change="changeUpdateButton">
                        <el-option v-for="store in stores" :key="store.id" :label="store.name"
                                   :value="store.id"/>
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
    import {findAllProduct, deleteProduct, insertProduct, updateProduct} from "@/utils/api/product";
    import {findAllStore} from "@/utils/api/store";

    export default {
        name: "product",
        components: {Headers},
        data() {
            return {
                products: [],
                dialogFormVisible: false,
                dialogUpdateVisible: false,
                insertFrom: {
                    name: '',
                    image: null,
                    price: null,
                    storeId: null,
                },
                updateFrom: {
                    name: '',
                    image: null,
                    price: null,
                    rate: null,
                    sales: null,
                    storeId: null
                },
                total: 0,
                page: 1,
                stores: [],
                updateButton: true,
                pageSize: 0
            }
        },
        created() {
            const tableHeight = parseInt(localStorage.getItem('tableHeight'));
            this.pageSize = parseInt((tableHeight / 125).toString());
            this.getData(1);
            this.getStores();
        },
        methods: {
            getData(pageNo) {
                findAllProduct(pageNo, this.pageSize).then(res => {
                    let data = res.data;
                    this.products = data.list;
                    this.total = data.total;
                })
            },
            getStores() {
                findAllStore(1,9).then(res => {
                    this.stores = res.data.list
                })
            },
            insert() {
                if (!Object.values(this.insertFrom).every(v => !!v)) {
                    this.$message.error('不能有选项为空')
                } else {
                    this.insertFrom.price = this.insertFrom.price * 100;
                    insertProduct(this.insertFrom).then(res => {
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
                        deleteProduct({'id': row.id}).then(res => {
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
                if (!Object.values(this.updateFrom).every(v => !!v)) {
                    this.$message.error('不能有选项为空');
                } else {
                    this.updateFrom.price = this.updateFrom.price * 100;
                    updateProduct(this.updateFrom).then(res => {
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
                this.updateFrom.rate = row.rate.toString();
                this.updateFrom.image = row.image;
                this.updateFrom.sales = row.sales.toString();
                this.updateFrom.price = this.changePrice(row.price);
                this.updateFrom.storeId = row.storeId;
            },
            load() {
                this.products = this.getData(this.page)
            },
            currentChange(current) {
                this.page = current;
                this.products = this.getData(current)
            },
            changeUpdateButton() {
                this.updateButton = false
            },
            changePrice(price) {
                return (price / 100).toFixed(1)
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