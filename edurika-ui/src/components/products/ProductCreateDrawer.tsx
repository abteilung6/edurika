import React from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useProductCreate } from 'api/products'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { TextInput } from 'components/TextInput'
import { TextArea } from 'components/TextArea'
import { Button } from 'components/Button'
import { noop } from 'utils/common'
import { Alert } from 'components/Alert'
import { ProductType } from 'generated-api'
import { formatProductTypeLabel } from 'utils/products'

export interface ProductCreateDrawerProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const schema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  product_type: Yup.mixed<ProductType>()
    .oneOf(Object.values(ProductType), 'Invalid product type')
    .required('Product type is required')
})

export const ProductCreateDrawer: React.FC<ProductCreateDrawerProps> = ({
  open,
  setOpen
}) => {
  const productCreateMutation = useProductCreate()
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      product_type: ''
    },
    validationSchema: schema,
    onSubmit: async ({ title, description, product_type }) => {
      return productCreateMutation
        .mutateAsync({
          title,
          description_html: description,
          product_type: product_type as ProductType,
          vendor: 'vendor',
          tags: ['tag']
        })
        .then(() => setOpen(false))
        .catch(noop)
    }
  })

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <div className="fixed inset-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-2xl transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <form
                className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
                onSubmit={formik.handleSubmit}
              >
                <div className="flex-1">
                  {/* Header */}
                  <div className="bg-gray-50 px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between space-x-3">
                      <div className="space-y-1">
                        <DialogTitle className="text-base font-semibold text-gray-900">
                          Material erstellen
                        </DialogTitle>
                        <p className="text-sm text-gray-500">
                          Lade hier deine Materialen hoch und teile sie mit
                          anderen Lehrenden.
                        </p>
                      </div>
                      <div className="flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                    {productCreateMutation.isError && (
                      <div className="mb-4">
                        <Alert
                          title="Error"
                          description={productCreateMutation.error.message}
                        />
                      </div>
                    )}
                    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5"
                        >
                          Titel
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <TextInput
                          id="title"
                          name="title"
                          placeholder="Titel hier eingeben..."
                          value={formik.values.title}
                          validationError={
                            formik.touched.title && formik.errors.title
                              ? formik.errors.title
                              : undefined
                          }
                          required
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5"
                        >
                          Beschreibung
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <TextArea
                          id="description"
                          name="description"
                          rows={3}
                          value={formik.values.description}
                          placeholder="Beschreibung hier eingeben..."
                          validationError={
                            formik.touched.description &&
                            formik.errors.description
                              ? formik.errors.description
                              : undefined
                          }
                          required
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5"
                        >
                          Materialtyp
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm/6 text-gray-600">
                          Wähle ein Materialtype aus.
                        </p>
                        <div className="mt-6 space-y-6">
                          <fieldset>
                            {Object.values(ProductType).map(
                              (productType, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-x-3"
                                >
                                  <input
                                    id={productType}
                                    name="product_type"
                                    type="radio"
                                    value={productType}
                                    aria-valuetext={productType}
                                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                  <label
                                    htmlFor={productType}
                                    className="block text-sm/6 font-medium text-gray-900"
                                  >
                                    {formatProductTypeLabel(productType)}
                                  </label>
                                </div>
                              )
                            )}
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Abbrechen
                    </button>
                    <Button
                      type="submit"
                      disabled={
                        productCreateMutation.isPending ||
                        !formik.isValid ||
                        !formik.dirty
                      }
                    >
                      Material erstellen
                    </Button>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
