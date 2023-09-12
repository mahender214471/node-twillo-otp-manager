const twwilo = require("twilio");
const manager = class {
  /**
   *
   * @param {String} accountSid Your twiilo account sid
   * @param {String} authToken Your twiilo account authToken
   */
  constructor(accountSid, authToken, serviceSID) {
    try {
      this.accountSid = accountSid;
      this.authToken = authToken;
      this.client = twwilo(this.accountSid, this.authToken);
      this.serviceSID = serviceSID ? serviceSID : null;
    } catch (err) {
      throw err;
    }
  }
  /**
   *
   * @param {String} friendlyName Your app or service name which show in message
   * @param {String} OTPLenght Lenght of otp default = 6 digit
   * @param {Object} {}
   * @returns {object} {serviceSID , status}
   */
  async createServiceSID(friendlyName, OTPLenght, option = {}) {
    try {
      friendlyName ? friendlyName : "Your otp";
      OTPLenght ? OTPLenght : "6";
      const status = await this.client.verify.v2.services.create({
        friendlyName: friendlyName,
        codeLength: OTPLenght,
        ...option,
      });
      return {
        serviceSID: status?.sid,
        status,
      };
    } catch (err) {
      throw err;
    }
  }
  /**
   *
   * @param {String} mobile => Mobile/phone number with contary code on wich you send otp like +918545652541
   */
  async sendOTP(mobile) {
    try {
      const otpSendStatus = await this.client.verify.v2
        .services(this.serviceSID)
        .verifications.create({ to: mobile, channel: "sms" });
      return otpSendStatus;
    } catch (err) {
      throw err;
    }
  }
  /**
   *
   * @param {String} mobile
   * @param {String} OTP
   */
  async verifyOTP(mobile, OTP) {
    try {
      const verifyStatus = await this.client.verify.v2
        .services(this.serviceSID)
        .verificationChecks.create({
          to: mobile,
          code: OTP,
        });
      return verifyStatus;
    } catch (err) {
      throw err;
    }
  }
};
/**
 * 
 * @param {String} accountSid 
 * @param {String} authToken 
 * @param {String} serviceSID 
 * @returns {Object} 
 */
module.exports = (accountSid, authToken, serviceSID) => {
  const twiiloOTPManager = new manager(accountSid, authToken, serviceSID);
  return twiiloOTPManager;
};
