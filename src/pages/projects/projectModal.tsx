import { useState, useEffect } from "react";
import { type Project, type ProjectButtonInput } from "../../types/project";
import {
  createProject,
  updateProject,
  updateProjectImage,
} from "../../api/projectsApi";
import { ProjectImagePlaceholder } from "../../components/ui/ProjectImagePlaceholder";
import { getApiErrorMessage } from "../../utils/apiError";

interface Props {
  item: Project | null;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const emptyButton = (): ProjectButtonInput => ({
  label: "",
  link: "",
  disabled: false,
});

const resetForm = () => ({
  name: "",
  description: "",
  isPrivate: false,
  isActive: true,
  sortOrder: 1,
  buttons: [emptyButton(), emptyButton()] as ProjectButtonInput[],
  image: null as File | null,
  preview: null as string | null,
});

export const ProjectModal = ({ item, onClose, onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [buttons, setButtons] = useState<ProjectButtonInput[]>([emptyButton(), emptyButton()]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setIsPrivate(item.isPrivate);
      setIsActive(item.isActive);
      setSortOrder(item.sortOrder);
      setButtons(
        item.buttons.length > 0
          ? item.buttons.map((b) => ({
              label: b.label,
              link: b.link ?? "",
              disabled: b.disabled,
            }))
          : [emptyButton()]
      );
      setPreview(item.image ?? null);
      setImage(null);
    } else {
      const r = resetForm();
      setName(r.name);
      setDescription(r.description);
      setIsPrivate(r.isPrivate);
      setIsActive(r.isActive);
      setSortOrder(r.sortOrder);
      setButtons(r.buttons);
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

  const updateButton = (index: number, field: keyof ProjectButtonInput, value: string | boolean) => {
    setButtons((prev) =>
      prev.map((btn, i) => (i === index ? { ...btn, [field]: value } : btn))
    );
  };

  const addButton = () => setButtons((prev) => [...prev, emptyButton()]);

  const removeButton = (index: number) => {
    if (buttons.length <= 1) return;
    setButtons((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!description.trim()) next.description = "Description is required";
    if (sortOrder < 0 || !Number.isFinite(sortOrder)) next.sortOrder = "Sort order must be 0 or greater";

    const validButtons = buttons.filter((b) => b.label.trim());
    if (validButtons.length === 0) next.buttons = "At least one button with a label is required";

    buttons.forEach((b, i) => {
      if (b.label.trim() && !b.disabled && !b.link?.trim()) {
        next[`buttonLink${i}`] = "Link is required when button is enabled";
      }
    });

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = () => ({
    name: name.trim(),
    description: description.trim(),
    isPrivate,
    sortOrder: Number(sortOrder),
    isActive,
    buttons: buttons
      .filter((b) => b.label.trim())
      .map((b) => ({
        label: b.label.trim(),
        link: b.disabled ? "" : (b.link?.trim() ?? ""),
        disabled: b.disabled,
      })),
  });

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      const payload = buildPayload();
      let projectId = item?.id;

      if (item) {
        await updateProject(item.id, payload);
      } else {
        const res = await createProject(payload);
        projectId = res.data.id;
      }

      if (image && projectId) {
        await updateProjectImage(projectId, image);
      }

      const message = item ? "Project updated successfully." : "Project created successfully.";
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
          {item ? "Edit" : "Add"} Project
        </h2>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errors.submit}</div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass("name")}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`${fieldClass("description")} resize-none`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
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
            <div className="flex flex-col gap-3 justify-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded border-[#433D8B] text-[#C8ACD6] focus:ring-[#C8ACD6]"
                />
                <span className="text-sm text-[#17153B]">Private project</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-[#433D8B] text-[#C8ACD6] focus:ring-[#C8ACD6]"
                />
                <span className="text-sm text-[#17153B]">Active (visible on portfolio)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#17153B] mb-1">
              Project Image <span className="text-[#17153B]/60 font-normal">(optional)</span>
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-24 h-16 rounded-lg overflow-hidden border-2 border-[#433D8B] bg-[#433D8B]/50 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ProjectImagePlaceholder name={name || "?"} className="w-full h-full rounded-none border-0" />
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#17153B]">
                Buttons <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addButton}
                className="text-xs sm:text-sm text-[#C8ACD6] hover:underline font-medium"
              >
                + Add button
              </button>
            </div>
            {errors.buttons && (
              <p className="text-red-500 text-xs mb-2">{errors.buttons}</p>
            )}
            <div className="space-y-3">
              {buttons.map((btn, index) => (
                <div
                  key={index}
                  className="p-3 bg-[#433D8B]/40 rounded-lg space-y-2 border border-[#433D8B]/60"
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-medium text-[#17153B]/80">Button {index + 1}</span>
                    {buttons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeButton(index)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Label (e.g. Live Demo)"
                    value={btn.label}
                    onChange={(e) => updateButton(index, "label", e.target.value)}
                    className={fieldClass(`buttonLabel${index}`)}
                  />
                  <input
                    type="url"
                    placeholder="Link URL"
                    value={btn.link ?? ""}
                    disabled={btn.disabled}
                    onChange={(e) => updateButton(index, "link", e.target.value)}
                    className={`${fieldClass(`buttonLink${index}`)} disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {errors[`buttonLink${index}`] && (
                    <p className="text-red-500 text-xs">{errors[`buttonLink${index}`]}</p>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={btn.disabled}
                      onChange={(e) => updateButton(index, "disabled", e.target.checked)}
                      className="rounded border-[#433D8B] text-[#C8ACD6] focus:ring-[#C8ACD6]"
                    />
                    <span className="text-xs text-[#17153B]">Disabled (no link required)</span>
                  </label>
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
