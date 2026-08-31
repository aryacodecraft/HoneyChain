const QRCode = require("qrcode");

const generateBatchQR = async (batchId) => {
  const frontendUrl =
    process.env.FRONTEND_URL || "http://localhost:3000";

  const passportUrl =
    `${frontendUrl}/honey-passport/${encodeURIComponent(batchId)}`;

  const qrImage = await QRCode.toDataURL(passportUrl, {
    errorCorrectionLevel: "H",
    type: "image/png",
    width: 500,
    margin: 2,
  });

  return {
    qrCode: batchId,
    qrCodeImage: qrImage,
    passportUrl,
  };
};

module.exports = {
  generateBatchQR,
};