import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Save, 
  Send, 
  FileText, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Settings,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

const CreateTenderPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Основная информация
    title: '',
    description: '',
    type: 'goods',
    method: 'open_tender',
    budget: '',
    currency: 'KZT',
    region: '',
    
    // Сроки
    deadlines: {
      applicationStart: '',
      applicationEnd: '',
      executionStart: '',
      executionEnd: '',
      clarificationDeadline: '',
    },
    
    // Критерии оценки
    criteria: {
      evaluationCriteria: ['Цена', 'Качество', 'Сроки исполнения'],
      qualificationRequirements: [],
      technicalRequirements: {},
      priceWeight: 70,
      qualityWeight: 20,
      timelineWeight: 10,
      guaranteeRequired: false,
      guaranteeAmount: 0,
      advancePayment: 0,
      nationalRegime: false,
    },
    
    // Документы
    docs: {
      technicalSpecification: [],
      legalDocuments: [],
      additionalDocuments: [],
      templates: [],
    },
    
    // Дополнительная информация
    contactInfo: {
      contactPerson: '',
      phone: '',
      email: '',
    },
    deliveryTerms: {
      location: '',
      terms: '',
    },
    paymentTerms: {
      method: '',
      schedule: '',
    },
  });

  const steps = [
    { id: 1, title: t('tender.basicInfo'), icon: FileText },
    { id: 2, title: t('tender.deadlines'), icon: Calendar },
    { id: 3, title: t('tender.criteria'), icon: Settings },
    { id: 4, title: t('tender.documents'), icon: Upload },
    { id: 5, title: t('tender.additionalInfo'), icon: Info },
  ];

  const tenderTypes = [
    { value: 'goods', label: t('tender.types.goods') },
    { value: 'services', label: t('tender.types.services') },
    { value: 'works', label: t('tender.types.works') },
  ];

  const tenderMethods = [
    { value: 'open_tender', label: t('tender.methods.openTender') },
    { value: 'limited_tender', label: t('tender.methods.limitedTender') },
    { value: 'single_source', label: t('tender.methods.singleSource') },
    { value: 'request_for_quotations', label: t('tender.methods.requestForQuotations') },
  ];

  const regions = [
    'Алматы', 'Нур-Султан', 'Шымкент', 'Алматинская область', 
    'Акмолинская область', 'Актюбинская область', 'Атырауская область',
    'Восточно-Казахстанская область', 'Жамбылская область', 'Западно-Казахстанская область',
    'Карагандинская область', 'Костанайская область', 'Кызылординская область',
    'Мангистауская область', 'Павлодарская область', 'Северо-Казахстанская область',
    'Туркестанская область'
  ];

  const handleInputChange = (field, value, nested = null) => {
    setFormData(prev => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...prev[nested],
            [field]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });

    // Clear errors when user starts typing
    if (errors[field] || (nested && errors[`${nested}.${field}`])) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        delete newErrors[`${nested}.${field}`];
        return newErrors;
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title || formData.title.length < 10) {
          newErrors.title = t('tender.validation.titleMinLength');
        }
        if (!formData.description || formData.description.length < 50) {
          newErrors.description = t('tender.validation.descriptionMinLength');
        }
        if (!formData.budget || formData.budget <= 0) {
          newErrors.budget = t('tender.validation.budgetRequired');
        }
        if (!formData.region) {
          newErrors.region = t('tender.validation.regionRequired');
        }
        break;

      case 2:
        const now = new Date();
        const applicationStart = new Date(formData.deadlines.applicationStart);
        const applicationEnd = new Date(formData.deadlines.applicationEnd);
        const executionStart = new Date(formData.deadlines.executionStart);
        const executionEnd = new Date(formData.deadlines.executionEnd);

        if (!formData.deadlines.applicationStart) {
          newErrors['deadlines.applicationStart'] = t('tender.validation.applicationStartRequired');
        } else if (applicationStart <= now) {
          newErrors['deadlines.applicationStart'] = t('tender.validation.applicationStartFuture');
        }

        if (!formData.deadlines.applicationEnd) {
          newErrors['deadlines.applicationEnd'] = t('tender.validation.applicationEndRequired');
        } else if (applicationEnd <= applicationStart) {
          newErrors['deadlines.applicationEnd'] = t('tender.validation.applicationEndAfterStart');
        }

        if (!formData.deadlines.executionStart) {
          newErrors['deadlines.executionStart'] = t('tender.validation.executionStartRequired');
        } else if (executionStart <= applicationEnd) {
          newErrors['deadlines.executionStart'] = t('tender.validation.executionStartAfterApplication');
        }

        if (!formData.deadlines.executionEnd) {
          newErrors['deadlines.executionEnd'] = t('tender.validation.executionEndRequired');
        } else if (executionEnd <= executionStart) {
          newErrors['deadlines.executionEnd'] = t('tender.validation.executionEndAfterStart');
        }

        // Check minimum application period
        const minDays = formData.method === 'open_tender' ? 7 : 3;
        const applicationPeriodDays = Math.ceil((applicationEnd - applicationStart) / (1000 * 60 * 60 * 24));
        if (applicationPeriodDays < minDays) {
          newErrors['deadlines.applicationEnd'] = t('tender.validation.minApplicationPeriod', { days: minDays });
        }
        break;

      case 3:
        const totalWeight = formData.criteria.priceWeight + formData.criteria.qualityWeight + formData.criteria.timelineWeight;
        if (totalWeight !== 100) {
          newErrors['criteria.weights'] = t('tender.validation.weightsTotal100');
        }
        if (formData.criteria.evaluationCriteria.length === 0) {
          newErrors['criteria.evaluationCriteria'] = t('tender.validation.evaluationCriteriaRequired');
        }
        break;

      case 4:
        if (formData.docs.technicalSpecification.length === 0) {
          newErrors['docs.technicalSpecification'] = t('tender.validation.technicalSpecRequired');
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/lots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const tender = await response.json();
        navigate(`/my-tenders/${tender.id}`, { 
          state: { message: t('tender.draftSaved') }
        });
      } else {
        const error = await response.json();
        setErrors({ submit: error.message });
      }
    } catch (error) {
      setErrors({ submit: t('tender.saveDraftError') });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    // Validate all steps
    let allValid = true;
    for (let i = 1; i <= steps.length; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setCurrentStep(i);
        break;
      }
    }

    if (!allValid) return;

    setLoading(true);
    try {
      // First create the tender
      const createResponse = await fetch('/api/lots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (createResponse.ok) {
        const tender = await createResponse.json();
        
        // Then publish it
        const publishResponse = await fetch(`/api/lots/${tender.id}/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            createEscrow: true,
            escrowDeposit: formData.budget * 0.5, // 50% deposit
          }),
        });

        if (publishResponse.ok) {
          navigate('/my-tenders', { 
            state: { message: t('tender.publishedSuccessfully') }
          });
        } else {
          const error = await publishResponse.json();
          setErrors({ submit: error.message });
        }
      } else {
        const error = await createResponse.json();
        setErrors({ submit: error.message });
      }
    } catch (error) {
      setErrors({ submit: t('tender.publishError') });
    } finally {
      setLoading(false);
    }
  };

  const addCriterion = () => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        evaluationCriteria: [...prev.criteria.evaluationCriteria, ''],
      },
    }));
  };

  const removeCriterion = (index) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        evaluationCriteria: prev.criteria.evaluationCriteria.filter((_, i) => i !== index),
      },
    }));
  };

  const updateCriterion = (index, value) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        evaluationCriteria: prev.criteria.evaluationCriteria.map((item, i) => 
          i === index ? value : item
        ),
      },
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('tender.basicInformation')}
            </h3>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tender.title')} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('tender.titlePlaceholder')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tender.description')} *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('tender.descriptionPlaceholder')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Type and Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tender.type')} *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tenderTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tender.method')} *
                </label>
                <select
                  value={formData.method}
                  onChange={(e) => handleInputChange('method', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tenderMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tender.budget')} *
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || '')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.budget ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="1"
                />
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tender.currency')}
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="KZT">KZT</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="RUB">RUB</option>
                </select>
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tender.region')} *
              </label>
              <select
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.region ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t('tender.selectRegion')}</option>
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="mt-1 text-sm text-red-600">{errors.region}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('tender.deadlines')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tender.applicationStart')} *
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadlines.applicationStart}
                  onChange={(e) => handleInputChange('applicationStart', e.target.value, 'deadlines')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['deadlines.applicationStart'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['deadlines.applicationStart'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['deadlines.applicationStart']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tender.applicationEnd')} *
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadlines.applicationEnd}
                  onChange={(e) => handleInputChange('applicationEnd', e.target.value, 'deadlines')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['deadlines.applicationEnd'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['deadlines.applicationEnd'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['deadlines.applicationEnd']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tender.executionStart')} *
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadlines.executionStart}
                  onChange={(e) => handleInputChange('executionStart', e.target.value, 'deadlines')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['deadlines.executionStart'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['deadlines.executionStart'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['deadlines.executionStart']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('tender.executionEnd')} *
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadlines.executionEnd}
                  onChange={(e) => handleInputChange('executionEnd', e.target.value, 'deadlines')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['deadlines.executionEnd'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['deadlines.executionEnd'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['deadlines.executionEnd']}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tender.clarificationDeadline')}
              </label>
              <input
                type="datetime-local"
                value={formData.deadlines.clarificationDeadline}
                onChange={(e) => handleInputChange('clarificationDeadline', e.target.value, 'deadlines')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('tender.evaluationCriteria')}
            </h3>

            {/* Evaluation Criteria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tender.criteriaList')} *
              </label>
              {formData.criteria.evaluationCriteria.map((criterion, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={criterion}
                    onChange={(e) => updateCriterion(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('tender.criterionPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => removeCriterion(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCriterion}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4 mr-1" />
                {t('tender.addCriterion')}
              </button>
              {errors['criteria.evaluationCriteria'] && (
                <p className="mt-1 text-sm text-red-600">{errors['criteria.evaluationCriteria']}</p>
              )}
            </div>

            {/* Weights */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tender.criteriaWeights')}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {t('tender.priceWeight')} (%)
                  </label>
                  <input
                    type="number"
                    value={formData.criteria.priceWeight}
                    onChange={(e) => handleInputChange('priceWeight', parseInt(e.target.value) || 0, 'criteria')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {t('tender.qualityWeight')} (%)
                  </label>
                  <input
                    type="number"
                    value={formData.criteria.qualityWeight}
                    onChange={(e) => handleInputChange('qualityWeight', parseInt(e.target.value) || 0, 'criteria')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {t('tender.timelineWeight')} (%)
                  </label>
                  <input
                    type="number"
                    value={formData.criteria.timelineWeight}
                    onChange={(e) => handleInputChange('timelineWeight', parseInt(e.target.value) || 0, 'criteria')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              {errors['criteria.weights'] && (
                <p className="mt-1 text-sm text-red-600">{errors['criteria.weights']}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {t('tender.totalWeight')}: {formData.criteria.priceWeight + formData.criteria.qualityWeight + formData.criteria.timelineWeight}%
              </p>
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="guaranteeRequired"
                  checked={formData.criteria.guaranteeRequired}
                  onChange={(e) => handleInputChange('guaranteeRequired', e.target.checked, 'criteria')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="guaranteeRequired" className="ml-2 text-sm text-gray-700">
                  {t('tender.guaranteeRequired')}
                </label>
              </div>

              {formData.criteria.guaranteeRequired && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('tender.guaranteeAmount')}
                  </label>
                  <input
                    type="number"
                    value={formData.criteria.guaranteeAmount}
                    onChange={(e) => handleInputChange('guaranteeAmount', parseFloat(e.target.value) || 0, 'criteria')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="nationalRegime"
                  checked={formData.criteria.nationalRegime}
                  onChange={(e) => handleInputChange('nationalRegime', e.target.checked, 'criteria')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="nationalRegime" className="ml-2 text-sm text-gray-700">
                  {t('tender.nationalRegime')}
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('tender.documents')}
            </h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">{t('tender.uploadDocuments')}</p>
              <p className="text-sm text-gray-500">{t('tender.supportedFormats')}</p>
              <button
                type="button"
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {t('tender.selectFiles')}
              </button>
            </div>

            {errors['docs.technicalSpecification'] && (
              <p className="text-sm text-red-600">{errors['docs.technicalSpecification']}</p>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    {t('tender.requiredDocuments')}
                  </h4>
                  <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                    <li>{t('tender.technicalSpecification')}</li>
                    <li>{t('tender.legalDocuments')}</li>
                    <li>{t('tender.evaluationMethodology')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('tender.additionalInformation')}
            </h3>

            {/* Contact Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                {t('tender.contactInformation')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('tender.contactPerson')}
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value, 'contactInfo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('tender.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value, 'contactInfo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('tender.email')}
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value, 'contactInfo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Terms */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                {t('tender.deliveryTerms')}
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('tender.deliveryLocation')}
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryTerms.location}
                    onChange={(e) => handleInputChange('location', e.target.value, 'deliveryTerms')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('tender.deliveryConditions')}
                  </label>
                  <textarea
                    value={formData.deliveryTerms.terms}
                    onChange={(e) => handleInputChange('terms', e.target.value, 'deliveryTerms')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                {t('tender.paymentTerms')}
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('tender.paymentMethod')}
                  </label>
                  <select
                    value={formData.paymentTerms.method}
                    onChange={(e) => handleInputChange('method', e.target.value, 'paymentTerms')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t('tender.selectPaymentMethod')}</option>
                    <option value="prepayment">{t('tender.prepayment')}</option>
                    <option value="postpayment">{t('tender.postpayment')}</option>
                    <option value="installments">{t('tender.installments')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('tender.paymentSchedule')}
                  </label>
                  <textarea
                    value={formData.paymentTerms.schedule}
                    onChange={(e) => handleInputChange('schedule', e.target.value, 'paymentTerms')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('tender.paymentSchedulePlaceholder')}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('tender.createTender')}
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-blue-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`ml-4 w-8 h-0.5 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-6">
            {renderStepContent()}

            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.previous')}
            </button>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveDraft}
                disabled={loading}
                className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {t('tender.saveDraft')}
              </button>

              {currentStep < steps.length ? (
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t('common.next')}
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? t('tender.publishing') : t('tender.publish')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTenderPage;
