

let x = require('express');
let app = x();
let bodyParser = require('body-parser');
let path = require('path');

let cors = require('cors');

let fs = require('fs');
let multer = require('multer');
let mong = require('mongoose');
const { ObjectId } = require('mongodb');
let board = require('./models/board');
app.use(
    cors({
        origin: '*',
    })
);
app.use(x.json());



app.use(bodyParser.urlencoded({ extended: true }));


let uri = "mongodb+srv://muditrajsade:" + encodeURIComponent("Smr123bunny$#") + "@cluster0.oco2p.mongodb.net/THEPCI_VIT_BACKEND?retryWrites=true&w=majority&appName=Cluster0";
let cons = mong.createConnection(uri);

let imgs;

cons.once('open', () => {
    // Initialize GridFS stream
    
    imgs = new mong.mongo.GridFSBucket(cons.db, {
        bucketName: "board_member_images" // Set the bucket name
    });
    
    console.log('GridFS bucket for board memeber images is initialized');

});


const upload_board_images = multer({dest : 'board_member_images'});
async function upload_images(i){
    console.log(i);

    let rs = i.fieldname.toString();

    let g = await imgs.find({filename:rs}).toArray();
    console.log(g)
    if(g.length == 0){
        const readStream = fs.createReadStream(i.path);

        const filename = i.fieldname;

        let r = imgs.openUploadStream(filename);

        await readStream.pipe(r)
            .on('error', err => {
                console.error('Error uploading file to GridFS:', err);
                res.status(500).json({ error: 'Internal server error' });
            })
            .on('finish', () => {
                console.log('File uploaded to GridFS successfully');
            // Clean up the temporary file
                fs.unlink(i.path, err => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
            });
         
        });

    }
    else{

        const existingFileId = g[0]._id;
        
        await imgs.delete(existingFileId);
        const readStream = fs.createReadStream(i.path);

        const filename = i.fieldname;

        let r = imgs.openUploadStream(filename);

        await readStream.pipe(r)
            .on('error', err => {
                console.error('Error uploading file to GridFS:', err);
                res.status(500).json({ error: 'Internal server error' });
            })
            .on('finish', () => {
                console.log('File uploaded to GridFS successfully');
            // Clean up the temporary file
                fs.unlink(i.path, err => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
            });
         
        });

    }

}

async function update_name(k,name){

    let yher = "mongodb+srv://muditrajsade:" + encodeURIComponent("Smr123bunny$#") + "@cluster0.oco2p.mongodb.net/THEPCI_VIT_BACKEND?retryWrites=true&w=majority&appName=Cluster0";
    await mong.connect(yher);

    let i = await board.findOne({position : k});
    if(i == null){
        let chair_person = new board();
        chair_person.position = k;
        chair_person.full_name = name;
        await chair_person.save();
        console.log("chair_person added successfully");

    }
    else{
        const result = await board.updateOne(
            { position: k }, // filter criteria
            { $set: { full_name: name } } // update operation
        );
        console.log("updated chairperson name successfully");

    }





}
app.post('/upload',upload_board_images.fields([{name:'chairperson'},{name:'vice_chairperson'},{name:'General_Secretary_Events_and_Management'},{name:'General_Secretary_External_Affairs'},{name:'Editor_in_Chief_Newsletter'},{name:'Editor_in_Chief_Blogs_and_Documentation'},{name:'Director_of_PR'},{name:'Creative_Director'},{name:'Director_of_Media'},{name:'Director_of_Finance'},{name:'Video_Editing_Lead_Media'},{name:'HoV_Lead'}]),async function(req,res){


    await update_name("chairperson",req.body.chairperson_name);
    await update_name("vice_chairperson",req.body.vice_chairperson_name);
    await update_name("General_Secretary_Events_and_Management",req.body.General_Secretary_Events_and_Management_name);
    await update_name("General_Secretary_External_Affairs",req.body.General_Secretary_External_Affairs_name);
    await update_name("Editor_in_Chief_Newsletter",req.body.Editor_in_Chief_Newsletter_name);
    await update_name("Editor_in_Chief_Blogs_and_Documentation",req.body.Editor_in_Chief_Blogs_and_Documentation_name);
    await update_name("Director_of_PR",req.body.Director_of_PR_name);
    await update_name("Creative_Director",req.body.Creative_Director_name);
    await update_name("Director_of_Media",req.body.Director_of_Media_name);
    await update_name("Director_of_Finance",req.body.Director_of_Finance_name);
    await update_name("Video_Editing_Lead_Media",req.body.Video_Editing_Lead_Media_name);
    await update_name("HoV_Lead",req.body.HoV_Lead_name);
    


    

    await upload_images(req.files.chairperson[0]);
    await upload_images(req.files.vice_chairperson[0]);
    await upload_images(req.files.General_Secretary_Events_and_Management[0]);
    await upload_images(req.files.General_Secretary_External_Affairs[0]);
    await upload_images(req.files.Editor_in_Chief_Newsletter[0]);
    await upload_images(req.files.Editor_in_Chief_Blogs_and_Documentation[0]);
    await upload_images(req.files.Director_of_PR[0]);
    await upload_images(req.files.Creative_Director[0]);
    await upload_images(req.files.Director_of_Media[0]);
    await upload_images(req.files.Director_of_Finance[0]);
    await upload_images(req.files.Video_Editing_Lead_Media[0]);
    await upload_images(req.files.HoV_Lead[0]);

    res.status(200).json({message:'successfull'});

    

    



});

