import ajax from '../../ajax'

var ajaxFn={
	async init(m,u,d,cb,a){
		u='service/visit/'+u;
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
	planList(data,cb) {
		this.init('get','plan/list', data ,cb ,false )
	},
	addPlan(data,cb) {
		this.init('post','plan/add', data ,cb ,false )
	},
	updatePlan(data,cb) {
		this.init('post','plan/update', data ,cb ,false )
	},
	detailPlan(data,cb) {
		this.init('get','plan/detail', data ,cb ,false )
	},
	deletePlan(data,cb) {
		this.init('get','plan/delete', data ,cb ,false )
	},
	recordList(data,cb) {
		this.init('get','record/list', data ,cb ,false )
	},
	addRecord(data,cb) {
		this.init('post','record/add', data ,cb ,false )
	},
	updateRecord(data,cb) {
		this.init('post','record/update', data ,cb ,false )
	},
	detailRecord(data,cb) {
		this.init('get','record/detail', data ,cb ,false )
	},
	deleteRecord(data,cb) {
		this.init('get','record/delete', data ,cb ,false )
	},
}

export default ajaxFn
