const Testimonial = require("../models/testimonialModel");
const { toCreateTestimonialDTO, toUpdateTestimonialDTO, toPublicTestimonial } = require('../dto/testimonial.dto');

class TestimonialService {

    async createTestimonial(data) {
        const testimonial = new Testimonial(data);
        await testimonial.save();
        return { success: true, message: "Testimonial created successfully", data: toPublicTestimonial(testimonial) };
    }

    async getAllTestimonials() {
        const start = Date.now();
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        const duration = Date.now() - start;
        if (duration > 200) {
            console.warn(`[SLOW QUERY] getAllTestimonials took ${duration}ms`);
        }
        if (testimonials.length === 0) {
            throw new Error("Testimonials not found");
        }
        return { success: true, message: "Testimonials fetched successfully", data: testimonials.map(toPublicTestimonial) };
    }

    async getTestimonialById(id) {
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            throw new Error("Testimonial not found");
        }
        return { success: true, message: "Data fetched successfully", data: toPublicTestimonial(testimonial) };
    }


    async updateTestimonial(id, data) {
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true });
        if (!updatedTestimonial) {
            throw new Error("Testimonial not found");
        }
        return { success: true, message: "Testimonial updated successfully", data: toPublicTestimonial(updatedTestimonial) };
    }

    async deleteTestimonial(id) {
        const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
        if (!deletedTestimonial) {
            throw new Error("Testimonial not found");
        }
        return { success: true, message: "Testimonial deleted successfully" };
    }
}

module.exports = new TestimonialService();