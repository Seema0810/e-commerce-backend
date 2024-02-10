//  set up Multer to handle different types of files and save them to the same destination folder

const express = require("express");
const router = express.Router();
const multer= require("multer");            // to add upload and download functionality


// The disk storage engine gives you full control on storing files to disk.
const storage= multer.diskStorage({
    destination:(req, file, cb)=>{          //this destination fuction is used to determine within which folder file should be uploaded 
        cb(null, 'uploads/')                //  with this command uploads folder will be created
    },

    // this line of code is taken from the chatgpt so that i can store the image url in database
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.originalname.split('.').pop();
        cb(null, `${uniqueSuffix}.${fileExtension}`);
    }
});

const upload =multer({
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 5           // 5 MB limit
    },
    fileFilter:(req, file, cb)=>{
        if(file.mimetype=="image/png"  || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg"){
            cb(null, true);
        }else{
            cb(new Error("File types .jpg, .jpeg, .png are allowed to upload"));
        }
    }
});

// uploading the file

// router.post("/uploadfile",upload.single('file'), (req,res)=>{
//     console.log(req.body);
//     console.log(req.file);
//     res.json({"filename": req.file.filename});

// });
// to download the file
const downloadFile=(req, res)=>{
    const filename= req.params.filename;
    const path= __dirname + "/uploads/";
    console.log("path is ", path);

    res.download(path+filename, (error)=>{
        if(error){
            res.status(500).send({ message: "File cannot be downloaded"});
        }
    })
}


module.exports={upload, downloadFile};

