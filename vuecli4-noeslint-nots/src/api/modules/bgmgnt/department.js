import ajax from '../../ajax'

var ajaxFn={
	async init(m,u,d,cb,a){
		u='bgmgnt/dep/'+u;
		if(a){
			let res = await ajax(m,u,d,false,true);
			// console.log(res)
			return res
		}else{
			ajax(m,u,d,res=>{
				if(cb){cb(res);}
			})
		}
	},
	add(data,cb) {
		this.init('post','add', data ,cb ,false )
  },
  async depmgntcheckName(data) {
    return this.init('post','checknameexist', data ,false ,true )
  },
	update(data,cb) {
		this.init('post','update', data ,cb ,false )
	},
	delete(data,cb) {
		this.init('get','delete', data ,cb ,false )
  },
  getDepTreeData(data,cb) {
    this.init('get','treelist',data,cb ,false)
  },
}

export default ajaxFn
