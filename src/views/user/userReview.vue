<template>
<div>
  <avue-crud  :data="data" :option="option" v-model="form" :page.sync="page" v-bind="bindVal" v-on="onEvent"
    @selection-change="selectionChange" ref="userReview">
    <template slot="menuLeft">
      <el-button icon="el-icon-check" type="primary" size="mini" @click="review(null, 1, true)">通过</el-button>
      <el-button icon="el-icon-close" type="danger" size="mini" @click="review(null, 1, false)">拒绝</el-button>
    </template>
    <template slot-scope="{type,size,row}" slot="menu">
      <el-button icon="el-icon-check" :size="size" :type="type" @click="review(row, 0, true)">通过</el-button>
      <el-button icon="el-icon-close" :size="size" :type="type" @click="review(row, 0, false)">拒绝</el-button>
    </template>
  </avue-crud>
</div>
</template>

<script>
import {dataFormatter} from "@/util/tools";
import {updateUser, updateUserList} from "@/api/user";
import {errorMsg, okMsg} from "@/util/msg";

export default window.$crudCommon({
  data(){
    return {
      selectionList: [],
    }
  },
  methods: {
    listBefore(){
      this.params = {
        'filter[status]': 'mod'
      }
    },
    selectionChange(val){
      this.selectionList = val
    },
    review(row, val, type){
      let run = (msg) => {
        if (val === 0){
          updateUser({
            id: row.id,
            data: {
              attributes: {
                status: type ? 0 : 1,
                refuse_message: type ? '' : msg
              }
            }
          }).then(() => {
            okMsg()
            this.getList()
          })
        } else {
          if (this.selectionList.length > 0){
            let list = []
            for (let i = 0; i < this.selectionList.length; i++) {
              const {id} = this.selectionList[i]
              list.push({
                attributes: {
                  id: id,
                  status: type ? 0 : 1,
                  refuse_message: type ? '' : msg
                }
              })
            }
            updateUserList({
              data: list
            }).then(() => {
              okMsg()
              this.getList()
            })
          } else {
            errorMsg('请选择一条数据')
          }
        }
      }
      if (type){
        run()
      } else {
        let inputValidator = (val) => {
          if(!val){
            return '请输入拒绝原因'
          }
          return true
        }
        this.$prompt('请输入拒绝原因', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: inputValidator,
        }).then(({ value }) => {
          run( value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });
      }
    },
  },
},{
  name:'user',
  list: 'queryUserReviewList',
  rowKey: 'id',
  pageNumber: 'page[number]',
  pageSize: 'page[limit]',
  columnName: 'userReview',
  res:(data)=>{
    return {
      data: dataFormatter(data)
    }
  },
})
</script>

<style scoped>

</style>
