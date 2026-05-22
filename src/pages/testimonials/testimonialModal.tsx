import { useState, useEffect } from "react";
import { type Testimonial } from "../../types/testimonial";
import {
  createTestimonial,
  updateTestimonial,
} from "../../api/testimonialsApi";
import { AvatarPlaceholder } from "../../components/ui/AvatarPlaceholder";
import { getApiErrorMessage } from "../../utils/apiError";

interface Props {
  item: Testimonial | null;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const resetForm = () => ({
  name: "",
  email: "",
  designation: "",
  company: "",
  testimonial: "",
  image: null as File | null,
  preview: null as string | null,
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TestimonialModal = ({ item, onClose, onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setName(item.name);
      setEmail(item.email ?? "");
      setDesignation(item.designation ?? "");
      setCompany(item.company ?? "");
      setTestimonial(item.testimonial);
      setPreview(item.image ?? null);
      setImage(null);
    } else {
      const r = resetForm();
      setName(r.name);
      setEmail(r.email);
      setDesignation(r.designation);
      setCompany(r.company);
      setTestimonial(r.testimonial);
      setImage(r.image);
      setPreview(r.preview);
    }
    setErrors({});
  }, [item]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!item && email.trim() && !emailRegex.test(email.trim())) {
      next.email = "Enter a valid email address";
    }
    if (!designation.trim()) next.designation = "Designation is required";
    if (!company.trim()) next.company = "Company is required";
    if (!testimonial.trim()) next.testimonial = "Testimonial is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (!item && email.trim()) formData.append("email", email.trim());
      formData.append("designation", designation.trim());
      formData.append("company", company.trim());
      formData.append("testimonial", testimonial.trim());
      if (image) formData.append("image", image);

      const res = item
        ? await updateTestimonial(item._id, formData)
        : await createTestimonial(formData);

      const message = res.message ?? (item ? "Testimonial updated successfully." : "Testimonial added successfully.");
      onSuccess?.(message);
      onClose();
    } catch (err) {
      setErrors({ submit: getApiErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#C8ACD6] focus:border-transparent ${
      errors[field] ? "border-red-500" : "border-[#433D8B]"
    }`;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#F0EBF5] p-4 sm:p-6 rounded-xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto my-auto">
        <h2 className="text-base sm:text-lg font-semibold text-[#17153B] mb-4">
          {item ? "Edit" : "Add"} Testimonial
        </h2>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass("name")}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {!item && (
            <div>
              <label className="block text-sm font-medium text-[#17153B] mb-1">
                Email <span className="text-[#17153B]/60 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                required={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass("email")}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Job title"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className={fieldClass("designation")}
            />
            {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={fieldClass("company")}
            />
            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Testimonial <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Write the testimonial..."
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              rows={4}
              className={`${fieldClass("testimonial")} resize-none`}
            />
            {errors.testimonial && <p className="text-red-500 text-xs mt-1">{errors.testimonial}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">Photo (optional)</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#433D8B] bg-[#433D8B]/50 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <AvatarPlaceholder name={name || "?"} className="w-full h-full" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-[#17153B] file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#17153B] file:text-white file:cursor-pointer hover:file:bg-[#17153B]/90"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#433D8B] text-[#17153B] hover:bg-[#433D8B]/80 transition text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#17153B] text-white hover:bg-[#17153B]/90 disabled:opacity-50 transition text-sm sm:text-base"
            >
              {loading ? "Saving..." : item ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
