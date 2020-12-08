<template>
<basic-container v-loading="loading">
  <avue-data-display :option="option"></avue-data-display>
</basic-container>
</template>

<script>
import {queryFinanceList} from "@/api/wallet";
import {dataFormatter} from "@/util/tools";

export default {
  name: "financialStatistics",
  data(){
    return {
      loading: true,
      option: {
        span:6,
        decimals: 2,
        data: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      queryFinanceList().then(res => {
        const data = dataFormatter(res)
        this.option.data = [
          {
            count: data.totalIncome,
            title: '用户总充值(元)',
          },
          {
            count: data.totalWithdrawal,
            title: '用户总提现(元)',
          },
          {
            count: data.totalWallet,
            title: '用户钱包总金额(元)',
          },
          {
            count: data.orderCount,
            title: '用户订单总数',
          },
          {
            count: data.totalProfit,
            title: '平台总盈利(元)',
          },
          {
            count: data.withdrawalProfit,
            title: '提现手续费收入(元)',
          },
          {
            count: data.orderRoyalty,
            title: '打赏提成收入(元)',
          },
          {
            count: data.totalRegisterProfit,
            title: '注册加入收入(元)',
          },
        ]
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
