import Users from '../model/user.js'


function ToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
}

var refreshTokens = {}
var Tokenizer = {}


const Get = (req,res)=>{
    let par = req.query;
   
    let tokenize = Tokenizer[par.token]
    try {
        if (tokenize) {
            var user = ''
            
            if(refreshTokens[tokenize] === par.token)
            {
                user = tokenize 
            }else {
                
                delete Tokenizer[par.token]
            }
    
            //console.log(user);
    
            if (user) {
                res.json({
                    userid:user,
                    status:200
                })
            }else{
                res.json({
                    message:'token is expired',
                    status:404
                })
            }
            
        }else{
            res.json({
                message: 'Sorry, token cannot be verified.',
                status: 404
            }).status(404)
        }
        
    } catch (error) {
        console.log(error);
    }
}

const Create = (req,res)=>{
    var bdy = req.body
    Users.findOne({
        'user_id': bdy.userid
    })
    .limit(20)
    .then((data)=>{
        if (data) {
            let s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
            let token = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

            delete refreshTokens[bdy.userid]

            refreshTokens[bdy.userid] = token
            Tokenizer[token] = bdy.userid
            res.json({'token': token,'user':data.name,'role': data.role, status: 200});

            //console.log(refreshTokens);
        }else{
            res.json({
                message: 'No user found.',
                status: 404
            })
        }
        
    })
    .catch(err=>{
        console.log(err);
    })
}

export default {Get,Create}