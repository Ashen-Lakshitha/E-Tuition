const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types')
require('dotenv').config({ path: '../config/config.env' });

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID, 
    process.env.CLIENT_SECRET, 
    process.env.REDIRECT_URL);

oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

const drive = google.drive({version: 'v3', auth: oauth2Client});


exports.uploadFiles = async (fileName) =>{
    const filePath = path.join(__dirname, '../uploads/'+fileName);
    const mimeType = mime.lookup(fileName);
    try {
        const response = await drive.files.create({
            requestBody:{
                name: fileName,
                mimeType: mimeType,
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath)
            }
        });
        const res = await generatePublicLink(response.data.id);
        fs.unlinkSync(filePath);
        return {response: response.data, res: res};
        
    } catch (error) {
        throw error;
    }
}

async function generatePublicLink(fileId) {
    try {
        await drive.permissions.create({
            fileId:fileId,
            requestBody:{
                type: 'anyone',
                role: 'reader'
            }
        });
        
        const response = await drive.files.get({
            fileId:fileId,
            fields: 'webViewLink, webContentLink'
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
exports.deleteFile = async (fileId) => {
    try {
        const response = await drive.files.delete({
            fileId:fileId,
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}