const readFilesToBuffers = async (file) => {
    
  
    const buffer = await new Promise((resolve, reject) => {
        const chunks = [];
        const readStream = imgs.openDownloadStream(file._id);
  
        readStream.on('data', chunk => chunks.push(chunk));
        readStream.on('end', () => resolve(Buffer.concat(chunks)));
        readStream.on('error', reject);
      });

    return buffer;
  
    
  };

app.get('/fetch/:n',async function(req,res){

    let r = req.params.n;

    let rt = await imgs.find({filename:r}).toArray();
    const b = await readFilesToBuffers(rt[0]);

    console.log("h");
    
    res.send(b);

    

});

app.post('/designation_fetch/:c/:vc/:gensec/:gsea/:ecn/:ecbd/:dpr/:cd/:dm/:df/:velm/:hl',async function(req,res){
    let yher = "mongodb+srv://muditrajsade:" + encodeURIComponent("Smr123bunny$#") + "@cluster0.oco2p.mongodb.net/THEPCI_VIT_BACKEND?retryWrites=true&w=majority&appName=Cluster0";
    await mong.connect(yher);
    
    let i = req.params.c;
    console.log(i);

    let c = await board.findOne({position : i});
    let vc = await board.findOne({position : req.params.vc});
    let gensec = await board.findOne({position : req.params.gensec});
    let gsea = await board.findOne({position : req.params.gsea});
    let ecn = await board.findOne({position : req.params.ecn});
    let ecbd = await board.findOne({position : req.params.ecbd});
    let dpr = await board.findOne({position : req.params.dpr});
    let cd = await board.findOne({position : req.params.cd});
    let dm = await board.findOne({position : req.params.dm});
    let df = await board.findOne({position : req.params.df});
    let velm = await board.findOne({position : req.params.velm});
    let hl = await board.findOne({position : req.params.hl});

   
    res.json({'chairperson' : c.full_name, 'vice_chairperson': vc.full_name,'gensec':gensec.full_name,'gsea':gsea.full_name,'ecn':ecn.full_name,'ecbd':ecbd.full_name,'dpr':dpr.full_name,'cd':cd.full_name,'dm':dm.full_name,'df':df.full_name,'velm':velm.full_name,'hl':hl.full_name});


});

app.get('/',function(req,res){

    res.sendFile(path.join(__dirname,'/index.html'));

});




app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
