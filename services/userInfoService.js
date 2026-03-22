const UserInfo = require("../models/userInfoModel");
const { toCreateUserInfoDTO, toPublicUserInfo } = require("../dto/userInfo.dto");

class UserInfoService {
  async createUserInfo(data) {
    const dto = toCreateUserInfoDTO(data);
    const userInfo = await UserInfo.create(dto);
    return {
      success: true,
      message: "User details submitted successfully",
      data: toPublicUserInfo(userInfo),
    };
  }

  async getAllUserInfo() {
    const userInfoList = await UserInfo.find().sort({ createdAt: -1 }).lean();
    return {
      success: true,
      message: "User details fetched successfully",
      data: userInfoList.map(toPublicUserInfo),
    };
  }
}

module.exports = new UserInfoService();
