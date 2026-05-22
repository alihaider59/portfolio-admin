import { useState, useEffect } from "react";
import { type Skill } from "../../types/skill";
import { createSkill, updateSkill, updateSkillIcon } from "../../api/skillsApi";
import { SkillIconPreview } from "../../components/ui/SkillIconPreview";
import { getApiErrorMessage } from "../../utils/apiError";

interface Props {
  item: Skill | null;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

export const SkillModal = ({ item, onClose, onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [icon, setIcon] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setName(item.name);
      setSortOrder(item.sortOrder);
      setIsActive(item.isActive);
      setPreview(item.icon ?? null);
      setIcon(null);
    } else {
      setName("");
      setSortOrder(1);
      setIsActive(true);
      setIcon(null);
      setPreview(null);
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

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Skill name is required";
    if (sortOrder < 0 || !Number.isFinite(sortOrder)) {
      next.sortOrder = "Sort order must be 0 or greater";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      const payload = {
        name: name.trim(),
        sortOrder: Number(sortOrder),
        isActive,
      };
      let skillId = item?.id;

      if (item) {
        await updateSkill(item.id, payload);
      } else {
        const res = await createSkill(payload);
        skillId = res.data.id;
      }

      if (icon && skillId) {
        await updateSkillIcon(skillId, icon);
      }

      const message = item ? "Skill updated successfully." : "Skill created successfully.";
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
          {item ? "Edit" : "Add"} Skill
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
              placeholder="e.g. React JS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass("name")}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
              Icon <span className="text-[#17153B]/60 font-normal">(optional)</span>
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <SkillIconPreview name={name || "?"} icon={preview} className="w-14 h-14" />
              <input
                type="file"
                accept="image/*"
                onChange={handleIconChange}
                className="text-sm text-[#17153B] file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#17153B] file:text-white file:cursor-pointer hover:file:bg-[#17153B]/90"
              />
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
