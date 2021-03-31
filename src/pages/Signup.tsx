import { gql, useMutation } from "@apollo/client";
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useHistory } from "react-router-dom";

const SIGNUP_MUTATION = gql`
  mutation signup($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

interface ISignupValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export const Signup = () => {
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signup, { data }] = useMutation(SIGNUP_MUTATION);

  const initialValues: ISignupValues = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid Email address")
      .required("Email required"),
    password: yup
      .string()
      .max(20, "Must be 20 characters or less")
      .required("Password Required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Password must match"),
    name: yup
      .string()
      .max(15, "Must be 15 characters or less")
      .required("Name required"),
  });

  return (
    <div>
      <h3>Sign up</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await signup({
            variables: values,
          });
          localStorage.setItem("token", response.data.signup.token);
          setSubmitting(false);
          history.push("/users");
        }}
      >
        <Form>
          <Field name="email" type="text" placeholder="Email" />
          <ErrorMessage name="email" component={"div"} />
          <Field name="name" type="text" placeholder="name" />
          <ErrorMessage name="name" component={"div"} />
          <Field name="password" type="password" placeholder="password" />
          <ErrorMessage name="password" component={"div"} />
          <Field
            name="confirmPassword"
            type="password"
            placeholder="confirmPassword"
          />
          <ErrorMessage name="confirmPassword" component={"div"} />
          <button type="submit" className="signup-button">
            <span>Sign up</span>
          </button>
        </Form>
      </Formik>
      <div>
        <h4>Already have an account ?</h4>
        <Link to="/login">Log in</Link>
      </div>
    </div>
  );
};
