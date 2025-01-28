import { useSignUpMutation } from 'api/users'
import { Alert } from 'components/Alert'
import { Button } from 'components/Button'
import { TextInput } from 'components/TextInput'
import { useFormik } from 'formik'
import { noop } from 'utils/common'
import * as Yup from 'yup'

const schema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
  username: Yup.string().required('Username is required'),
  public_name: Yup.string().required('Public name is required')
})

const SignUpPage: React.FC = () => {
  const signUpMutation = useSignUpMutation()
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      public_name: ''
    },
    validationSchema: schema,
    onSubmit: ({ username, email, password, public_name }) => {
      return signUpMutation
        .mutateAsync({
          username,
          password,
          email,
          public_name
        })
        .catch(noop)
    }
  })

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Edurika"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign up your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {signUpMutation.isError && (
          <div className="mb-4">
            <Alert title="Error" description={signUpMutation.error.message} />
          </div>
        )}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <TextInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            value={formik.values.email}
            validationError={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : undefined
            }
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <TextInput
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formik.values.password}
            validationError={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : undefined
            }
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <TextInput
            id="username"
            name="username"
            type="text"
            label="Username"
            value={formik.values.username}
            validationError={
              formik.touched.username && formik.errors.username
                ? formik.errors.username
                : undefined
            }
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <TextInput
            id="public_name"
            name="public_name"
            type="text"
            label="Public name"
            value={formik.values.public_name}
            validationError={
              formik.touched.public_name && formik.errors.public_name
                ? formik.errors.public_name
                : undefined
            }
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="pt-2">
            <Button
              type="submit"
              fullWidth
              disabled={
                signUpMutation.isPending || !formik.isValid || !formik.dirty
              }
            >
              Sign up now
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default SignUpPage
