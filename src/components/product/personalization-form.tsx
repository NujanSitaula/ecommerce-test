'use client';

import { useState } from 'react';
import { ProductPersonalizationOption } from '@framework/types';
import { useTranslation } from 'src/app/i18n/client';

interface PersonalizationFormProps {
  options: ProductPersonalizationOption[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  lang: string;
}

export default function PersonalizationForm({
  options,
  values,
  onChange,
  lang,
}: PersonalizationFormProps) {
  const { t } = useTranslation(lang, 'common');
  const sortedOptions = [...options].sort((a, b) => a.order - b.order);

  const handleChange = (optionId: number, value: any) => {
    onChange({ ...values, [optionId]: value });
  };

  const handleFileChange = (optionId: number, file: File | null) => {
    if (file) {
      // Create object URL for preview
      const fileUrl = URL.createObjectURL(file);
      handleChange(optionId, { file, url: fileUrl });
    } else {
      const newValues = { ...values };
      delete newValues[optionId];
      onChange(newValues);
    }
  };

  if (options.length === 0) return null;

  return (
    <div className="pt-4 space-y-4 border-t border-border-base">
      <h3 className="text-sm font-semibold text-brand-dark md:text-base">
        {t('text-personalization') || 'Personalization Options'}
      </h3>
      {sortedOptions.map((option) => {
        const value = values[option.id];
        const hasError = option.required && !value;
        const priceAdjustment = option.price_adjustment
          ? ` (+$${option.price_adjustment.toFixed(2)})`
          : '';

        return (
          <div key={option.id} className="space-y-2">
            <label className="block text-sm font-medium text-brand-dark">
              {option.name}
              {option.required && <span className="text-red-500 ml-1">*</span>}
              {priceAdjustment && (
                <span className="text-brand text-xs ml-1">
                  {priceAdjustment}
                </span>
              )}
            </label>

            {/* Text Input */}
            {option.type === 'text' && (
              <div>
                <input
                  type="text"
                  value={value || ''}
                  onChange={(e) => handleChange(option.id, e.target.value)}
                  maxLength={option.max_length}
                  className={`w-full px-4 py-2 text-sm border rounded-md transition-colors duration-200 ${
                    hasError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-border-three focus:border-brand focus:ring-brand'
                  }`}
                  placeholder={t('text-enter-text') || 'Enter text'}
                />
                {option.max_length && (
                  <div className="flex justify-between mt-1 text-xs text-brand-muted">
                    <span>{value?.length || 0} / {option.max_length}</span>
                  </div>
                )}
                {hasError && (
                  <p className="mt-1 text-xs text-red-500">
                    {t('text-required') || 'This field is required'}
                  </p>
                )}
              </div>
            )}

            {/* Number Input */}
            {option.type === 'number' && (
              <div>
                <input
                  type="number"
                  value={value || ''}
                  onChange={(e) =>
                    handleChange(option.id, parseFloat(e.target.value) || '')
                  }
                  max={option.max_length}
                  className={`w-full px-4 py-2 text-sm border rounded-md transition-colors duration-200 ${
                    hasError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-border-three focus:border-brand focus:ring-brand'
                  }`}
                  placeholder={t('text-enter-number') || 'Enter number'}
                />
                {hasError && (
                  <p className="mt-1 text-xs text-red-500">
                    {t('text-required') || 'This field is required'}
                  </p>
                )}
              </div>
            )}

            {/* Select Dropdown */}
            {option.type === 'select' && option.options && (
              <div>
                <select
                  value={value || ''}
                  onChange={(e) => handleChange(option.id, e.target.value)}
                  className={`w-full px-4 py-2 text-sm border rounded-md transition-colors duration-200 ${
                    hasError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-border-three focus:border-brand focus:ring-brand'
                  }`}
                >
                  <option value="">
                    {t('text-select-option') || 'Select an option'}
                  </option>
                  {option.options.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {hasError && (
                  <p className="mt-1 text-xs text-red-500">
                    {t('text-required') || 'This field is required'}
                  </p>
                )}
              </div>
            )}

            {/* Color Picker/Select */}
            {option.type === 'color' && option.options && (
              <div>
                <div className="flex flex-wrap gap-2">
                  {option.options.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChange(option.id, color)}
                      className={`w-10 h-10 rounded border-2 transition-all ${
                        value === color
                          ? 'border-brand ring-2 ring-brand ring-offset-2'
                          : 'border-border-three hover:border-brand'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                {hasError && (
                  <p className="mt-1 text-xs text-red-500">
                    {t('text-required') || 'This field is required'}
                  </p>
                )}
              </div>
            )}

            {/* File Upload */}
            {option.type === 'file_upload' && (
              <div>
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange(option.id, e.target.files?.[0] || null)
                  }
                  accept="image/*"
                  className={`w-full px-4 py-2 text-sm border rounded-md transition-colors duration-200 ${
                    hasError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-border-three focus:border-brand focus:ring-brand'
                  }`}
                />
                {value?.url && (
                  <div className="mt-2">
                    <img
                      src={value.url}
                      alt="Preview"
                      className="max-w-full h-32 object-contain rounded-md border border-border-three"
                    />
                  </div>
                )}
                {hasError && (
                  <p className="mt-1 text-xs text-red-500">
                    {t('text-required') || 'This field is required'}
                  </p>
                )}
              </div>
            )}

            {/* Checkbox */}
            {option.type === 'checkbox' && (
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value || false}
                    onChange={(e) => handleChange(option.id, e.target.checked)}
                    className="w-4 h-4 text-brand border-border-three rounded focus:ring-brand"
                  />
                  <span className="text-sm text-brand-dark">
                    {t('text-checked') || 'Checked'}
                  </span>
                </label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

