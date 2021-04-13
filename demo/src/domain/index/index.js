import Data from '../../api/index/data'

class Index {
    constructor (){
    }
    getHead(){
        return Data.getHead()
    }

    async getDataList(data) {
        let res = await Data.getDataList(data)

        Index.itemList = res.map((el)=>new Index(el))
        return res
    }

    delete (id) {
        let item = this.getIndex(id)
        if(item){
            return item.delete()
        }
    }

    getItem (id) {
        return Index.itemList.find(el=>el.getInfo().id === id)
    }
}
export default Index