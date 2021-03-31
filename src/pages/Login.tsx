import { gql, useMutation } from "@apollo/client";
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useHistory, Link } from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

interface ILoginValues {
  email: string;
  password: string;
}

export const Login = () => {
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [login, { data }] = useMutation(LOGIN_MUTATION);

  const initialValues: ILoginValues = {
    email: "",
    password: "",
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
  });

  return (
    <div>
      <h1>Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await login({
            variables: values,
          });
          localStorage.setItem("token", response.data.login.token);
          setSubmitting(false);
          history.push("/users");
        }}
      >
        <Form>
          <Field name="email" type="text" placeholder="Email" />
          <ErrorMessage name="email" component={"div"} />
          <Field name="password" type="password" placeholder="password" />
          <ErrorMessage name="password" component={"div"} />
          <button type="submit" className="login-button">
            <span>Login</span>
          </button>
        </Form>
      </Formik>
      <div className="register">
        <h4>Don't have an account?</h4>
        <Link to="/signup">Signup here</Link>
      </div>
    </div>
  );
};
