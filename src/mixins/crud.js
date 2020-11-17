export default (app, option = {}) => {
  let mixins = {
    data () {
      return {
        data: [],
        form: {},
        params: {},
        api: require(`@/api/${option.apiName || option.name}`),
        loading: false,
        page: {
          pageSize: 20,
          pageSizes: [ 20, 50, 100, 150, 300]
        },
      }
    },
    computed: {
      option () {
        return require(`@/option/${option.columnName || option.name}`).default(this)
      },
      bindVal () {
        return {
          ref: 'crud',
          option: this.option,
          data: this.data,
          tableLoading: this.loading
        }
      },
      onEvent () {
        return {
          'on-load': this.getList,
          'row-save': this.rowSave,
          'row-update': this.rowUpdate,
          'row-del': this.rowDel,
          'refresh-change': this.refreshChange,
          'search-reset': this.searchChange,
          'search-change': this.searchChange
        }
      },
      rowKey () {
        return option.rowKey || 'id'
      }
    },
    methods: {
      getList () {
        const callback = () => {
          this.loading = true;
          let pageParams = {}
          pageParams[option.pageNumber || 'currentPage'] = this.page.currentPage
          pageParams[option.pageSize || 'pageSize'] = this.page.pageSize
          const data = Object.assign(pageParams, this.params)
          this.data = [];
          this.api[option.list || 'list'](data).then(res => {
            this.loading = false;
            let data;
            if (option.res) {
              data = option.res(res);
            } else {
              data = res.data.data
            }
            this.page.total =  res.meta['total' || 'threadCount'];
            this.data = data[option.data || 'data'];
            if (this.listAfter) {
              this.listAfter(data)
            }
          })
        }
        if (this.listBefore) {
          this.listBefore()
        }
        callback()
      },
      rowSave (row, done, loading) {
        const callback = () => {
          delete this.form.params;
          this.api[option.add || 'add'](this.form).then((data) => {
            if (this.addAfter) {
              this.addAfter(data, done, loading)
            } else {
              this.$message.success('新增成功')
              this.getList();
              done();
              loading()
            }
          }).catch(() => {
            loading()
          })
        }
        if (this.addBefore) {
          if (this.form && this.option.cellBtn){
            this.form = row
          }
          this.addBefore()
        }
        callback()
      },
      rowUpdate (row, index, done, loading) {
        const callback = () => {
          delete this.form.params;
          this.api[option.update || 'update'](this.form).then((data) => {
            if (this.updateAfter) {
              this.updateAfter(data, done, loading, index)
            } else {
              if (!this.option.cellBtn){
                this.getList();
              }
              done()
              loading()
            }
          }).catch((err) => {
            loading()
          })
        }
        if (this.updateBefore) {
          if (this.form && this.option.cellBtn){
            this.form = row
          }
          this.updateBefore()
        }
        callback()
      },
      rowDel (row, index) {
        const callback = (data) => {
          this.api[option.del || 'del'](data || row).then((data) => {
            if (this.delAfter) {
              this.delAfter(data, row, index)
            } else {
              this.getList();
            }
          })
        }
        if (this.delBefore) {
          this.delBefore(row, callback)
        } else {
          this.$confirm(`此操作将删除 ${row[option.delLabel] || index}, 是否继续?`, '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            callback()
          })
        }
      },
      searchChange (params, done) {
        if (done) done();
        this.params = params;
        this.page.currentPage = 1;
        this.getList();
      },
      refreshChange () {
        this.getList();
      }
    }
  }
  app.mixins = app.mixins || [];
  app.mixins.push(mixins)
  return app;
}
