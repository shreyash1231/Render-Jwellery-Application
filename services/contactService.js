const Contact = require("../models/contactModel");
const { toCreateContactDTO, toUpdateContactDTO, toPublicContact } = require('../dto/contact.dto');

class ContactService {
    async createContact(data) {
        const dto = toCreateContactDTO(data);
        const contact = await Contact.create(dto);
        return { success: true, message: "Query added successfully", data: toPublicContact(contact) };
    }

    async getAllContact() {
        const contacts = await Contact.find().lean();
        if (!contacts.length) {
            throw new Error("No Query found");
        }
        return { success: true, message: "Queries fetched successfully", data: contacts.map(toPublicContact) };
    }

    async getByIdContact(id) {
        const contact = await Contact.findById(id).lean();
        if (!contact) {
            throw new Error("Query not found");
        }
        return { success: true, message: "Query fetched successfully", data: toPublicContact(contact) };
    }

    async updateContact(id, data) {
        const dto = toUpdateContactDTO(data);
        const updatedContact = await Contact.findByIdAndUpdate(id, dto, {
            new: true,
            runValidators: true,
        });
        if (!updatedContact) {
            throw new Error("Query not found");
        }
        return { success: true, message: "Query updated successfully", data: toPublicContact(updatedContact) };
    }

    async deleteContact(id) {
        const deleted = await Contact.findByIdAndDelete(id);
        if (!deleted) {
            throw new Error("Query not found");
        }
        return { success: true, message: "Query deleted successfully" };
    }
}

module.exports = new ContactService();