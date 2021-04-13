import ajax from '../ajax'

var ajaxFn={
	async init(m,u,d,cb,a,o,pro){
		let option={};
		o?option.other=true:null
		pro?option.pro=pro:null
		if(a){
			option.ansyc=true;
			let res = await ajax(m,u,d,false,option);
			// console.log(res)
			return res
		}else{
			ajax(m,u,d,res=>{
				if(cb){cb(res);}
			},option)
		}
	},
	uploadFile(data,cb,pro) {
		this.init('post','https://jsonplaceholder.typicode.com/posts/', data , (r)=>{
			// console.log(r)
			let res;
			if(r.status===0){
				res=r;
			}else{
				res={
					status:1,
					data:{
						id:r.id,
						path:data.file.name
					}
				}
			}
			cb(res)
		} , false , true , pro )
	},
	uploadFile1(data,cb,pro) {
		this.init('post','https://jsonplaceholder.typicode.com/posts/', data , (r)=>{
			// console.log(r)
			let res;
			if(r.status===0){
				res={
					state:"0",
					msg:res.message
				};
			}else{
				res={
					state:"200",
					data:{
						fileId:r.id,
						filePath:data.file.name
					}
				}
			}
			cb(res)
		} , false , true , pro )
	},
}

export default ajaxFn
