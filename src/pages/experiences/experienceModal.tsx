import { useState, useEffect } from "react";
import { type Experience } from "../../types/experience";
import {
  createExperience,
  updateExperience,
  updateExperienceIcon,
} from "../../api/experiencesApi";
import { ExperienceIconPreview } from "../../components/ui/ExperienceIconPreview";
import { getApiErrorMessage } from "../../utils/apiError";

interface Props {
  item: Experience | null;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const resetForm = () => ({
  title: "",
  companyName: "",
  iconBg: "#17153B",
  date: "",
  points: [""] as string[],
  sortOrder: 1,
  isActive: true,
  icon: null as File | null,
  preview: null as string | null,
});

export const ExperienceModal = ({ item, onClose, onSuccess }: Props) => {
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [iconBg, setIconBg] = useState("#17153B");
  const [date, setDate] = useState("");
  const [points, setPoints] = useState<string[]>([""]);
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [icon, setIcon] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setCompanyName(item.companyName);
      setIconBg(item.iconBg || "#17153B");
      setDate(item.date);
      setPoints(item.points.length > 0 ? [...item.points] : [""]);
      setSortOrder(item.sortOrder);
      setIsActive(item.isActive);
      setPreview(item.icon ?? null);
      setIcon(null);
    } else {
      const r = resetForm();
      setTitle(r.title);
      setCompanyName(r.companyName);
      setIconBg(r.iconBg);
      setDate(r.date);
      setPoints(r.points);
      setSortOrder(r.sortOrder);
      setIsActive(r.isActive);
      setIcon(r.icon);
      setPreview(r.preview);
    }
    setErrors({});
  }, [item]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setIcon(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const updatePoint = (index: number, value: string) => {
    setPoints((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const addPoint = () => setPoints((prev) => [...prev, ""]);

  const removePoint = (index: number) => {
    if (points.length <= 1) return;
    setPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Title is required";
    if (!companyName.trim()) next.companyName = "Company name is required";
    if (!date.trim()) next.date = "Date range is required";
    if (!/^#[0-9A-Fa-f]{6}$/.test(iconBg.trim())) {
      next.iconBg = "Enter a valid hex color (e.g. #17153B)";
    }
    if (sortOrder < 0 || !Number.isFinite(sortOrder)) {
      next.sortOrder = "Sort order must be 0 or greater";
    }
    const validPoints = points.filter((p) => p.trim());
    if (validPoints.length === 0) next.points = "At least one bullet point is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = () => ({
    title: title.trim(),
    companyName: companyName.trim(),
    iconBg: iconBg.trim(),
    date: date.trim(),
    points: points.filter((p) => p.trim()).map((p) => p.trim()),
    sortOrder: Number(sortOrder),
    isActive,
  });

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      const payload = buildPayload();
      let experienceId = item?.id;

      if (item) {
        await updateExperience(item.id, payload);
      } else {
        const res = await createExperience(payload);
        experienceId = res.data.id;
      }

      if (icon && experienceId) {
        await updateExperienceIcon(experienceId, icon);
      }

      const message = item
        ? "Experience updated successfully."
        : "Experience created successfully.";
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
      <div className="bg-[#F0EBF5] p-4 sm:p-6 rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto my-auto">
        <h2 className="text-base sm:text-lg font-semibold text-[#17153B] mb-4">
          {item ? "Edit" : "Add"} Experience
        </h2>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errors.submit}</div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Backend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={fieldClass("title")}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={fieldClass("companyName")}
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Date Range <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. March 2025 - Present"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass("date")}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#17153B] mb-1">Sort Order</label>
              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className={fieldClass("sortOrder")}
              />
              {errors.sortOrder && (
                <p className="text-red-500 text-xs mt-1">{errors.sortOrder}</p>
              )}
            </div>
            <div className="flex items-center pt-6 sm:pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-[#433D8B] text-[#C8ACD6] focus:ring-[#C8ACD6]"
                />
                <span className="text-sm text-[#17153B]">Active on portfolio</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Icon Background <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={iconBg}
                onChange={(e) => setIconBg(e.target.value)}
                className="w-10 h-10 rounded border border-[#433D8B] cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={iconBg}
                onChange={(e) => setIconBg(e.target.value)}
                placeholder="#17153B"
                className={fieldClass("iconBg")}
              />
            </div>
            {errors.iconBg && <p className="text-red-500 text-xs mt-1">{errors.iconBg}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Company Icon <span className="text-[#17153B]/60 font-normal">(optional)</span>
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <ExperienceIconPreview
                companyName={companyName || "?"}
                icon={preview}
                iconBg={iconBg}
                className="w-14 h-14 min-w-[3.5rem] min-h-[3.5rem]"
                variant="rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleIconChange}
                className="text-sm text-[#17153B] file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#17153B] file:text-white file:cursor-pointer hover:file:bg-[#17153B]/90"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#17153B]">
                Bullet Points <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addPoint}
                className="text-xs sm:text-sm text-[#C8ACD6] hover:underline font-medium"
              >
                + Add point
              </button>
            </div>
            {errors.points && <p className="text-red-500 text-xs mb-2">{errors.points}</p>}
            <div className="space-y-2">
              {points.map((point, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <textarea
                    placeholder="Describe your responsibility or achievement"
                    value={point}
                    onChange={(e) => updatePoint(index, e.target.value)}
                    rows={2}
                    className={`${fieldClass(`point${index}`)} flex-1 resize-none text-sm`}
                  />
                  {points.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePoint(index)}
                      className="text-xs text-red-600 hover:underline shrink-0 pt-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#433D8B] text-[#17153B] hover:bg-[#433D8B]/80 transition text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="button"
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
