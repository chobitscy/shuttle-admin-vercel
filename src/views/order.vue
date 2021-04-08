<template>
    <div class="right">
        <Headers/>
        <div class="table">
            <el-table :data="orders">
                <el-table-column
                        prop="id"
                        label="id"
                        align="center">
                </el-table-column>
                <el-table-column
                        label="客户"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-text="scope.row.client.name" type="primary" size="mini"
                                   @click="clickClient(scope.row.client)"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="服务员"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-text="scope.row.service.name" type="success" size="mini"
                                   @click="clickService(scope.row.service)"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="产品"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-text="scope.row.product.name" type="info" size="mini"
                                   @click="clickProduct(scope.row.product,scope.row['storeName'])"/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="date"
                        label="时间"
                        align="center">
                    <template slot-scope="scope">
                        <div>
                            <div v-text="changeTime(scope.row.date)"></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="地址"
                        align="center">
                </el-table-column>
                <el-table-column
                        label="备注"
                        align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-notebook-1" size="mini" type="warning"
                                   @click="clickNote(scope.row.note)"
                                   plain/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="文件"
                        align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-tickets" size="mini" type="success" @click="clickFile(scope.row.file)"
                                   plain/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态"
                        align="center">
                    <template slot-scope="scope">
                        <el-tag :type="getStatusType(scope.row.status)">
                            <i :class="getStatusIcon(scope.row.status)"></i>
                            {{getStatus(scope.row.status)}}
                        </el-tag>
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
                    <span>时间：</span>
                    <el-date-picker
                            v-model="updateFrom.date"
                            type="datetime"
                            placeholder="选择日期"
                            @change="changeUpdateButton">
                        <i class="el-icon-goods"></i>
                    </el-date-picker>
                </div>

                <div class="form-item">
                    <span>地址：</span>
                    <el-input v-model="updateFrom.address" suffix-icon="el-icon-school" @input="changeUpdateButton"/>
                </div>

                <div class="form-item">
                    <span>备注：</span>
                    <el-input v-model="updateFrom.note" suffix-icon="el-icon-notebook-2"
                              :placeholder="updateFrom.note !== ''?'':'无'" @input="changeUpdateButton"/>
                </div>

                <div class="form-item">
                    <span>客户：</span>
                    <el-input v-model="updateFrom.cid" suffix-icon="el-icon-user" @input="changeUpdateButton"
                              placeholder="请输入客户id" disabled/>
                </div>

                <div class="form-item">
                    <span>服务：</span>
                    <el-input v-model="updateFrom.sid" suffix-icon="el-icon-user-solid" @input="changeUpdateButton"
                              placeholder="请输入服务员id" disabled/>
                </div>

                <div class="form-item">
                    <span>产品：</span>
                    <el-input v-model="updateFrom.pid" suffix-icon="el-icon-goods" @input="changeUpdateButton"
                              placeholder="请输入产品id" disabled/>
                </div>

                <div class="form-item update">
                    <span>状态：</span>
                    <el-radio v-model="updateFrom.status" :label="'-1'" @change="changeUpdateButton">未接单</el-radio>
                    <el-radio v-model="updateFrom.status" :label="'0'" @change="changeUpdateButton">待配送</el-radio>
                    <el-radio v-model="updateFrom.status" :label="'1'" @change="changeUpdateButton">已完成</el-radio>
                </div>

                <div class="form-item update">
                    <span>文件：</span>
                    <el-upload
                            class="upload"
                            action="/api/file/upload"
                            multiple
                            :limit="3"
                            :file-list="updateFrom.file !== null?[{name:updateFrom.file,url:updateFrom.file}]:null"
                            :on-success="handleResult"
                            :headers="{Authorization:getToken()}">
                        <el-button size="small" type="primary" class="update-button">点击上传</el-button>
                    </el-upload>
                </div>

                <div class="form-item">
                    <el-button size="medium" type="warning" @click="update" plain :disabled="updateButton">修改
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="dialogFileVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-tickets"></i> 文件</span>
                </div>
                <div class="form-item" v-if="file !== null">
                    <el-link :href="'/api/file/download/' + file">点击下载文件</el-link>
                </div>
                <div class="form-item" v-if="file === null">
                    无
                </div>
            </el-dialog>
            <el-dialog :visible.sync="dialogNoteVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-notebook-1"></i> 备注</span>
                </div>
                <div class="form-item" v-if="note !== null">
                    <el-input type="textarea" v-model="note" :rows="3"/>
                </div>
                <div class="form-item" v-if="note === null">
                    无
                </div>
            </el-dialog>
            <el-dialog :visible.sync="dialogClientVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-user"></i> 客户</span>
                </div>
                <div class="form-item">
                    <span>昵称：</span>
                    <el-input :value="client.name" suffix-icon="el-icon-user"/>
                </div>
                <div class="form-item">
                    <span>电话：</span>
                    <el-input :value="client.phone" suffix-icon="el-icon-phone"/>
                </div>
                <div class="form-item">
                    <span>地址：</span>
                    <el-input :value="client.address" suffix-icon="el-icon-school"/>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="dialogServiceVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-user-solid"></i> 服务员</span>
                </div>
                <div class="form-item">
                    <span>昵称：</span>
                    <el-input :value="service.name" suffix-icon="el-icon-user"/>
                </div>
                <div class="form-item">
                    <span>电话：</span>
                    <el-input :value="service.phone" suffix-icon="el-icon-phone"/>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="dialogProductVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-goods"></i> 产品</span>
                </div>
                <div class="form-item">
                    <span>名称：</span>
                    <el-input :value="product.name" suffix-icon="el-icon-tickets"/>
                </div>
                <div class="form-item">
                    <span>图片：</span>
                    <el-input :value="product.image" suffix-icon="el-icon-picture-outline">
                        <div slot="suffix" class="suffix">
                            <el-link icon="el-icon-link" :href="product.image" :underline="false" target="_blank"/>
                        </div>
                    </el-input>
                </div>
                <div class="form-item">
                    <span>价格：</span>
                    <el-input :value="changePrice(product.price)" suffix-icon="el-icon-price-tag"/>
                </div>
                <div class="form-item">
                    <span>销量：</span>
                    <el-input :value="product.sales" suffix-icon="el-icon-medal"/>
                </div>
                <div class="form-item">
                    <span>商店：</span>
                    <el-input :value="product.store" suffix-icon="el-icon-shopping-cart-1"/>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Headers from "@/components/headers";
    import {
        findAllOrder,
        deleteOrder,
        updateOrder,
        findByReceive,
        findByCompleted,
        findByPresent
    } from "@/utils/api/order";

    export default {
        name: "order",
        components: {Headers},
        props: ['status'],
        data() {
            return {
                orders: [],
                dialogUpdateVisible: false,
                dialogFileVisible: false,
                dialogNoteVisible: false,
                dialogClientVisible: false,
                dialogServiceVisible: false,
                dialogProductVisible: false,
                updateFrom: {
                    id: null,
                    cid: null,
                    sid: null,
                    pid: null,
                    date: null,
                    address: null,
                    note: null,
                    file: null,
                    status: '-1'
                },
                total: 0,
                page: 1,
                file: null,

                note: null,
                client: {
                    name: null,
                    phone: null,
                    address: null
                },
                service: {
                    name: null,
                    phone: null,
                },
                product: {
                    name: null,
                    image: null,
                    price: null,
                    rate: null,
                    sales: null,
                    store: null,
                },
                updateButton: true,
                userStatus: false,
                productStatus: false,
                pageSize: 8
            }
        },
        created() {
            const tableHeight = parseInt(localStorage.getItem('tableHeight'));
            this.pageSize = parseInt((tableHeight / 57).toString());
            this.getData(1);
        },
        methods: {
            getData(pageNo) {
                findAllOrder(pageNo, this.pageSize).then(res => {
                    let data = res.data;
                    this.orders = data.list;
                    this.total = data.total;
                })
            },
            del(row) {
                const h = this.$createElement;
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [
                        h('span', null, '此操作将永久删除订单'),
                        h('span', {style: 'color: #f56c6c'}, row.id),
                        h('span', null, ', 是否继续?')
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        deleteOrder({'id': row.id}).then(res => {
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
                const date = new Date(this.updateFrom.date);
                this.updateFrom.date = date.toISOString().split('T')[0] + ' '
                    + date.toTimeString().split(' ')[0];
                updateOrder(this.updateFrom).then(res => {
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
                this.updateFrom.cid = row.cid;
                this.updateFrom.sid = row.sid;
                this.updateFrom.pid = row.pid;
                this.updateFrom.date = row.date;
                this.updateFrom.address = row.address;
                this.updateFrom.note = row.note;
                this.updateFrom.file = row.file;
                this.updateFrom.status = row.status.toString();
            },
            load() {
                this.orders = this.getData(this.page)
            },
            currentChange(current) {
                const status = parseInt(this.status);
                this.page = current;
                if (status === -1)this.getReceiver(current);
                else if(status === 1) this.getCompleted(current);
                else if(status === 2) this.getData(current);
            },
            changeTime(time) {
                return new Date(Date.parse(time)).toLocaleDateString()
            },
            getStatus(status) {
                if (status === -1) {
                    return '待接单'
                } else if (status === 0) {
                    return '配送中'
                } else if (status === 1) {
                    return '已完成'
                }
            },
            getStatusIcon(status) {
                if (status === -1) {
                    return 'el-icon-loading'
                } else if (status === 0) {
                    return 'el-icon-shopping-cart-full'
                } else if (status === 1) {
                    return 'el-icon-circle-check'
                }
            },
            getStatusType(status) {
                if (status === -1) {
                    return 'primary'
                } else if (status === 0) {
                    return 'warning'
                } else if (status === 1) {
                    return 'success'
                }
            },
            clickClient(row) {
                this.dialogClientVisible = true;
                this.client.name = row.name;
                this.client.phone = row.phone;
                this.client.address = row.address;
            },
            clickService(row) {
                this.dialogServiceVisible = true;
                this.service.name = row.name;
                this.service.phone = row.phone;
            },
            clickProduct(row, store) {
                this.dialogProductVisible = true;
                this.product.name = row.name;
                this.product.image = row.image;
                this.product.price = row.price;
                this.product.rate = row.rate;
                this.product.sales = row.sales;
                this.product.store = store;
            },
            changePrice(price) {
                return (price / 100).toFixed(1)
            },
            changeUpdateButton() {
                this.updateButton = false
            },
            clickNote(note) {
                this.dialogNoteVisible = true;
                this.note = note;
            },
            handleResult(response) {
                this.updateFrom.file = response.data
            },
            getToken() {
                return localStorage.getItem('token')
            },
            clickFile(file) {
                this.dialogFileVisible = true;
                this.file = file;
            },
            getReceiver(pageNo){
                findByReceive(pageNo,this.pageSize).then(res => {
                    if(res.code === 1){
                        let data = res.data;
                        this.orders = data.list;
                        this.total = data.total;
                    }
                })
            },
            getCompleted(pageNo){
                findByCompleted(pageNo,this.pageSize).then(res => {
                    if(res.code === 1){
                        let data = res.data;
                        this.orders = data.list;
                        this.total = data.total;
                    }
                })
            },
            getPresent(pageNo) {
                findByPresent(pageNo, this.pageSize).then(res => {
                    if (res.code === 1) {
                        let data = res.data;
                        this.orders = data.list;
                        this.total = data.total;
                    }
                })
            }
        },
        watch: {
            status() {
                const status = parseInt(this.status);
                if (status === -1)this.getReceiver(this.page);
                else if(status === 0)this.getPresent(this.page);
                else if(status === 1) this.getCompleted(this.page);
                else if(status === 2) this.getData(1);
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


    .update-button {
        margin-right: 141px;
    }

    .update {
        margin: 20px 0;
    }

    .upload {
        width: 73%
    }
</style>