const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { getMaxListeners } = require('process');
const cors = require('cors')({origin: true});
admin.initializeApp();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:"rentinsider@gmail.com",
        pass:""
    }
});


exports.rentReminder = functions.pubsub.schedule('0 0 1 * *').onRun((context) => {
    var currentDate=new Date;
    var DueDate;
    var currentDay=currentDate.getDate();
    var snapshot = admin.firestore().collection('Properties').get().then(result=>{
        result.forEach(doc=>{
                DueDate=doc.data().due_date;
                if(((Number(DueDate)-Number(currentDay))<=7)&&((Number(DueDate)-Number(currentDay))>0)){
                    var renterID=doc.data().renterID;
                    if((renterID!='')&&(renterID!=undefined)){
                    var currentRenter=admin.firestore().collection('Renters').doc(renterID).get().then(res=>{
                        const mailOptions = {
                        from: 'rentinsider@gmail.com', 
                        to: res.data().email,
                        subject: 'Reminder plata chirie - RentInsider',
                        html: `<p style="font-size: 16px;"></p>
                            <br />
                            <p>Data scadenta pentru plata chiriei:</p> <p>${doc.data().due_date}/${currentDate.getMonth()+1}/${currentDate.getFullYear()} </p> 
                            <p> Zile ramase: ${Number(DueDate)-Number(currentDay)}.</p>`
                    };
                    return transporter.sendMail(mailOptions, (erro, info) => {
                        if(erro){
                            return -1;
                        }
                        return 1;
                    })
                    });
                }
            }
        });
    });
    return null;
});

exports.sendChatNotificationViaEmail=functions.firestore.document('Chats/{docId}')
.onCreate((snap,context)=>{
    const data=snap.data();    
    if(data.type=="join"){
        console.log("found message of type join");
        return -1;
    }
    var senderEmail;
    var recipientEmail;
    var senderId=data.sender;
    var subjectId=data.subjectID;
    var sentMessage=data.message;
    var ownerEmail;
    var renterEmail;
    /*preluarea propertyID din cadrul subiectului*/
    var currentSubject=admin.firestore().collection('Subjects').doc(subjectId).get().then(res=>{
        var currentPropertyID=res.data().propertyID;
        /*preluarea ownerID si renterID din cadrul proprietatii*/
        var currentProperty=admin.firestore().collection('Properties').doc(currentPropertyID).get().then(res2=>{
            var ownerId=res2.data().ownerID;
            var renterId=res2.data().renterID;
            /*preluarea owner.email din documentul in care se afla datele proprietarului*/
            var ownerData=admin.firestore().collection('Owners').doc(ownerId).get().then(owner=>{
                ownerEmail=owner.data().email;
            /*preluarea renter.email din documentul in care se afla datele chiriasului*/
            var RenterData=admin.firestore().collection('Renters').doc(renterId).get().then(renter=>{
                renterEmail=renter.data().email;
                 /*se afla care dintre persoanele angajate in conversatie este emitatorul si care este recipientul*/
            /*daca emitatorul este proprietarul*/
            if(senderId==ownerId){
                senderEmail=ownerEmail;
                recipientEmail=renterEmail;
            }else{
                senderEmail=renterEmail;
                recipientEmail=ownerEmail;
            }
            const mailOptions = {
                from: 'rentinsider@gmail.com', 
                to: recipientEmail,
                subject: 'RentInsider Mesagerie',
                html: `<p style="font-size: 16px;"></p>
                    <br />
                    <p>Ai primit un mesaj prin intermediul RentInsider Mesagerie:</p> 
                    <p>${senderEmail}:${sentMessage}</p> `
            };
            return transporter.sendMail(mailOptions, (erro, info) => {
                if(erro){
                    return -1;
                }
                return 1;
            })
            });
        });
        });
    })
    return null;
});
        

exports.scheduledRentSubmition = functions.pubsub.schedule('0 0 1 * *').onRun((context) =>{
    var currentDate=new Date;
    var today=new Date().toISOString().slice(0, 10);
    var currentMonth=currentDate.getMonth()+1;
    var previousMonth=currentDate.getMonth();
    admin.firestore().collection('Properties').get().then(result=>{
        result.forEach(doc=>{
                var currentProperty=doc.data();
                var currentPropertyID=doc.id;
                if((currentProperty.renterID!=undefined)&&(currentProperty.renterID!="")){
                admin.firestore().collection('Expenses').add({
                    due:true,
                    consumed:"",
                    date_of_submition:today,
                    pdf:'',
                    duration:
                    {
                        start:currentProperty.due_date+"/"+previousMonth+"/"+currentDate.getFullYear(),
                        end:currentProperty.due_date+"/"+currentMonth+"/"+currentDate.getFullYear(),
                    },
                    service:"Chirie",
                    sum:currentProperty.price,
                    type:"Chirie",
                    propertyID:currentPropertyID,
                }).catch((error) => {
                    console.error("Error adding expense: ", error);
                });
            }
        });
    });
    return null;
});




