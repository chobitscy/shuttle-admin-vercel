<template>
    <div class="right">
        <Headers/>
        <div class="table">
            <el-table :data="comment">
                <el-table-column
                        prop="id"
                        label="id"
                        align="center">
                </el-table-column>
                <el-table-column
                        label="评论者"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-text="scope.row.name" type="primary" size="mini"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="内容"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-text="formatContent(scope.row.content)" type="info" size="mini"
                                   @click="showContent(scope.row.content)"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="时间"
                        align="center">
                    <template slot-scope="scope">
                        <span v-text="scope.row.date"/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="date"
                        label="商店"
                        align="center">
                    <template slot-scope="scope">
                        <div v-text="scope.row.storeId"></div>
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
                    <span><i class="el-icon-edit"></i> 修改评论</span>
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
                    <span>作者：</span>
                    <el-input v-model="updateFrom.name" suffix-icon="el-icon-user" @input="changeUpdateButton"/>
                </div>

                <div class="form-item">
                    <span>内容：</span>
                    <el-input v-model="updateFrom.content" suffix-icon="el-icon-folder"
                              @input="changeUpdateButton"/>
                </div>

                <div class="form-item">
                    <span>商店：</span>
                    <el-input v-model="updateFrom.storeId" suffix-icon="el-icon-shopping-cart-1" @input="changeUpdateButton"/>
                </div>


                <div class="form-item">
                    <el-button size="medium" type="warning" @click="update" plain :disabled="updateButton">修改
                    </el-button>
                </div>
            </el-dialog>

            <el-dialog :visible.sync="dialogContentVisible" width="350px" center>
                <div slot="title">
                    <span><i class="el-icon-folder"></i> 内容</span>
                </div>
                <el-input type="textarea" :value="content"/>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Headers from "@/components/headers";
    import {deleteComment, findAllComment, updateComment} from "@/utils/api/comment";

    export default {
        name: "order",
        components: {Headers},
        props: ['status'],
        data() {
            return {
                comment: [],
                dialogUpdateVisible: false,
                updateFrom: {
                    id: null,
                    content: null,
                    name: null,
                    date: null,
                    storeId: null
                },
                updateButton: true,
                total: 0,
                page: 1,
                pageSize: 8,
                dialogContentVisible: false,
                content: null
            }
        },
        created() {
            const tableHeight = parseInt(localStorage.getItem('tableHeight'));
            this.pageSize = parseInt((tableHeight / 57).toString());
            this.getData(1);
        },
        computed: {
            formatContent() {
                return (content) => {
                    if (content.length > 6)
                        return content.substring(0, 6) + '...';
                    else return content;
                }
            }
        },
        methods: {
            getData(pageNo) {
                findAllComment(pageNo, this.pageSize).then(res => {
                    let data = res.data;
                    this.comment = data.list;
                    this.total = data.total;
                })
            },
            del(row) {
                const h = this.$createElement;
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [
                        h('span', null, '此操作将永久删除评论'),
                        h('span', {style: 'color: #f56c6c'}, row.id),
                        h('span', null, ', 是否继续?')
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        deleteComment({'id': row.id}).then(res => {
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
                updateComment(this.updateFrom).then(res => {
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
                this.updateFrom.name = row.name;
                this.updateFrom.content = row.content;
                this.updateFrom.date = row.date;
                this.updateFrom.storeId = row.storeId;
            },
            load() {
                this.comment = this.getData(this.page)
            },
            currentChange(current) {
                this.page = current;
                this.getData(current);
            },
            changeTime(time) {
                return new Date(Date.parse(time)).toLocaleDateString()
            },
            changeUpdateButton() {
                this.updateButton = false
            },
            showContent(content) {
                this.content = content;
                this.dialogContentVisible = true;
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