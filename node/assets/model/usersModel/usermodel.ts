import utilis from "../../controller/utilis.ts";
import dbOPS from "../dbOPS.ts";


export default class UserModel{

    public Utilis = new utilis()
    public dbops = new dbOPS()

    public async checkMailExist(email : string){

        const columns = [email]
        const condition = 'email = ?'

        const checkMail = await this.dbops.select('user',
            columns,
            condition
        )
        if(checkMail.data === 1 ){
            return this.Utilis.returnData(true, 'Email already exist', checkMail)
        }
    }
}