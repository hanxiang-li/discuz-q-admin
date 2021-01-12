<template>
<basic-container>
  <avue-crud :data="data" :option="option" v-model="form" :page.sync="page" v-bind="bindVal" v-on="onEvent" ref="orderRecordCrud">
    <template slot="cash_status" slot-scope="scope">
      <el-tag>{{cashStatus(scope.row.cash_status,scope.row)}}</el-tag>
    </template>

    <template slot-scope="{type, size, row }" slot="menu">
      <template v-if="row.cash_status === 1">
        <template v-if="row.cash_type === 0">
          <el-button icon="el-icon-close" :size="size" :type="type" @click="noReviewClick(row.id)">
            审核拒绝
          </el-button>
          <el-button icon="el-icon-check" :size="size" :type="type" @click="reviewClicks(row.id)">标记打款</el-button>
        </template>

        <el-popover v-else placement="top" width="160">
          <p>确定通过该提现吗？？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="noReviewClick(row.id)">不通过</el-button>
            <el-button type="primary" size="mini" @click="success(row.id)">通过</el-button>
          </div>
          <el-button :size="size" :type="type" slot="reference">
            审核
          </el-button>
        </el-popover>
      </template>
    </template>

    <template slot="menuLeft">
      <el-button type="primary" size="small" @click="getSet">提现设置</el-button>
    </template>
  </avue-crud>

  <el-dialog title="提现设置" :visible.sync="centerDialogVisible" width="300px" center :modal-append-to-body="false" top="10vh">
    <div style="text-align: center;">
      <el-form label-position="top" label-width="80px" :model="form">
        <el-form-item label="提现间隔时间（天）">
          <el-input-number v-model="form.cash_interval_time" :min="0" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="提现手续费率（范围为：0-1）">
          <el-input v-model="form.cash_rate"  style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="单次提现最小金额（元）">
          <el-input-number v-model="form.cash_min_sum" :min="1" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="单次提现最大金额（元）">
          <el-input-number v-model="form.cash_max_sum" :min="1" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="每日提现总金额上限（元）">
          <el-input-number v-model="form.cash_sum_limit" :min="1" style="width: 200px;"/>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveSet">确 定</el-button>
    </span>
  </el-dialog>

</basic-container>
</template>

<script>
import {dataFormatter, dataSerialize} from "@/util/tools";
import {updateWalletCashReview} from "@/api/wallet";
import {errorMsg, okMsg} from "@/util/msg";
import {queryForum, updateSiteSet} from "@/api/site";

export default window.$crudCommon({
  data(){
    return {
      centerDialogVisible: false,
      form: {},
    }
  },
  methods: {
    listBefore() {
      const { cash_status, cash_sn, user, created_at } = this.params
      this.params['include'] = 'user,userWallet,wechat'
      this.params['filter[cash_status]'] = cash_status || 1
      this.params['filter[cash_sn]'] = cash_sn
      this.params['filter[username]'] = user
      if (created_at){
        this.params['filter[start_time]'] = created_at[0]
        this.params['filter[end_time]'] = created_at[1]
      }
    },
    cashStatus(status,data) {
      switch (status) {
        case 1:
          if (!data.error_message) {
            return '待审核'
          } else {
            return "待审核，原因：" + data.error_message;
          }
        case 2:
          return "审核通过";
        case 3:
          return "审核不通过，原因：" + data.remark;
        case 4:
          return "待打款";
        case 5:
          return "已打款";
        case 6:
          return "打款失败，原因：" + data.error_message;
        default:
          //获取状态失败，请刷新页面
          return "未知状态";
      }
    },
    noReviewClick(id){
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
        const data = {
          ids: [id],
          cash_status: 3,
          remark: value,
        }
        updateWalletCashReview(data).then(() => {
          okMsg()
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        });
      });
    },
    reviewClicks(id){
      updateWalletCashReview({
        ids: [id],
        cash_status: 5
      }).then(() => {
        okMsg()
        this.getList()
      })
    },
    success(id){
      updateWalletCashReview({
        ids: [id],
        cash_status: 2
      }).then(() => {
        okMsg()
        this.getList()
      })
    },
    getSet(){
      this.loading = true
      queryForum().then(res => {
        this.form = dataFormatter(res).set_cash
        this.centerDialogVisible = true
        this.loading = false
      })
    },
    saveSet(){
      let list = []
      for (let key in this.form) {
        let val = {
          attributes: {
            key: key,
            tag: "cash",
            value: this.form[key],
          }
        }
        list.push(val)
      }
      updateSiteSet({data: list}).then(() => {
        okMsg('修改成功')
        this.centerDialogVisible = false
      })
    }
  }
},{
  apiName: 'wallet',
  columnName: 'walletCash',
  list: 'queryWalletCash',
  pageNumber: 'page[number]',
  pageSize: 'page[limit]',
  res: (data)=>{
    return {
      data: dataFormatter(data)
    }
  },
})
</script>

<style scoped>

</style>
