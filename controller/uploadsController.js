import _q from '../routes/_query.js'
import ImageKit from "imagekit"
import dotenv from 'dotenv'
dotenv.config()


const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

const Get = (req,res)=>{
    let {token,userid,f,t} = _q(req)

    imageKit.listFiles({
        //skip : 0,
        searchQuery : `name : "snapS-${userid}" AND createdAt >= "${f}" AND createdAt <= "${t}"`,
        transformation : [{
            "quality" : "80"
        }],
        //folder: 'api/ss',
        limit : 200
    }).then(response => {
        let resb = JSON.stringify(response);

         const tbody = response.map(({name,url,thumbnail,size})=>{
            //console.log(name,thumbnail,size);
            return {
                "id": name,
                //url,
                "url": thumbnail,
                size
            }
        })
        //console.log(tbody);
        res.json(tbody)

    }).catch(error => {
        console.log(error);
        res.json({'message':'empty'})
    });
}

const Create = (req,res)=>{
    if (req.file) {
        imageKit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: 'api/ss'
        }, function(err, response) {
            if(err) {
                console.log(err);
            return res.status(500).json({
                status: "failed",
                message: "An error occured during file upload. Please try again."
            })
            }
    
            res.json({ status: "success", message: "Successfully uploaded files" });
        })
    }
}

export default {Get,Create}