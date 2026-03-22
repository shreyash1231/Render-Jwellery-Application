const Address = require("../models/addressModel");

class AddressService {
  // CREATE ADDRESS (ONLY ONE ALLOWED)
  async createAddress(userId, payload) {
    const existingAddress = await Address.findOne({ userId }).lean();

    if (existingAddress) {
      return {
        success: false,
        message: "Address already exists. Please update the address.",
        data: null,
      };
    }

    const address = await Address.create({
      ...payload,
      userId,
      isDefault: true,
    });

    return {
      success: true,
      message: "Address created successfully",
      data: address,
    };
  }

  // GET ADDRESS (SINGLE)
  async getAddresses(userId) {
    const address = await Address.findOne({ userId }).lean();

    return {
      success: true,
      message: "Address fetched successfully",
      data: address,
    };
  }

  // GET ADDRESS BY ID
  async getAddressById(id) {
    const address = await Address.findById(id).lean();

    return {
      success: true,
      message: "Address fetched successfully",
      data: address,
    };
  }

  // UPDATE ADDRESS (ONLY ONE)
  async updateAddress(id, userId, payload) {
    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      payload,
      { new: true }
    ).lean();

    return {
      success: true,
      message: "Address updated successfully",
      data: address,
    };
  }

  // DELETE ADDRESS (OPTIONAL — you can disable this)
  async deleteAddress(id, userId) {
    const address = await Address.findOneAndDelete({
      _id: id,
      userId,
    }).lean();

    return {
      success: true,
      message: "Address deleted successfully",
      data: address,
    };
  }
}

module.exports = new AddressService();
