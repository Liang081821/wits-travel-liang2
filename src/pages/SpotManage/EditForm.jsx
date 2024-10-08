import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import PropTypes from "prop-types";
import editSpot from "@/firebase/editSpot";

export default function EditForm({ showEditForm }) {
  const [isChecked, setIsChecked] = useState(false);
  const [fieldArrayError, setFieldArrayError] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onBlur", // 驗證模式 (onChange, onBlur, onSubmit, all)
    defaultValues: {
      id: showEditForm.id,
      title: showEditForm.title,
      subtitle: showEditForm.subtitle,
      main_img: showEditForm.main_img,
      img: showEditForm.img,
      area: showEditForm.area,
      country: showEditForm.country,
      city: showEditForm.city,
      brief: showEditForm.brief,
      description: showEditForm.description,
      transportation: showEditForm.transportation,
      price: showEditForm.price,
      spot_category: showEditForm.spot_category,
      click_count: showEditForm.click_count,
      isSelectedForCarousel: showEditForm.isSelectedForCarousel,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "img",
  });

  const handleBlur = () => {
    if (fields.length < 2) {
      setFieldArrayError("至少需要兩個圖片網址");
    } else {
      setFieldArrayError("");
    }
  };

  const handleRemove = (index) => {
    remove(index);
    if (fields.length - 1 < 2) {
      setFieldArrayError("至少需要兩個圖片網址");
    } else {
      setFieldArrayError("");
    }
  };

  const onSubmit = async (data) => {
    try {
      await editSpot(showEditForm.id, data); // 使用 editSpot 函數更新資料
      setFieldArrayError("");
      alert("已修改景點資料！");
      window.location.reload();
    } catch (error) {
      console.error("更新資料失敗: ", error);
      alert("更新資料失敗，請重試。");
    }
  };

  return (
    <div
      id="formContainer"
      className="w-full rounded-lg bg-white px-8 py-5 shadow-lg"
    >
      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Title */}
        <label htmlFor="title" className="mb-1 text-lg font-medium">
          完整標題
          <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          placeholder="範例：英國｜海德公園門票｜Hyde Park"
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <span className="text-red-500">完整標題是必填項目</span>
        )}

        {/* Subtitle */}
        <label htmlFor="subtitle" className="mb-1 text-lg font-medium">
          小標題（6字以內）
          <span className="-ml-2 text-red-500">*</span>
        </label>
        <input
          id="subtitle"
          placeholder="請勿超過6個字"
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...register("subtitle", { required: true, maxLength: 6 })}
        />
        {errors.subtitle && errors.subtitle.type === "required" && (
          <span className="text-red-500">小標題是必填項目</span>
        )}
        {errors.subtitle && errors.subtitle.type === "maxLength" && (
          <span className="text-red-500">小標題不得超過6個字</span>
        )}

        {/* Area */}
        <label htmlFor="area" className="mb-1 text-lg font-medium">
          地區
          <span className="text-red-500">*</span>
        </label>
        <input
          id="area"
          placeholder="範例：歐洲"
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...register("area", { required: true })}
        />
        {errors.area && <span className="text-red-500">地區是必填項目</span>}

        {/* Country */}
        <label htmlFor="country" className="mb-1 text-lg font-medium">
          國家
          <span className="text-red-500">*</span>
        </label>
        <input
          id="country"
          placeholder="範例：英國"
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...register("country", { required: true })}
        />
        {errors.country && <span className="text-red-500">國家是必填項目</span>}

        {/* City */}
        <label htmlFor="city" className="mb-1 text-lg font-medium">
          城市
          <span className="text-red-500">*</span>
        </label>
        <input
          id="city"
          placeholder="範例：倫敦"
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...register("city", { required: true })}
        />
        {errors.city && <span className="text-red-500">城市是必填項目</span>}

        {/* Main Image */}
        <label htmlFor="main_img" className="mb-1 text-lg font-medium">
          主圖片網址
          <span className="text-red-500">*</span>
        </label>
        <input
          id="main_img"
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          placeholder="需為有效 URL"
          {...register("main_img", {
            required: "主圖片網址是必填項目",
            pattern: {
              value: /^(ftp|http|https):\/\/[^ "]+$/,
              message: "無效的 URL",
            },
          })}
        />
        {errors.main_img && (
          <span className="text-red-500">{errors.main_img.message}</span>
        )}

        {/* 其他圖片網址欄位 */}
        <label htmlFor="img" className="mb-2 text-lg">
          其他圖片網址（至少2張）
          <span className="-ml-2 text-red-500">*</span>
        </label>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-2 flex items-center">
            <input
              type="text"
              placeholder={`圖片網址 ${index + 1}`}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              {...register(`img.${index}`, {
                required: "圖片網址是必填項目",
                pattern: {
                  value: /^(ftp|http|https):\/\/[^ "]+$/,
                  message: "無效的 URL",
                },
                onBlur: handleBlur,
              })}
            />
            {errors.img && errors.img[index] && (
              <span className="ml-2 text-red-500">
                {errors.img[index]?.message}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                handleRemove(index);
              }}
              className="ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        ))}

        {/* 添加圖片網址按鈕 */}
        <button
          type="button"
          className="self-start rounded-md border border-gray-300 px-3 py-2 shadow-sm"
          onClick={() => append("")}
        >
          添加圖片網址
        </button>
        {/* 確認最少兩個圖片網址的錯誤訊息 */}
        {fieldArrayError && (
          <div className="text-red-500">{fieldArrayError}</div>
        )}

        {/* Brief */}
        <label htmlFor="brief" className="mb-1 text-lg font-medium">
          簡介（20字以內）
          <span className="-ml-2 text-red-500">*</span>
        </label>
        <input
          id="brief"
          placeholder="請勿超過20個字"
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...register("brief", { required: true, maxLength: 20 })}
        />
        {errors.brief && errors.brief.type === "required" && (
          <span className="text-red-500">簡介是必填項目</span>
        )}
        {errors.brief && errors.brief.type === "maxLength" && (
          <span className="text-red-500">簡介不得超過20個字</span>
        )}

        {/* Description */}
        <label htmlFor="description" className="mb-1 text-lg font-medium">
          詳細介紹
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          className="h-72 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...register("description", { required: true })}
        />
        {errors.description && (
          <span className="text-red-500">詳細介紹是必填項目</span>
        )}

        {/* Transportation */}
        <label htmlFor="transportation" className="mb-1 text-lg font-medium">
          交通資訊
          <span className="text-red-500">*</span>
        </label>
        <input
          id="transportation"
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...register("transportation", { required: true })}
        />
        {errors.transportation && (
          <span className="text-red-500">交通資訊是必填項目</span>
        )}

        {/* Price */}
        <label htmlFor="price" className="mb-1 text-lg font-medium">
          價格
          <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="price"
          min="0"
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...register("price", { required: true, valueAsNumber: true })}
        />
        {errors.price && <span className="text-red-500">價格是必填項目</span>}

        {/* Category */}
        <label htmlFor="spot_category" className="mb-1 text-lg font-medium">
          類別
          <span className="text-red-500">*</span>
        </label>
        <select
          id="spot_category"
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...register("spot_category", { required: true })}
        >
          <option value="自然風景">自然風景</option>
          <option value="博物館 & 美術館">博物館 & 美術館</option>
          <option value="樂園">樂園</option>
          <option value="歷史景點">歷史景點</option>
          <option value="特色建築">特色建築</option>
        </select>
        {errors.spot_category && (
          <span className="text-red-500">類別是必填項目</span>
        )}
        {/* Checkbox */}
        <div className="mt-4 flex items-center self-center">
          <input
            type="checkbox"
            id="confirmation"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="confirmation" className="text-base text-gray-700">
            已確實檢查以上內容
          </label>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isChecked || isSubmitting || !isValid || fields.length < 2}
          className={`mt-4 h-10 w-1/4 self-center rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-lg text-white transition-opacity duration-200 ease-in-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isSubmitting ? "提交中..." : "儲存景點"}
        </button>
      </form>
    </div>
  );
}

EditForm.propTypes = {
  showEditForm: PropTypes.object,
};
