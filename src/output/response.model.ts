
export class ResponseModel {
    statusCode : number;
    isSuccess : boolean;
    data : any;
    message  = "Fetched"

    constructor(statusCode : number , isSuccess : boolean , data : any , message : string  = "Fetched" ){
        this.statusCode = statusCode
        this.isSuccess = isSuccess
        this.data = data
        this.message = message
    }
    toJson() :any{ 
        return {statusCode : this.statusCode , isSuccess : this.isSuccess , data : this.data , message : this.message }
    }
}